"""
Script to display all tracked M-Pesa transactions.
Shows LOCAL database by default. Use --production flag for live server.
"""
import sys
import os

def display_transactions():
    """Display all M-Pesa transactions tracked in the database."""
    
    # Check if production flag is set
    use_production = '--production' in sys.argv or '--prod' in sys.argv
    
    if use_production:
        print("=" * 80)
        print("M-PESA TRANSACTIONS - PRODUCTION (RENDER)")
        print("=" * 80)
        print("\n⚠️  Note: Cannot query production database directly from local script.")
        print("✓ To view production transactions:")
        print("\n1. Open: https://my-django-project-1-0k73.onrender.com/admin/")
        print("2. Log in with superuser credentials")
        print("3. Navigate to: M-Pesa Transactions")
        print("\nDirect link: https://my-django-project-1-0k73.onrender.com/admin/mpesa_app/mpesatransaction/")
        print("=" * 80)
        return
    
    # Setup Django environment for local database
    import django
    
    # Add parent directory to path to find mpesa_project
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpesa_project.settings")
    
    try:
        django.setup()
        from mpesa_app.models import MpesaTransaction
    except Exception as e:
        print(f"❌ Error setting up Django: {e}")
        print("\n💡 Make sure you run this from the project directory:")
        print("   cd c:\\Users\\jumaj\\Downloads\\mpesa_project")
        print("   python My-django-project\\view_transactions.py")
        return
    
    print("=" * 80)
    print("M-PESA TRANSACTIONS - LOCAL DATABASE")
    print("=" * 80)
    print("\n⚠️  Note: This shows LOCAL transactions only.")
    print("✓ To view PRODUCTION transactions, use: python view_transactions.py --production")
    print()
    
    try:
        transactions = MpesaTransaction.objects.all().order_by('-created_at')
    except Exception as e:
        print(f"❌ Database error: {e}")
        print("\n💡 Try running migrations:")
        print("   python manage.py migrate")
        return
    
    if not transactions.exists():
        print("\n❌ NO TRANSACTIONS FOUND IN DATABASE")
        print("\nTo create test transactions, run:")
        print("  python test_stk_push.py")
        print("=" * 80)
        return
    
    print(f"\n✓ Total Transactions: {transactions.count()}")
    print("\n" + "-" * 80)
    
    for tx in transactions:
        # Status icon
        status_icons = {
            'completed': "✓",
            'pending': "⏳",
            'failed': "✗"
        }
        status_icon = status_icons.get(tx.status, "⚠")
        status_color = tx.status.upper()
        
        print(f"\nTransaction #{tx.pk}")
        print(f"  {status_icon} Status: {status_color}")
        print(f"  📱 Phone: {tx.phone}")
        print(f"  💰 Amount: KES {tx.amount}")
        print(f"  🔖 Reference: {tx.reference}")
        print(f"  🆔 Transaction ID: {tx.transaction_id}")
        print(f"  📅 Created: {tx.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        if tx.result_description:
            print(f"  📝 Description: {tx.result_description}")
        
        if tx.updated_at and tx.updated_at != tx.created_at:
            print(f"  🔄 Updated: {tx.updated_at.strftime('%Y-%m-%d %H:%M:%S')}")
        
        print("-" * 80)
    
    # Summary by status
    print("\n📊 SUMMARY BY STATUS:")
    from collections import Counter
    status_counts = Counter(tx.status for tx in transactions)
    
    status_icons = {
        'completed': "✓",
        'pending': "⏳",
        'failed': "✗"
    }
    
    for status, count in status_counts.items():
        icon = status_icons.get(status, "⚠")
        print(f"  {icon} {status.upper()}: {count}")
    
    # Total amount
    completed_txs = [tx for tx in transactions if tx.status == 'completed']
    total_amount = sum(tx.amount for tx in completed_txs)
    print(f"\n💵 Total Completed Payments: KES {total_amount:.2f}")
    print(f"💵 Average Payment: KES {total_amount / len(completed_txs):.2f}" if completed_txs else "")
    
    print("\n" + "=" * 80)
    print("LOCAL ADMIN: http://127.0.0.1:8000/admin/mpesa_app/mpesatransaction/")
    print("PRODUCTION ADMIN: https://my-django-project-1-0k73.onrender.com/admin/mpesa_app/mpesatransaction/")
    print("\n💡 TIP: All NEW transactions are now tracked on PRODUCTION, not local.")
    print("=" * 80)

if __name__ == "__main__":
    display_transactions()
