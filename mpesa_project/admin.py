"""Admin site customization for M-Pesa Payment System."""

from django.contrib import admin
from django.utils.html import format_html

# Customize the admin site
admin.site.site_header = format_html(
    '<span style="color: white; font-weight: 600;">💳 M-Pesa Payment Administration</span>'
)
admin.site.site_title = "M-Pesa Admin"
admin.site.index_title = "Transaction Management Dashboard"

# Customize admin styles
admin.site.enable_nav_sidebar = True
