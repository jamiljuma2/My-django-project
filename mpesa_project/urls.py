from django.urls import path
from django.contrib import admin
from mpesa_app.views import mpesa_webhook, home, initiate_stk_push, health

urlpatterns = [
    path('', home, name='home'),
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('api/stk-push/', initiate_stk_push, name='stk-push'),
    path('webhooks/mpesa/', mpesa_webhook, name='mpesa-webhook'),
    path('webhooks/mpesa', mpesa_webhook),  # backward compatibility
]