# Fix Mock Mode on Render Production

## Issue
Production is returning `"mock": true` which means `LIPANA_ENABLE_MOCK=True` is set on Render.

## Solution

### Update Render Environment Variables

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Select your service: `my-django-project-1-0k73`

2. **Navigate to Environment**
   - Click on **Environment** tab in the left sidebar
   - Look for environment variables

3. **Update/Add These Variables**
   ```
   LIPANA_ENABLE_MOCK = False
   LIPANA_SECRET_KEY = lip_sk_live_4fffb2ea5d3f04e7bf1de5fa439869006108ee3c4aa6d29a57dbe326f920ef94
   LIPANA_API_BASE = https://api.lipana.dev
   LIPANA_SKIP_DNS_CHECK = False
   LIPANA_STK_PATH = /v1/transactions/push-stk
   ```

4. **Save & Redeploy**
   - Click **Save Changes**
   - Render will automatically redeploy your service
   - Wait 2-3 minutes for deployment to complete

### Alternative: Commit and Push

If you've updated `render.yaml`, commit and push changes:

```bash
git add render.yaml
git commit -m "Disable mock mode on production"
git push origin main
```

Render will auto-deploy from GitHub.

## Verify Fix

After redeployment, run:

```bash
python initiate_payment.py
```

**Expected response (no "mock"):**
```json
{
  "success": true,
  "message": "STK push initiated successfully",
  "data": {
    "transactionId": "TXN...",
    "status": "pending",
    "message": "STK push sent to your phone..."
  }
}
```

## If Still Mock Mode

If mock mode persists, check:

1. **Environment variable priority**: Dashboard variables override render.yaml
2. **Secret in Render**: Add `LIPANA_SECRET_KEY` as secret environment variable
3. **Redeploy**: Manual redeploy from Render dashboard

### Manual Redeploy Steps
1. Go to Render Dashboard
2. Select your service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to finish

## Test After Fix

```bash
# Test instant response
python test_instant_response.py

# Test direct Lipana API
python test_lipana_speed.py

# Create production transaction
python initiate_payment.py
```

## Success Indicators

✅ Response has no `"mock": true` field  
✅ Transaction ID starts with `TXN` (real transaction)  
✅ Phone receives actual STK push prompt  
✅ Transaction tracked in production database  

## Current Status

❌ Mock mode enabled  
⏳ Waiting for environment variable update  
🎯 Goal: Real STK push to phone
