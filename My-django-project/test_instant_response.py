"""
Test script to verify STK push responds instantly.
"""
import requests
import json
import time
from datetime import datetime

def test_instant_stk_push():
    """Test STK push response time."""
    
    url = "https://my-django-project-1-0k73.onrender.com/api/stk-push/"
    
    payload = {
        "phone": "254700686463",
        "amount": 10,
        "reference": f"SpeedTest-{datetime.now().strftime('%H%M%S')}"
    }
    
    print("=" * 60)
    print("STK PUSH INSTANT RESPONSE TEST")
    print("=" * 60)
    print(f"\nEndpoint: {url}")
    print(f"Phone: {payload['phone']}")
    print(f"Amount: KES {payload['amount']}")
    print(f"\n⏱️  Testing response time...")
    
    # Measure response time
    start_time = time.time()
    
    try:
        response = requests.post(url, json=payload, timeout=15)
        end_time = time.time()
        
        duration_ms = (end_time - start_time) * 1000
        
        print(f"\n✓ Response received in {duration_ms:.0f} ms")
        
        # Check if instant (under 2 seconds)
        if duration_ms < 2000:
            print(f"✓ INSTANT! Response under 2 seconds ⚡")
        elif duration_ms < 5000:
            print(f"⚠️  Acceptable: Response under 5 seconds")
        else:
            print(f"❌ SLOW: Response took over 5 seconds")
        
        print(f"\nStatus Code: {response.status_code}")
        
        try:
            result = response.json()
            print("\nResponse Data:")
            print(json.dumps(result, indent=2))
        except:
            print(f"Response Text: {response.text}")
            
    except requests.exceptions.Timeout:
        end_time = time.time()
        duration_ms = (end_time - start_time) * 1000
        print(f"\n❌ TIMEOUT after {duration_ms:.0f} ms")
        print("The API took too long to respond")
        
    except Exception as e:
        end_time = time.time()
        duration_ms = (end_time - start_time) * 1000
        print(f"\n❌ ERROR after {duration_ms:.0f} ms")
        print(f"Error: {e}")
    
    print("\n" + "=" * 60)
    print("\nRECOMMENDATIONS:")
    print("• Target response time: < 1000ms for instant feel")
    print("• Acceptable: < 2000ms")
    print("• Needs optimization: > 3000ms")
    print("=" * 60)

if __name__ == "__main__":
    test_instant_stk_push()
