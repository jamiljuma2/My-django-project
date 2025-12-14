"""
Create test transactions on Render production for admin viewing.
"""
import requests
import json
from datetime import datetime

RENDER_URL = "https://my-django-project-1-0k73.onrender.com"

def create_production_transaction():
    """Create a transaction on Render production."""
    
    payload = {
        "phone": "254700686463",
        "amount": 25,
        "reference": f"RenderTest-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    }
    
    print("=" * 60)
    print("CREATING TRANSACTION ON RENDER PRODUCTION")
    print("=" * 60)
    print(f"\nEndpoint: {RENDER_URL}/api/stk-push/")
    print(f"Phone: {payload['phone']}")
    print(f"Amount: KES {payload['amount']}")
    print(f"Reference: {payload['reference']}")
    
    print(f"\n⏳ Sending request to production...")
    
    try:
        response = requests.post(
            f"{RENDER_URL}/api/stk-push/",
            json=payload,
            timeout=15
        )
        
        print(f"\n✓ Response Status: {response.status_code}")
        
        try:
            result = response.json()
            print("\nResponse:")
            print(json.dumps(result, indent=2))
            
            if response.status_code in [200, 201]:
                print("\n✓ TRANSACTION CREATED ON RENDER!")
                print(f"\n📊 View in admin:")
                print(f"   {RENDER_URL}/admin/mpesa_app/mpesatransaction/")
            else:
                print("\n⚠ Check response for issues")
                
        except:
            print(f"Response text: {response.text}")
            
    except requests.exceptions.Timeout:
        print("\n⏱️ Request timeout - server may be slow")
    except Exception as e:
        print(f"\n✗ Error: {e}")
    
    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print(f"1. Open: {RENDER_URL}/admin/")
    print("2. Log in with superuser credentials")
    print("3. Click 'M-Pesa Transactions'")
    print("4. You should see the transaction listed")
    print("=" * 60)

if __name__ == "__main__":
    create_production_transaction()
