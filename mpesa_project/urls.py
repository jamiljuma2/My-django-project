from django.urls import path
from django.contrib import admin
from mpesa_app.views import (
    mpesa_webhook,
    home,
    initiate_stk_push,
    health,
    auth_csrf,
    auth_register,
    auth_login,
    auth_logout,
)

urlpatterns = [
    path('', home, name='home'),
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('api/stk-push/', initiate_stk_push, name='stk-push'),
    # Auth endpoints for frontend
    path('api/auth/csrf/', auth_csrf, name='auth-csrf'),
    path('api/auth/register/', auth_register, name='auth-register'),
    path('api/auth/login/', auth_login, name='auth-login'),
    path('api/auth/logout/', auth_logout, name='auth-logout'),
    path('webhooks/mpesa/', mpesa_webhook, name='mpesa-webhook'),
    path('webhooks/mpesa', mpesa_webhook),  # backward compatibility
]

