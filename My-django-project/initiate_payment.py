"""
Script to initiate an STK push payment on PRODUCTION (Render).
All transactions will be tracked on the live server.
"""
import requests
import json
from datetime import datetime
import random

# PRODUCTION URL - All transactions tracked on Render
PRODUCTION_URL = "https://my-django-project-1-0k73.onrender.com"

def create_payment():
    """Create and track an STK push payment on production."""
    
    # Payment details
    phone = "254700686463"
    amount = 50
    reference = f"Order-{random.randint(1000, 9999)}"
    
    print("=" * 60)
    print("STK PUSH PAYMENT - PRODUCTION (RENDER)")
    print("=" * 60)
    print(f"\n🌐 Production Server: {PRODUCTION_URL}")
    print(f"📱 Phone: {phone}")
    print(f"💰 Amount: KES {amount}")
    print(f"📝 Reference: {reference}")
    
    # Send request to PRODUCTION API
    print(f"\n⏳ Sending STK push request to production...")
    
    payload = {
        "phone": phone,
        "amount": amount,
        "reference": reference
    }
    
    try:
        response = requests.post(
            f"{PRODUCTION_URL}/api/stk-push/",
            json=payload,
            timeout=15
        )
        
        print(f"\n✓ Response Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"\n✓ STK PUSH SENT TO PRODUCTION!")
            print(f"\nResponse:")
            print(json.dumps(result, indent=2))
            
            print(f"\n📱 STK Push sent to {phone}")
            print(f"💰 Payment request: KES {amount}")
            print(f"\n✓ Transaction tracked on PRODUCTION database")
        else:
            result = response.json() if response.headers.get('content-type') == 'application/json' else response.text
            print(f"\n⚠ Status {response.status_code}")
            print(f"Response: {result}")
    
    except requests.exceptions.Timeout:
        print(f"\n⏱️ Request timeout - server may be slow")
    except Exception as e:
        print(f"\n✗ Error: {e}")
    
    print(f"\n" + "=" * 60)
    print("VIEW TRANSACTION ON PRODUCTION")
    print("=" * 60)
    print(f"\n✓ All transactions tracked on live server")
    print(f"📊 Admin URL: {PRODUCTION_URL}/admin/mpesa_app/mpesatransaction/")
    print(f"\n1. Open admin URL")
    print(f"2. Log in with superuser credentials")
    print(f"3. View transaction in M-Pesa Transactions")
    print("=" * 60)

if __name__ == "__main__":
    create_payment()
