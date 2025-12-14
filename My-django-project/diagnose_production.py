"""
Diagnose production API configuration issues.
"""
import requests
import json

RENDER_URL = "https://my-django-project-1-0k73.onrender.com"

def diagnose_production():
    """Diagnose production configuration."""
    
    print("=" * 70)
    print("PRODUCTION CONFIGURATION DIAGNOSTIC")
    print("=" * 70)
    
    # Check Django settings endpoint
    print("\n1. Checking Django Settings...")
    try:
        response = requests.get(f"{RENDER_URL}/health/", timeout=10)
        print(f"   ✓ Server responding: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Server error: {e}")
        return
    
    # Check if settings are accessible
    print("\n2. Testing STK Push Endpoint (to see error details)...")
    payload = {
        "phone": "254700686463",
        "amount": 1,
        "reference": "Diagnostic-Test"
    }
    
    try:
        response = requests.post(
            f"{RENDER_URL}/api/stk-push/",
            json=payload,
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"\n   Error Response:")
            try:
                error_data = response.json()
                print(f"   {json.dumps(error_data, indent=6)}")
            except:
                print(f"   {response.text[:500]}")
        else:
            result = response.json()
            print(f"\n   Success Response:")
            print(f"   {json.dumps(result, indent=6)}")
            
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print("\n" + "=" * 70)
    print("TROUBLESHOOTING STEPS")
    print("=" * 70)
    
    print("""
1. CHECK RENDER ENVIRONMENT VARIABLES
   - Go to: https://dashboard.render.com/
   - Select service: my-django-project-1-0k73
   - Click "Environment" tab
   - Verify these variables are set:
   
   LIPANA_SECRET_KEY = lip_sk_live_4fffb2ea5d3f04e7bf1de5fa439869006108ee3c4aa6d29a57dbe326f920ef94
   LIPANA_API_BASE = https://api.lipana.dev
   LIPANA_STK_PATH = /v1/transactions/push-stk
   LIPANA_ENABLE_MOCK = False
   LIPANA_SKIP_DNS_CHECK = False

2. IF VARIABLES ARE MISSING OR WRONG
   - Add/Update the above variables
   - Click "Save Changes"
   - Wait 2-3 minutes for redeploy

3. FORCE REDEPLOY
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for deployment to complete

4. TEST AGAIN
   - Run: python initiate_payment.py
   
5. IF STILL GETTING 502 ERROR
   - Check Render logs: Click "Logs" tab in dashboard
   - Look for Django error messages
   - May need to restart service manually

EXPECTED SUCCESSFUL RESPONSE:
{
  "success": true,
  "message": "STK push initiated successfully",
  "data": {
    "transactionId": "TXN...",
    "status": "pending",
    "message": "STK push sent to your phone..."
  }
}

If you still see "mock": true or 404 errors after updating
environment variables, the variables are not being loaded properly.
    """)
    
    print("=" * 70)

if __name__ == "__main__":
    diagnose_production()
