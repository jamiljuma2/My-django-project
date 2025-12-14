# M-Pesa Admin Interface Guide

## Overview
The Django admin interface provides comprehensive transaction management for M-Pesa payments. Access it at:
- **Local**: `http://localhost:8000/admin`
- **Production**: `https://my-django-project-1-0k73.onrender.com/admin`

## Credentials
- **Username**: admin
- **Password**: (As configured during setup)

---

## Transaction Management

### Transaction Status Workflow
Transactions progress through the following statuses:

```
pending → completed
       ↘ failed
        ↘ timeout
```

**Status Descriptions:**
- **Pending**: STK push sent, waiting for customer response
- **Completed**: Payment received successfully
- **Failed**: Customer declined or API error occurred
- **Timeout**: No response within timeout period

### Viewing Transactions

#### List View
The transaction list displays:
- **Transaction ID**: Unique Lipana identifier
- **Phone**: Customer phone number (254XXXXXXXXX)
- **Amount**: Transaction amount in KES with currency formatting
- **Status**: Color-coded badge:
  - 🟢 **Green** = Completed
  - 🟡 **Yellow** = Pending
  - 🔴 **Red** = Failed
  - ⚫ **Gray** = Timeout
- **Reference**: Transaction description
- **Created**: Transaction initiation timestamp

#### Filtering
Filter transactions by:
- **Status**: Pending, Completed, Failed, Timeout
- **Date Range**: Created date range using date hierarchy

#### Search
Search for transactions by:
- Transaction ID
- Phone number
- Reference description
- Checkout request ID

### Transaction Details

When viewing a transaction, you'll see organized sections:

#### 1. Transaction Information (Always Visible)
- Transaction ID (Read-only)
- Checkout Request ID (Read-only)
- Reference (Transaction description)
- Status (Current payment status)

#### 2. Customer & Amount (Always Visible)
- Phone number
- Amount in KES

#### 3. API Response (Expandable Section)
- Result Code
- Result Description

#### 4. Timestamps (Expandable Section)
- Original API timestamp
- Created date
- Last updated date

---

## Bulk Actions

### Mark as Completed
Select one or more transactions and choose "✓ Mark selected as Completed" to:
- Batch update status to "Completed"
- Useful for manual verification or corrections

**Usage:**
1. Select transactions via checkboxes
2. Click "✓ Mark selected as Completed" in the Actions dropdown
3. Confirm the operation

### Mark as Failed
Select transactions and choose "✗ Mark selected as Failed" to:
- Batch update status to "Failed"
- Record payment failures or reversals

---

## Data Integrity Features

### Read-Only Fields
These fields are immutable and prevent accidental modifications:
- Transaction ID (API-generated)
- Checkout Request ID
- Timestamp (API response time)
- Created/Updated dates

### Disabled Operations
- **Deletion Disabled**: Transactions cannot be deleted for audit trail compliance
- **Manual Creation Disabled**: Only API can create transactions

### Performance Optimizations
- Database indexes on frequently queried fields
- Efficient ordering by creation date
- Optimized query execution for large datasets

---

## Common Tasks

### Find Recent Transactions
1. Go to M-Pesa Transactions
2. Use Date Hierarchy to select date
3. Filter by Status if needed

### Verify Customer Payment
1. Search for customer's phone number
2. View transaction details
3. Check Status and Result Code

### Export Transaction Data
1. Select desired filters
2. Use browser's print/save functionality
3. Or export via Django admin export feature

### Investigate Failed Payment
1. Filter by Status = "Failed"
2. Click transaction to view details
3. Check Result Code and Result Description
4. Take corrective action if needed

---

## Model Fields Reference

### Core Fields
| Field | Type | Description |
|-------|------|-------------|
| transaction_id | CharField(100) | Unique Lipana transaction identifier |
| amount | DecimalField(10,2) | Amount in KES |
| phone | CharField(20) | Customer phone (254XXXXXXXXX) |
| reference | CharField(100) | Transaction reference/order number |
| timestamp | CharField(40) | API response timestamp |

### Status & Tracking
| Field | Type | Description |
|-------|------|-------------|
| status | CharField(20) | Transaction status (choice field) |
| result_code | CharField(10) | Lipana API result code |
| result_description | TextField | Detailed API response |
| checkout_request_id | CharField(100) | STK push request ID |

### Timestamps
| Field | Type | Description |
|-------|------|-------------|
| created_at | DateTimeField | When record was created |
| updated_at | DateTimeField | Last modification time |

---

## Database Performance

### Indexes
Automatic database indexes on:
- `transaction_id` (unique)
- `phone` + creation order
- `status` + creation order
- Improves filter and search performance

### Ordering
- Default: Most recent transactions first
- Uses `id` for efficiency
- Customizable via Django ORM

---

## Troubleshooting

### Missing Status Field
- Ensure database migration `0002_alter_mpesatransaction_options_and_more` is applied
- Run: `python manage.py migrate`

### Transactions Not Appearing
- Check database connection
- Verify filters aren't too restrictive
- Check transaction timestamps vs. current date

### Admin Interface Slow
- Use filters to reduce dataset size
- Search by specific transaction ID
- Check database disk space

---

## Security Notes

- Admin access requires authentication
- All changes are logged by Django
- Transaction deletion is disabled
- Read-only fields prevent accidental overwrites
- Sensitive data (phone, amount) is visible only to admins

---

## Future Enhancements

Potential improvements:
- Transaction export (CSV, PDF)
- Webhook retry/resend functionality
- Customer communication templates
- Payment reporting dashboard
- Batch refund processing
- Transaction analytics charts

