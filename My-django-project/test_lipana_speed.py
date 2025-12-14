"""
Test direct Lipana API response time for instant STK push.
"""
import requests
import json
import time
from datetime import datetime

LIPANA_API_KEY = "lip_sk_live_4fffb2ea5d3f04e7bf1de5fa439869006108ee3c4aa6d29a57dbe326f920ef94"
LIPANA_API_BASE = "https://api.lipana.dev"
LIPANA_STK_ENDPOINT = f"{LIPANA_API_BASE}/v1/transactions/push-stk"

def test_lipana_response_time():
    """Test Lipana API direct response time."""
    
    payload = {
        "phone": "254700686463",
        "amount": 10,
        "reference": f"DirectSpeed-{datetime.now().strftime('%H%M%S')}"
    }
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": LIPANA_API_KEY
    }
    
    print("=" * 60)
    print("LIPANA API INSTANT RESPONSE TEST")
    print("=" * 60)
    print(f"\nEndpoint: {LIPANA_STK_ENDPOINT}")
    print(f"Phone: {payload['phone']}")
    print(f"Amount: KES {payload['amount']}")
    print(f"\n⏱️  Measuring response time...")
    
    # Measure response time
    start_time = time.time()
    
    try:
        response = requests.post(
            LIPANA_STK_ENDPOINT,
            json=payload,
            headers=headers,
            timeout=10  # Reduced timeout for faster response
        )
        end_time = time.time()
        
        duration_ms = (end_time - start_time) * 1000
        
        print(f"\n✓ Response received in {duration_ms:.0f} ms")
        
        # Performance rating
        if duration_ms < 1000:
            print(f"🚀 BLAZING FAST! Under 1 second ⚡⚡⚡")
        elif duration_ms < 2000:
            print(f"✓ INSTANT! Response under 2 seconds ⚡")
        elif duration_ms < 3000:
            print(f"✓ FAST: Response under 3 seconds")
        else:
            print(f"⚠️  Needs optimization: Over 3 seconds")
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✓ SUCCESS: STK push initiated")
            try:
                result = response.json()
                print("\nResponse Data:")
                print(json.dumps(result, indent=2))
                
                if result.get('success') and result.get('data'):
                    print(f"\n📱 STK PUSH SENT TO PHONE!")
                    print(f"Transaction ID: {result['data'].get('transactionId', 'N/A')}")
                    print(f"Status: {result['data'].get('status', 'N/A')}")
            except:
                print(f"Response Text: {response.text}")
        else:
            print(f"⚠️  Status {response.status_code}: {response.text}")
            
    except requests.exceptions.Timeout:
        end_time = time.time()
        duration_ms = (end_time - start_time) * 1000
        print(f"\n❌ TIMEOUT after {duration_ms:.0f} ms")
        
    except Exception as e:
        end_time = time.time()
        duration_ms = (end_time - start_time) * 1000
        print(f"\n❌ ERROR after {duration_ms:.0f} ms")
        print(f"Error: {e}")
    
    print("\n" + "=" * 60)
    print("PERFORMANCE ANALYSIS:")
    print("• Optimal: < 1000ms (instant feel)")
    print("• Good: 1000-2000ms (acceptable)")
    print("• Fair: 2000-3000ms (noticeable delay)")
    print("• Poor: > 3000ms (needs optimization)")
    print("=" * 60)

if __name__ == "__main__":
    test_lipana_response_time()
