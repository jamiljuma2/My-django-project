# Production Tracking Configuration

## ✅ Configuration Complete

All future M-Pesa transactions are now tracked on **PRODUCTION (Render)**, not local database.

## Transaction Scripts

### 1. **initiate_payment.py** - Production Tracking ✓
```bash
python initiate_payment.py
```
- **Endpoint**: https://my-django-project-1-0k73.onrender.com/api/stk-push/
- **Database**: Production (Render)
- **Tracking**: All transactions saved to live database

### 2. **real_stk_push.py** - Direct Lipana API
```bash
python real_stk_push.py
```
- **Endpoint**: https://api.lipana.dev/v1/transactions/push-stk
- **Database**: No direct DB interaction
- **Tracking**: Via webhook callback to production

### 3. **test_stk_push.py** - Production Testing
```bash
python test_stk_push.py
```
- **Endpoint**: https://my-django-project-1-0k73.onrender.com
- **Database**: Production (Render)
- **Purpose**: Full integration test with production

### 4. **create_render_transaction.py** - Production Test
```bash
python create_render_transaction.py
```
- **Endpoint**: https://my-django-project-1-0k73.onrender.com/api/stk-push/
- **Database**: Production (Render)
- **Purpose**: Create test transaction on live server

## View Transactions

### Production Transactions (Live)
```bash
# Open in browser
https://my-django-project-1-0k73.onrender.com/admin/mpesa_app/mpesatransaction/
```

**All new transactions appear here** ✓

### Local Transactions (Development Only)
```bash
# View local database
python view_transactions.py

# View production (redirects to admin)
python view_transactions.py --production
```

## Database Separation

| Environment | Database | URL |
|-------------|----------|-----|
| **Production (LIVE)** | PostgreSQL on Render | https://my-django-project-1-0k73.onrender.com |
| **Local (DEV)** | SQLite (db.sqlite3) | http://127.0.0.1:8000 |

**Important:** Local and production databases are completely separate. Transactions created locally will NOT appear on production and vice versa.

## Quick Reference

### Create Production Transaction
```bash
python initiate_payment.py
```

### View Production Transactions
1. Open: https://my-django-project-1-0k73.onrender.com/admin/
2. Login with superuser
3. Click "M-Pesa Transactions"

### Test Production STK Push
```bash
python test_instant_response.py  # Tests response time
python test_lipana_speed.py      # Tests Lipana API directly
```

## Configuration Changes Made

### ✅ Updated Files

1. **initiate_payment.py**
   - Changed from local Django ORM to production API
   - All transactions now hit Render endpoint
   - Saved in production database

2. **view_transactions.py**
   - Added --production flag
   - Shows warning about local vs production
   - Redirects to production admin

3. **All test scripts**
   - Already configured for production
   - Hit Render endpoints by default

## Production Workflow

```
User runs script
      ↓
Hits Production API (Render)
      ↓
Creates transaction in Production DB
      ↓
Sends STK push via Lipana
      ↓
Webhook updates Production DB
      ↓
View in Production Admin ✓
```

## Local Development

If you need to test locally:
1. Start local server: `python manage.py runserver`
2. Use curl or Postman to hit: `http://127.0.0.1:8000/api/stk-push/`
3. Transactions saved to local `db.sqlite3`

**But remember:** Production scripts now bypass local database entirely.

## Verification

### Check Transaction Location
```bash
# This will show production URL
python initiate_payment.py
# Output includes: "Transaction tracked on PRODUCTION database"
```

### Confirm Production Tracking
1. Run: `python create_render_transaction.py`
2. Open: https://my-django-project-1-0k73.onrender.com/admin/
3. Login and verify transaction appears

## Benefits

✅ **Single source of truth** - All transactions in production  
✅ **Consistent tracking** - No local/production confusion  
✅ **Real-world testing** - Test against live environment  
✅ **Production parity** - Development mirrors production  
✅ **Easy monitoring** - One admin to check  

## Summary

🎯 **All future transactions = PRODUCTION tracking**  
📊 **View transactions**: https://my-django-project-1-0k73.onrender.com/admin/  
🚀 **Scripts updated**: All point to Render endpoint  
✅ **Configuration**: Complete and tested
