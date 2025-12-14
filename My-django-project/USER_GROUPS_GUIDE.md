# User Groups and Permissions Guide

## Overview

This Django M-Pesa project includes role-based access control with two user groups:
- **Student Group**: For students who create assignments and make payments
- **Writer Group**: For writers who submit work and manage subscriptions

## User Roles and Permissions

### Student Group Permissions

Students have the following capabilities:

| Permission | Description |
|------------|-------------|
| `add_assignment` | Create new assignments |
| `change_assignment` | Edit existing assignments |
| `view_assignment` | View assignment details |
| `add_mpesatransaction` | Initiate M-Pesa payments |
| `view_mpesatransaction` | View payment transaction history |

**Use Cases:**
- Students can create assignments and assign them to themselves
- Students can modify assignment details before payment
- Students can initiate M-Pesa STK push payments for assignments
- Students can track their payment history

### Writer Group Permissions

Writers have the following capabilities:

| Permission | Description |
|------------|-------------|
| `view_assignment` | View available assignments |
| `add_submission` | Submit work for assignments |
| `change_submission` | Edit submitted work |
| `view_submission` | View submission history |
| `add_subscription` | Subscribe to writer plans |
| `view_subscription` | View subscription details |

**Use Cases:**
- Writers can browse available assignments
- Writers can submit their work with content and file attachments
- Writers can update submissions that need revision
- Writers can subscribe to different plans (Basic, Premium, Pro)
- Writers can track their subscription status

## Setup Instructions

### 1. Initialize Groups and Permissions

Run the management command to set up groups:

```bash
python manage.py setup_groups
```

This command will:
- Create the Student and Writer groups
- Assign all required permissions to each group
- Display a confirmation of permissions assigned

### 2. Assign Users to Groups

#### Via Django Admin (Recommended)

1. Navigate to Django Admin: `http://localhost:8000/admin/`
2. Log in with your superuser account
3. Click on **Users** under Authentication and Authorization
4. Select the user you want to assign to a group
5. Scroll to the **Permissions** section
6. Under **Groups**, select either **Student** or **Writer** (or both)
7. Click **Save**

#### Via Django Shell

```python
python manage.py shell

from django.contrib.auth.models import User, Group

# Get the user
user = User.objects.get(username="john_doe")

# Assign to Student group
student_group = Group.objects.get(name="Student")
user.groups.add(student_group)

# Or assign to Writer group
writer_group = Group.objects.get(name="Writer")
user.groups.add(writer_group)
```

### 3. Create Test Users

Create users for testing:

```bash
# Create a student user
python manage.py createsuperuser --username student1 --email student1@example.com

# Create a writer user
python manage.py createsuperuser --username writer1 --email writer1@example.com
```

Then assign them to their respective groups via the admin interface.

## Models Overview

### Assignment Model
- **Fields**: title, description, created_by, student, due_date, amount, is_paid, payment_transaction
- **Purpose**: Track student assignments and payment status
- **Relationships**: Links to User (student/creator) and MpesaTransaction

### Submission Model
- **Fields**: assignment, writer, content, file_url, status, notes
- **Status Options**: pending, approved, rejected, revision
- **Purpose**: Track writer submissions for assignments
- **Relationships**: Links to Assignment and User (writer)

### Subscription Model
- **Fields**: writer, plan, amount, payment_transaction, start_date, end_date, is_active
- **Plan Options**: basic, premium, pro
- **Purpose**: Manage writer subscription plans
- **Relationships**: Links to User (writer) and MpesaTransaction

## Admin Interface Features

### Assignment Admin
- **List View**: Shows title, student, creator, amount, payment status, due date
- **Filters**: Payment status, due date, creation date
- **Search**: By title, student username, creator username
- **Status Badge**: Color-coded (Green=PAID, Red=UNPAID)

### Submission Admin
- **List View**: Shows assignment, writer, status, submission date
- **Filters**: Status, submission date
- **Search**: By assignment title, writer username, notes
- **Status Badge**: Color-coded (Yellow=Pending, Green=Approved, Red=Rejected, Blue=Revision)

### Subscription Admin
- **List View**: Shows writer, plan, amount, active status, dates
- **Filters**: Plan type, active status, start date
- **Search**: By writer username
- **Status Badge**: Color-coded (Green=ACTIVE, Gray=INACTIVE)

## Workflow Examples

### Student Workflow

1. **Student logs in** to the system
2. **Creates an assignment** via admin interface
   - Fills in title, description, due date, and amount
   - Optionally assigns to themselves
3. **Initiates payment** through STK push API
4. **Views payment status** in M-Pesa transactions
5. **Assignment marked as paid** when payment succeeds

### Writer Workflow

1. **Writer logs in** to the system
2. **Views available assignments** (view-only)
3. **Selects an assignment** to work on
4. **Creates a submission** with content and optional file
5. **Awaits review** (status: pending)
6. **Updates submission** if revision is requested
7. **Manages subscription** for platform access

## Verification

Run the verification script to check group setup:

```bash
python verify_groups.py
```

This will display:
- Existing groups and their permissions
- All available model permissions
- Confirmation that setup is complete

## Troubleshooting

### Groups Not Found

If groups don't exist, run:
```bash
python manage.py setup_groups
```

### User Can't Access Models

1. Verify user is in the correct group
2. Check group permissions in admin
3. Ensure user has `is_active=True`
4. Log out and log back in to refresh permissions

### Permissions Not Working

1. Run migrations: `python manage.py migrate`
2. Re-setup groups: `python manage.py setup_groups`
3. Clear sessions: Delete `db.sqlite3` sessions or restart server
4. Verify in admin: User → Groups → Permissions

## Security Best Practices

1. **Never grant superuser status** to Student or Writer users
2. **Use groups consistently** - don't assign individual permissions
3. **Review permissions regularly** - audit who has access to what
4. **Test with non-superuser accounts** - ensure permissions work correctly
5. **Separate payment permissions** - students can pay, writers cannot

## API Integration

### Making Payments (Student Permission Required)

```python
POST /api/stk-push/
{
    "phone": "254712345678",
    "amount": 500,
    "reference": "Assignment-123"
}
```

### Webhook (System Only)

```python
POST /webhooks/mpesa/
# Handled automatically by Lipana API
```

## Production Notes

- Run `python manage.py setup_groups` after each deployment
- Back up database before modifying permissions
- Test group permissions in staging before production
- Monitor permission changes in audit logs
- Consider additional groups (Admin, Manager) for scaling

---

**Last Updated**: 2025
**Django Version**: 4.2.27
**Python Version**: 3.14.0
