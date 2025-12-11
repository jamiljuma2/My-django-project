# M-Pesa STK Push Integration

## Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start server:**
   ```bash
   python manage.py runserver
   ```

## Testing STK Push

1. **Update test phone number** in `test_stk_push.py`:
   ```python
   TEST_PHONE = "254712345678"  # Your test number
   ```

2. **Run the test script:**
   ```bash
   python test_stk_push.py
   ```

3. **Check your phone** for the M-Pesa STK prompt.

## API Endpoints

- **Home:** `GET /`
- **STK Push:** `POST /api/stk-push/`
  ```json
  {
    "phone": "254712345678",
    "amount": 100,
    "reference": "Order123"
  }
  ```
- **Webhook:** `POST /webhooks/mpesa/`
- **Admin:** `/admin/`

## Manual Testing with cURL

```bash
curl -X POST http://localhost:8000/api/stk-push/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "254712345678", "amount": 10, "reference": "Test001"}'
```

## View Transactions

Visit `http://localhost:8000/admin/` and login to view M-Pesa transactions.

## User Groups & Permissions

The system includes two predefined user groups with specific permissions:

### Student Group
Students can:
- ✓ Add assignments
- ✓ Change assignments  
- ✓ View assignments
- ✓ Add M-Pesa payments
- ✓ View M-Pesa transactions

### Writer Group
Writers can:
- ✓ View assignments
- ✓ Add submissions
- ✓ Change submissions
- ✓ View submissions
- ✓ Add subscriptions
- ✓ View subscriptions

### Setup Groups
Run this command to create the groups and assign permissions:
```bash
python manage.py setup_groups
```

### Assign Users to Groups
1. Go to Django Admin at `/admin/`
2. Click on **Users**
3. Select a user
4. Scroll to **Permissions** section
5. In **Groups**, select **Student** or **Writer**
6. Click **Save**

## Production Deployment

Set environment variables:
```bash
export DJANGO_SECRET_KEY="your-secret-key"
export DEBUG="False"
export ALLOWED_HOSTS="yourdomain.com"
export LIPANA_SECRET_KEY="your-lipana-secret"
```
