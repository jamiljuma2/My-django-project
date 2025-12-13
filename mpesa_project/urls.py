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
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView,
)

urlpatterns = [
    path('', home, name='home'),
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('api/stk-push/', initiate_stk_push, name='stk-push'),
    # Legacy simple auth endpoints
    path('api/auth/csrf/', auth_csrf, name='auth-csrf'),
    path('api/auth/register/', auth_register, name='auth-register'),
    path('api/auth/login/', auth_login, name='auth-login'),
    path('api/auth/logout/', auth_logout, name='auth-logout'),
    # DRF token-based auth endpoints
    path('api/drf-auth/register/', RegisterView.as_view(), name='drf-register'),
    path('api/drf-auth/login/', LoginView.as_view(), name='drf-login'),
    path('api/drf-auth/logout/', LogoutView.as_view(), name='drf-logout'),
    path('api/drf-auth/user/', UserDetailView.as_view(), name='drf-user'),
    path('webhooks/mpesa/', mpesa_webhook, name='mpesa-webhook'),
    path('webhooks/mpesa', mpesa_webhook),  # backward compatibility
]

