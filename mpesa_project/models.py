
from django.db import models

class MpesaTransaction(models.Model):
    transaction_id = models.CharField(max_length=100)
    amount = models.FloatField()
    phone = models.CharField(max_length=20)
    reference = models.CharField(max_length=100)
    timestamp = models.CharField(max_length=40)

    def __str__(self):
        return f"{self.transaction_id} - {self.amount}"
