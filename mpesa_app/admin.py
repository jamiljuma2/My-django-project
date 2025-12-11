from django.contrib import admin
from django.utils.html import format_html
from django.db.models import QuerySet
from django.http import HttpRequest

from .models import MpesaTransaction


@admin.register(MpesaTransaction)
class MpesaTransactionAdmin(admin.ModelAdmin):
    """Customized admin interface for M-Pesa transactions."""

    # Display settings
    list_display = [
        "transaction_id",
        "phone",
        "amount_display",
        "status_badge",
        "reference",
        "created_at_display",
    ]
    list_filter = [
        "status",
        "created_at",
    ]
    search_fields = [
        "transaction_id",
        "phone",
        "reference",
        "checkout_request_id",
    ]
    readonly_fields = [
        "transaction_id",
        "checkout_request_id",
        "timestamp",
        "created_at",
        "updated_at",
        "result_code",
        "result_description",
    ]

    # Fieldsets organization
    fieldsets = (
        (
            "Transaction Information",
            {
                "fields": (
                    "transaction_id",
                    "checkout_request_id",
                    "reference",
                    "status",
                )
            },
        ),
        (
            "Customer & Amount",
            {
                "fields": ("phone", "amount"),
                "description": "Customer phone number and transaction amount in KES",
            },
        ),
        (
            "API Response",
            {
                "fields": ("result_code", "result_description"),
                "classes": ("collapse",),
                "description": "Response details from Lipana API",
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("timestamp", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    # Ordering and pagination
    ordering = ["-created_at"]
    date_hierarchy = "created_at"
    list_per_page = 50

    # Actions
    actions = ["mark_completed", "mark_failed"]

    def amount_display(self, obj: MpesaTransaction) -> str:
        """Display amount with currency."""
        return format_html(
            '<span style="font-weight: bold; color: #28a745;">KES {}</span>',
            f"{obj.amount:,.2f}",
        )

    amount_display.short_description = "Amount"

    def status_badge(self, obj: MpesaTransaction) -> str:
        """Display status as colored badge."""
        colors = {
            "completed": "#28a745",  # green
            "pending": "#ffc107",    # yellow
            "failed": "#dc3545",     # red
            "timeout": "#6c757d",    # gray
        }
        color = colors.get(obj.status, "#6c757d")
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display(),
        )

    status_badge.short_description = "Status"

    def created_at_display(self, obj: MpesaTransaction) -> str:
        """Display creation time in readable format."""
        return obj.created_at.strftime("%d %b %Y, %H:%M")

    created_at_display.short_description = "Created"

    # Admin actions
    def mark_completed(self, request: HttpRequest, queryset: QuerySet) -> None:
        """Mark selected transactions as completed."""
        updated = queryset.update(status="completed")
        self.message_user(request, f"✓ Marked {updated} transaction(s) as completed.")

    mark_completed.short_description = "✓ Mark selected as Completed"

    def mark_failed(self, request: HttpRequest, queryset: QuerySet) -> None:
        """Mark selected transactions as failed."""
        updated = queryset.update(status="failed")
        self.message_user(request, f"✗ Marked {updated} transaction(s) as failed.")

    mark_failed.short_description = "✗ Mark selected as Failed"

    def has_delete_permission(self, request: HttpRequest, obj=None) -> bool:
        """Prevent deletion of transactions for data integrity."""
        return False

    def has_add_permission(self, request: HttpRequest) -> bool:
        """Prevent manual transaction creation - only API can create."""
        return False

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        """Optimize queryset with select_related and prefetch_related."""
        queryset = super().get_queryset(request)
        return queryset.select_related()  # Add any foreign keys if added later

