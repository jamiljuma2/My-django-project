from django.contrib import admin
from django.utils.html import format_html
from django.db.models import QuerySet
from django.http import HttpRequest

from .models import MpesaTransaction, Assignment, Submission, Subscription


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


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    """Admin interface for Assignment model."""
    
    list_display = ('title', 'student', 'created_by', 'amount', 'is_paid_badge', 'due_date', 'created_at')
    list_filter = ('is_paid', 'due_date', 'created_at')
    search_fields = ('title', 'student__username', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'due_date'
    
    fieldsets = (
        ('Assignment Details', {
            'fields': ('title', 'description', 'due_date', 'amount')
        }),
        ('Users', {
            'fields': ('created_by', 'student')
        }),
        ('Payment Status', {
            'fields': ('is_paid', 'payment_transaction')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def is_paid_badge(self, obj):
        """Display payment status with colored badge."""
        if obj.is_paid:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">PAID</span>'
            )
        return format_html(
            '<span style="background-color: #dc3545; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">UNPAID</span>'
        )
    is_paid_badge.short_description = 'Payment Status'


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    """Admin interface for Submission model."""
    
    list_display = ('assignment', 'writer', 'status_badge', 'submitted_at', 'updated_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('assignment__title', 'writer__username', 'notes')
    readonly_fields = ('submitted_at', 'updated_at')
    date_hierarchy = 'submitted_at'
    
    fieldsets = (
        ('Submission Details', {
            'fields': ('assignment', 'writer', 'status')
        }),
        ('Content', {
            'fields': ('content', 'file_url')
        }),
        ('Feedback', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('submitted_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """Display submission status with colored badge."""
        colors = {
            'pending': '#ffc107',
            'approved': '#28a745',
            'rejected': '#dc3545',
            'revision': '#17a2b8'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            colors.get(obj.status, '#6c757d'),
            obj.status.upper()
        )
    status_badge.short_description = 'Status'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin interface for Subscription model."""
    
    list_display = ('writer', 'plan', 'amount', 'is_active_badge', 'start_date', 'end_date')
    list_filter = ('plan', 'is_active', 'start_date')
    search_fields = ('writer__username',)
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Subscription Details', {
            'fields': ('writer', 'plan', 'amount')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'is_active')
        }),
        ('Payment', {
            'fields': ('payment_transaction',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def is_active_badge(self, obj):
        """Display subscription status with colored badge."""
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">ACTIVE</span>'
            )
        return format_html(
            '<span style="background-color: #6c757d; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">INACTIVE</span>'
        )
    is_active_badge.short_description = 'Status'

