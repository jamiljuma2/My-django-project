from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
from django.contrib.auth.models import User
from django.utils import timezone


class MpesaTransaction(models.Model):
    """M-Pesa transaction record for tracking payments."""

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("timeout", "Timeout"),
    ]

    # Core transaction fields (keeping original names for compatibility)
    transaction_id = models.CharField(
        max_length=100, unique=True, db_index=True, help_text="Unique Lipana transaction ID"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Transaction amount in KES",
    )
    phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(r"^254\d{9}$", "Phone must be in format 254XXXXXXXXX")],
        db_index=True,
        help_text="Customer phone number (254XXXXXXXXX)",
    )
    reference = models.CharField(
        max_length=100, db_index=True, help_text="Transaction reference/description"
    )
    timestamp = models.CharField(
        max_length=40, help_text="M-Pesa API response timestamp"
    )

    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        db_index=True,
        help_text="Current transaction status",
    )

    # Optional fields for webhook response
    result_code = models.CharField(
        max_length=10, blank=True, null=True, help_text="Lipana API result code"
    )
    result_description = models.TextField(
        blank=True, null=True, help_text="API response description"
    )
    checkout_request_id = models.CharField(
        max_length=100, blank=True, null=True, unique=True, help_text="STK request ID"
    )

    # Timestamps for tracking
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ["-id"]
        verbose_name = "M-Pesa Transaction"
        verbose_name_plural = "M-Pesa Transactions"
        indexes = [
            models.Index(fields=["phone", "-id"]),
            models.Index(fields=["status", "-id"]),
        ]

    def __str__(self) -> str:
        return f"{self.transaction_id} - KES {self.amount} ({self.get_status_display()})"

    @property
    def is_completed(self) -> bool:
        """Check if transaction is completed."""
        return self.status == "completed"

    @property
    def is_pending(self) -> bool:
        """Check if transaction is pending."""
        return self.status == "pending"

    @property
    def is_failed(self) -> bool:
        """Check if transaction failed."""
        return self.status in ["failed", "timeout"]

    def mark_completed(self, result_code: str = None, result_description: str = None):
        """Mark transaction as completed."""
        self.status = "completed"
        if result_code:
            self.result_code = result_code
        if result_description:
            self.result_description = result_description
        self.save()

    def mark_failed(self, result_code: str = None, result_description: str = None):
        """Mark transaction as failed."""
        self.status = "failed"
        if result_code:
            self.result_code = result_code
        if result_description:
            self.result_description = result_description
        self.save()


class Assignment(models.Model):
    """Student assignments with payment tracking."""
    
    title = models.CharField(max_length=200, help_text="Assignment title")
    description = models.TextField(help_text="Assignment description")
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assignments_created"
    )
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="assignments", null=True, blank=True
    )
    due_date = models.DateTimeField(help_text="Assignment deadline")
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Payment amount in KES"
    )
    is_paid = models.BooleanField(default=False)
    payment_transaction = models.ForeignKey(
        MpesaTransaction, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Assignment"
        verbose_name_plural = "Assignments"

    def __str__(self):
        return f"{self.title} - {self.student.username if self.student else 'Unassigned'}"


class Submission(models.Model):
    """Assignment submissions by writers."""
    
    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("revision", "Needs Revision"),
    ]
    
    assignment = models.ForeignKey(
        Assignment, on_delete=models.CASCADE, related_name="submissions"
    )
    writer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="submissions"
    )
    content = models.TextField(help_text="Submission content")
    file_url = models.URLField(blank=True, null=True, help_text="Attachment URL")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    notes = models.TextField(blank=True, help_text="Reviewer notes")
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-submitted_at"]
        verbose_name = "Submission"
        verbose_name_plural = "Submissions"

    def __str__(self):
        return f"Submission for {self.assignment.title} by {self.writer.username}"


class Subscription(models.Model):
    """Writer subscription plans."""
    
    PLAN_CHOICES = [
        ("basic", "Basic Plan"),
        ("premium", "Premium Plan"),
        ("pro", "Professional Plan"),
    ]
    
    writer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="subscriptions"
    )
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_transaction = models.ForeignKey(
        MpesaTransaction, on_delete=models.SET_NULL, null=True, blank=True
    )
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(help_text="Subscription expiry date")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Subscription"
        verbose_name_plural = "Subscriptions"

    def __str__(self):
        return f"{self.writer.username} - {self.get_plan_display()} ({self.start_date.date()})"
