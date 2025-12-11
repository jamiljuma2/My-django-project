from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
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

