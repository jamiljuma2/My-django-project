# M-Pesa Model Design Documentation

## Architecture Overview

The `MpesaTransaction` model is the central data structure for tracking M-Pesa payment interactions through the Lipana API.

```
User (Phone) → STK Push Request → Lipana API → MpesaTransaction (Database)
                                                          ↓
                                                   Status Tracking
                                                   Result Logging
                                                   Audit Trail
```

---

## Data Model Design

### Field Organization

#### 1. **Core Transaction Identity**
```python
transaction_id: CharField(100, unique=True, db_index=True)
  ↳ Lipana-generated unique identifier
  ↳ Primary business key
  ↳ Indexed for fast lookups
```

#### 2. **Financial Transaction Data**
```python
amount: DecimalField(max_digits=10, decimal_places=2)
  ↳ Transaction amount in KES
  ↳ Decimal for precise monetary values (not float)
  ↳ Validates minimum 0.01 KES
  ↳ Minimum real transaction: 10 KES (API requirement)

phone: CharField(20, validators=[RegexValidator(r"^254\d{9}$")])
  ↳ Customer phone number
  ↳ Format: 254XXXXXXXXX (E.164 standard)
  ↳ Indexed for customer lookups
  ↳ Regex validation at database level
```

#### 3. **Transaction Reference**
```python
reference: CharField(100, db_index=True)
  ↳ External reference/order ID
  ↳ Links to application's order system
  ↳ Searchable for reconciliation
```

#### 4. **Status Management**
```python
status: CharField(20, choices=[...], default="pending", db_index=True)
  ↳ Workflow state: pending → {completed, failed, timeout}
  ↳ Indexed for fast status filtering
  ↳ Choice field for data integrity
  
STATUS_CHOICES = [
    ("pending", "Pending"),      # STK sent, awaiting response
    ("completed", "Completed"),  # Payment successful
    ("failed", "Failed"),        # Declined or error
    ("timeout", "Timeout"),      # No response within timeout
]
```

#### 5. **API Response Data**
```python
result_code: CharField(10, null=True, blank=True)
  ↳ Lipana API result code
  ↳ Examples: 0 (success), 1 (error), etc.
  ↳ Optional for status tracking

result_description: TextField(null=True, blank=True)
  ↳ Human-readable API response message
  ↳ Detailed error descriptions
  ↳ Used for debugging and customer communication
  
checkout_request_id: CharField(100, unique=True, null=True, blank=True)
  ↳ STK push request identifier
  ↳ Links to webhook callbacks
  ↳ Unique to prevent duplicates
```

#### 6. **Timestamp Fields**
```python
timestamp: CharField(40)
  ↳ API response timestamp
  ↳ Original time from Lipana
  ↳ String format for API compatibility

created_at: DateTimeField(auto_now_add=True, db_index=True)
  ↳ When record was created in system
  ↳ Never changes after creation
  ↳ Indexed for date-range queries

updated_at: DateTimeField(auto_now=True)
  ↳ Last modification timestamp
  ↳ Auto-updates on each save
  ↳ Tracks record history
```

---

## Design Principles

### 1. **Decimal Over Float**
```python
# ✓ GOOD
amount = DecimalField(max_digits=10, decimal_places=2)

# ✗ AVOID
amount = FloatField()  # Precision errors with currency
```
**Rationale**: Financial transactions require exact decimal precision. Floats can accumulate rounding errors.

### 2. **Choices for Status**
```python
# ✓ GOOD - Data integrity
status = CharField(choices=STATUS_CHOICES)

# ✗ AVOID - No validation
status = CharField()  # Could be any string
```
**Rationale**: Ensures only valid statuses are recorded. Prevents typos and inconsistencies.

### 3. **Validation at Model Level**
```python
phone = CharField(
    validators=[
        RegexValidator(r"^254\d{9}$", "Phone must be in format 254XXXXXXXXX")
    ]
)
```
**Rationale**: Catches invalid data before database insertion. Provides clear error messages.

### 4. **Database Indexes for Performance**
```python
class Meta:
    indexes = [
        models.Index(fields=["phone", "-id"]),      # Customer lookups
        models.Index(fields=["status", "-id"]),     # Status filtering
    ]
```
**Rationale**: Frequently queried combinations get dedicated indexes. Improves query performance.

### 5. **Immutable Core Fields**
```python
# Read-only in admin interface:
- transaction_id
- checkout_request_id
- timestamp
- created_at/updated_at
```
**Rationale**: Prevents accidental modification of audit trail. Maintains data integrity.

---

## Model Methods

### Status Checking Properties
```python
@property
def is_completed(self) -> bool:
    """Check if transaction is completed."""
    return self.status == "completed"

@property
def is_pending(self) -> bool:
    """Check if transaction is pending."""
    return self.status == "pending"

@property
def is_failed(self) -> bool:
    """Check if transaction failed."""
    return self.status in ["failed", "timeout"]
```
**Usage**: `if transaction.is_completed: ...`

### Status Transition Methods
```python
def mark_completed(self, result_code=None, result_description=None):
    """Mark transaction as completed."""
    self.status = "completed"
    if result_code:
        self.result_code = result_code
    if result_description:
        self.result_description = result_description
    self.save()

def mark_failed(self, result_code=None, result_description=None):
    """Mark transaction as failed."""
    self.status = "failed"
    if result_code:
        self.result_code = result_code
    if result_description:
        self.result_description = result_description
    self.save()
```
**Usage**: `transaction.mark_completed(result_code="0")`

---

## Querying Patterns

### Common Queries
```python
# Get pending transactions
pending = MpesaTransaction.objects.filter(status="pending")

# Get customer's transactions
customer_txns = MpesaTransaction.objects.filter(phone="254700686463")

# Get completed transactions in date range
from django.utils import timezone
from datetime import timedelta

today = timezone.now().date()
completed_today = MpesaTransaction.objects.filter(
    status="completed",
    created_at__date=today
)

# Get total amount for customer
from django.db.models import Sum
total = MpesaTransaction.objects.filter(
    phone="254700686463",
    status="completed"
).aggregate(Sum('amount'))

# Get recent transactions
recent = MpesaTransaction.objects.all().order_by('-created_at')[:10]
```

### Manager Extensions (Optional)
```python
# Could be added in future for convenience methods:
class MpesaQuerySet(models.QuerySet):
    def completed(self):
        return self.filter(status="completed")
    
    def pending(self):
        return self.filter(status="pending")
    
    def by_phone(self, phone):
        return self.filter(phone=phone)

class MpesaManager(models.Manager):
    def get_queryset(self):
        return MpesaQuerySet(self.model)
    
    def completed(self):
        return self.get_queryset().completed()
```

---

## Webhook Integration

### Receiving Webhook Callbacks
```python
# When Lipana API sends webhook for transaction completion:
def handle_mpesa_webhook(checkout_request_id, result_code, result_description):
    transaction = MpesaTransaction.objects.get(
        checkout_request_id=checkout_request_id
    )
    
    if result_code == "0":
        transaction.mark_completed(result_code, result_description)
    else:
        transaction.mark_failed(result_code, result_description)
```

---

## Data Integrity Features

### Constraints
```python
transaction_id: unique=True          # No duplicate transactions
phone: validators=[RegexValidator]   # Valid phone format only
amount: validators=[MinValueValidator(0.01)]  # Positive amount
status: choices=STATUS_CHOICES       # Only valid statuses
created_at: auto_now_add=True        # Cannot be modified
```

### Prevent Data Loss
```python
class Meta:
    # Prevent accidental deletions
    # (Enforced in admin)
```

### Audit Trail
```python
# Track changes with:
- created_at: When transaction entered system
- updated_at: Last change timestamp
- result_code/description: What Lipana returned
```

---

## Database Schema

```sql
CREATE TABLE mpesa_app_mpesatransaction (
    id INTEGER PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    reference VARCHAR(100) NOT NULL,
    timestamp VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    result_code VARCHAR(10),
    result_description TEXT,
    checkout_request_id VARCHAR(100) UNIQUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE INDEX mpesa_app_m_phone_d0479c_idx ON mpesa_app_mpesatransaction(phone, id DESC);
CREATE INDEX mpesa_app_m_status_c54996_idx ON mpesa_app_mpesatransaction(status, id DESC);
```

---

## Evolution Path

### v1.0 (Current)
- Basic transaction tracking
- Status workflow
- API integration

### v2.0 (Planned)
```python
# Add customer relationship
class Customer(models.Model):
    phone = CharField(unique=True)
    name = CharField()
    email = EmailField()
    created_at = DateTimeField(auto_now_add=True)

class MpesaTransaction(models.Model):
    customer = ForeignKey(Customer, on_delete=models.PROTECT)
    # ... other fields ...
```

### v3.0 (Planned)
```python
# Add refund tracking
class MpesaRefund(models.Model):
    original_transaction = ForeignKey(MpesaTransaction)
    refund_amount = DecimalField()
    status = CharField(choices=[...])
    reason = TextField()
    created_at = DateTimeField(auto_now_add=True)
```

---

## Testing Considerations

### Model Testing
```python
def test_transaction_creation():
    txn = MpesaTransaction.objects.create(
        transaction_id="TXN123",
        amount=Decimal("10.00"),
        phone="254700686463",
        reference="Order #123",
        timestamp="2025-12-11T10:30:45Z",
    )
    assert txn.is_pending
    assert not txn.is_completed

def test_mark_completed():
    txn = MpesaTransaction.objects.create(...)
    txn.mark_completed(result_code="0")
    assert txn.is_completed
    assert txn.result_code == "0"
```

---

## Performance Notes

- **Indexes**: Designed for common filters (phone, status)
- **Query Optimization**: Use `select_related()` if adding FK later
- **Bulk Operations**: Use `.bulk_update()` for mass status changes
- **Archival**: Consider moving old transactions to archive table after 1 year

