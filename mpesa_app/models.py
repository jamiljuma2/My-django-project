from django.db import models


class MpesaTransaction(models.Model):
    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    amount = models.FloatField()
    phone = models.CharField(max_length=20)
    reference = models.CharField(max_length=100)
    timestamp = models.CharField(max_length=40)

    def __str__(self) -> str:  # pragma: no cover - string repr
        return f"{self.transaction_id} - {self.amount}"

