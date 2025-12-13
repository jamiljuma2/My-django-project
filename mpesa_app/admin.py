from django.contrib import admin
from .models import MpesaTransaction


@admin.register(MpesaTransaction)
class MpesaTransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'phone', 'amount', 'status', 'reference', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['transaction_id', 'phone', 'reference']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 50
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Transaction Info', {
            'fields': ('transaction_id', 'status', 'amount', 'phone', 'reference')
        }),
        ('Details', {
            'fields': ('timestamp', 'result_description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

