"""
Check M-Pesa transactions on Render production server.
"""
import requests
import json

RENDER_URL = "https://my-django-project-1-0k73.onrender.com"

def check_production_transactions():
    """Check if transactions endpoint exists on production."""
    
    print("=" * 60)
    print("CHECKING RENDER PRODUCTION TRANSACTIONS")
    print("=" * 60)
    
    # Try health endpoint first
    print(f"\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{RENDER_URL}/health/", timeout=10)
        print(f"   ✓ Server is up! Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # Check admin URL (will redirect to login)
    print(f"\n2. Admin interface:")
    print(f"   URL: {RENDER_URL}/admin/")
    print(f"   Transactions: {RENDER_URL}/admin/mpesa_app/mpesatransaction/")
    
    # Try to access admin (will need login)
    try:
        response = requests.get(f"{RENDER_URL}/admin/", timeout=10, allow_redirects=False)
        if response.status_code == 302:
            print(f"   ✓ Admin is accessible (redirects to login)")
        else:
            print(f"   Status: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print(f"\n" + "=" * 60)
    print("TO VIEW TRANSACTIONS ON RENDER:")
    print("=" * 60)
    print(f"\n1. Open: {RENDER_URL}/admin/")
    print(f"2. Log in with your superuser credentials")
    print(f"3. Navigate to: M-Pesa Transactions")
    print(f"\nDirect link: {RENDER_URL}/admin/mpesa_app/mpesatransaction/")
    print("\n" + "=" * 60)
    print("\nNOTE: Production transactions are separate from local database.")
    print("Transactions created locally won't appear on Render.")
    print("To create production transactions, use the Render API endpoint.")
    print("=" * 60)

if __name__ == "__main__":
    check_production_transactions()
