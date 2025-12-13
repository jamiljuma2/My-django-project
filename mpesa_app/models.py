from django.db import models
from django.utils import timezone


class MpesaTransaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    amount = models.FloatField()
    phone = models.CharField(max_length=20)
    reference = models.CharField(max_length=100)
    timestamp = models.CharField(max_length=40)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    result_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'M-Pesa Transaction'
        verbose_name_plural = 'M-Pesa Transactions'

    def __str__(self) -> str:  # pragma: no cover - string repr
        return f"{self.transaction_id} - KES {self.amount} ({self.status})"

