import requests
import json
import subprocess
import time
import sys

# Test configuration
BASE_URL = "https://my-django-project-1-0k73.onrender.com"
TEST_PHONE = "254700686463"  # Replace with test phone number
TEST_AMOUNT = 10  # Test with small amount

def check_server_running():
    """Check if Django server is running"""
    try:
        response = requests.get(BASE_URL, timeout=2)
        return True
    except requests.exceptions.ConnectionError:
        return False

def start_server():
    """Start Django development server"""
    print("Starting Django server...")
    try:
        subprocess.Popen([sys.executable, "manage.py", "runserver"], 
                        stdout=subprocess.PIPE, 
                        stderr=subprocess.PIPE)
        time.sleep(3)  # Wait for server to start
        print("✓ Server started. Waiting for it to be ready...")
        time.sleep(2)
        return True
    except Exception as e:
        print(f"✗ Failed to start server: {e}")
        return False

def test_stk_push():
    """Test STK push initiation"""
    url = f"{BASE_URL}/api/stk-push/"
    
    payload = {
        "phone": TEST_PHONE,
        "amount": TEST_AMOUNT,
        "reference": "TestOrder001"
    }
    
    print(f"\nTesting STK Push to {TEST_PHONE} for KES {TEST_AMOUNT}...")
    print(f"Request URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✓ STK Push initiated successfully!")
            print("Check your phone for the M-Pesa prompt.")
            return True
        else:
            print(f"\n✗ STK Push failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"\n✗ Error: {e}")
        return False

def test_webhook():
    """Test webhook endpoint"""
    url = f"{BASE_URL}/webhooks/mpesa/"
    print(f"\nTesting Webhook endpoint: {url}")
    
    try:
        response = requests.get(url)
        print(f"GET Response Status: {response.status_code}")
        print("Webhook endpoint is accessible.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"✗ Webhook Error: {e}")
        return False

def test_home():
    """Test home endpoint"""
    url = BASE_URL
    print(f"\nTesting Home endpoint: {url}")
    
    try:
        response = requests.get(url)
        print(f"Response Status: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"✗ Home Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("M-Pesa STK Push Testing Suite")
    print("=" * 50)
    
    # Check if server is running
    if not check_server_running():
        print("\n⚠ Django server is not running!")
        print("\nOption 1: Start server automatically (experimental)")
        response = input("Start server now? (y/n): ").lower()
        
        if response == 'y':
            if start_server():
                print("Server should be ready now.\n")
            else:
                print("\nOption 2: Start manually in another terminal:")
                print("  python manage.py runserver\n")
                sys.exit(1)
        else:
            print("\nStart the Django server manually:")
            print("  python manage.py runserver")
            print("\nThen run this script again.\n")
            sys.exit(1)
    
    print("\n" + "=" * 50 + "\n")
    
    # Run tests
    test_home()
    test_webhook()
    test_stk_push()
    
    print("\n" + "=" * 50)
    print("Testing Complete")
    print("=" * 50)
