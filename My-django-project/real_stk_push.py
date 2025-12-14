"""
Script to initiate a REAL STK push payment using the Lipana API directly.
This bypasses the Django API and calls Lipana directly.
"""
import requests
import json
from datetime import datetime

# Lipana API Configuration
LIPANA_API_KEY = "lip_sk_live_4fffb2ea5d3f04e7bf1de5fa439869006108ee3c4aa6d29a57dbe326f920ef94"
LIPANA_API_BASE = "https://api.lipana.dev"
LIPANA_STK_ENDPOINT = f"{LIPANA_API_BASE}/v1/transactions/push-stk"

# Payment Details
PHONE = "254700686463"
AMOUNT = 10
REFERENCE = f"DirectPay-{datetime.now().strftime('%Y%m%d%H%M%S')}"

def initiate_real_stk_push():
    """Initiate a real STK push payment via Lipana API."""
    
    print("=" * 60)
    print("REAL STK PUSH PAYMENT - LIPANA API DIRECT")
    print("=" * 60)
    
    payload = {
        "phone": PHONE,
        "amount": AMOUNT,
        "reference": REFERENCE
    }
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": LIPANA_API_KEY
    }
    
    print(f"\n📱 Phone: {PHONE}")
    print(f"💰 Amount: KES {AMOUNT}")
    print(f"📝 Reference: {REFERENCE}")
    print(f"🌐 Endpoint: {LIPANA_STK_ENDPOINT}")
    print(f"\n⏳ Sending STK push request...")
    
    try:
        response = requests.post(
            LIPANA_STK_ENDPOINT,
            json=payload,
            headers=headers,
            timeout=30
        )
        
        print(f"\n✓ Response Status: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            result = response.json()
            print(f"\n✓ STK PUSH SENT SUCCESSFULLY!")
            print(f"\nResponse Details:")
            print(json.dumps(result, indent=2))
            print(f"\n📱 CHECK YOUR PHONE {PHONE} FOR M-PESA PROMPT!")
            print(f"\n✓ Payment Status: {result.get('status', 'Unknown')}")
            if 'transactionId' in result:
                print(f"✓ Transaction ID: {result['transactionId']}")
            
        else:
            print(f"\n✗ ERROR: Status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"\n✗ REQUEST FAILED: {e}")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    initiate_real_stk_push()
