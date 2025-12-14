"""Management command to set up user groups and permissions."""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from mpesa_app.models import Assignment, Submission, Subscription, MpesaTransaction


class Command(BaseCommand):
    help = 'Set up Student and Writer groups with their respective permissions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Setting up groups and permissions...'))

        # Get content types
        assignment_ct = ContentType.objects.get_for_model(Assignment)
        submission_ct = ContentType.objects.get_for_model(Submission)
        subscription_ct = ContentType.objects.get_for_model(Subscription)
        transaction_ct = ContentType.objects.get_for_model(MpesaTransaction)

        # Create or get Student group
        student_group, created = Group.objects.get_or_create(name='Student')
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Student group'))
        else:
            self.stdout.write(self.style.WARNING('→ Student group already exists'))

        # Create or get Writer group
        writer_group, created = Group.objects.get_or_create(name='Writer')
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Writer group'))
        else:
            self.stdout.write(self.style.WARNING('→ Writer group already exists'))

        # Clear existing permissions
        student_group.permissions.clear()
        writer_group.permissions.clear()

        # Student permissions
        student_permissions = [
            # Assignment permissions
            Permission.objects.get(codename='add_assignment', content_type=assignment_ct),
            Permission.objects.get(codename='change_assignment', content_type=assignment_ct),
            Permission.objects.get(codename='view_assignment', content_type=assignment_ct),
            # Transaction permissions (for payment tracking)
            Permission.objects.get(codename='add_mpesatransaction', content_type=transaction_ct),
            Permission.objects.get(codename='view_mpesatransaction', content_type=transaction_ct),
        ]

        for perm in student_permissions:
            student_group.permissions.add(perm)
            self.stdout.write(f'  → Added {perm.codename} to Student group')

        # Writer permissions
        writer_permissions = [
            # Assignment permissions
            Permission.objects.get(codename='view_assignment', content_type=assignment_ct),
            # Submission permissions
            Permission.objects.get(codename='add_submission', content_type=submission_ct),
            Permission.objects.get(codename='change_submission', content_type=submission_ct),
            Permission.objects.get(codename='view_submission', content_type=submission_ct),
            # Subscription permissions
            Permission.objects.get(codename='add_subscription', content_type=subscription_ct),
            Permission.objects.get(codename='view_subscription', content_type=subscription_ct),
        ]

        for perm in writer_permissions:
            writer_group.permissions.add(perm)
            self.stdout.write(f'  → Added {perm.codename} to Writer group')

        self.stdout.write(self.style.SUCCESS('\n✓ Groups and permissions set up successfully!'))
        self.stdout.write(self.style.SUCCESS('\nStudent group permissions:'))
        for perm in student_group.permissions.all():
            self.stdout.write(f'  • {perm.codename}')

        self.stdout.write(self.style.SUCCESS('\nWriter group permissions:'))
        for perm in writer_group.permissions.all():
            self.stdout.write(f'  • {perm.codename}')
