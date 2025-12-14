"""
Script to verify groups and permissions setup.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpesa_project.settings")
django.setup()

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

def verify_groups():
    """Verify that groups and permissions are set up correctly."""
    print("=" * 60)
    print("GROUP PERMISSIONS VERIFICATION")
    print("=" * 60)
    
    # Check Student group
    try:
        student_group = Group.objects.get(name="Student")
        print(f"\n✓ Student group exists")
        print(f"  Permissions ({student_group.permissions.count()}):")
        for perm in student_group.permissions.all().order_by("codename"):
            print(f"    • {perm.codename} ({perm.name})")
    except Group.DoesNotExist:
        print("\n✗ Student group not found! Run: python manage.py setup_groups")
    
    # Check Writer group
    try:
        writer_group = Group.objects.get(name="Writer")
        print(f"\n✓ Writer group exists")
        print(f"  Permissions ({writer_group.permissions.count()}):")
        for perm in writer_group.permissions.all().order_by("codename"):
            print(f"    • {perm.codename} ({perm.name})")
    except Group.DoesNotExist:
        print("\n✗ Writer group not found! Run: python manage.py setup_groups")
    
    # Check available models
    print(f"\n" + "=" * 60)
    print("AVAILABLE MODELS")
    print("=" * 60)
    
    from mpesa_app.models import MpesaTransaction, Assignment, Submission, Subscription
    
    models = [MpesaTransaction, Assignment, Submission, Subscription]
    for model in models:
        ct = ContentType.objects.get_for_model(model)
        perms = Permission.objects.filter(content_type=ct)
        print(f"\n{model.__name__}:")
        for perm in perms.order_by("codename"):
            print(f"  • {perm.codename}")
    
    print("\n" + "=" * 60)
    print("✓ Verification complete!")
    print("=" * 60)

if __name__ == "__main__":
    verify_groups()
