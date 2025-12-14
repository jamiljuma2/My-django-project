from django.urls import path
from django.contrib import admin
from django.shortcuts import render
from mpesa_app.views import (
    current_user,
    health,
    home,
    initiate_stk_push,
    list_transactions,
    login_user,
    logout_user,
    mpesa_webhook,
    register_user,
)
from django.http import JsonResponse, HttpResponse
from django.db import connection

def login_page(request):
    return render(request, 'login.html')

def register_page(request):
    return render(request, 'register.html')

def status_view(request):
    # Simple health check: verify DB connection and return stats
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            db_ok = True
    except Exception as exc:
        db_ok = False
        return JsonResponse({
            'status': 'error',
            'message': 'Database connection failed',
            'error': str(exc),
        }, status=500)

    return JsonResponse({
        'status': 'success',
        'message': 'Backend and DB reachable',
        'data': {
            'db': db_ok,
        }
    })

urlpatterns = [
    path('', home, name='home'),
    path('login/', login_page, name='login-page'),
    path('register/', register_page, name='register-page'),
    path('favicon.ico', lambda r: HttpResponse(status=204)),  # Silence favicon requests
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('api/stk-push/', initiate_stk_push, name='stk-push'),
    path('api/transactions/', list_transactions, name='transactions-list'),
    path('api/drf-auth/register/', register_user, name='drf-register'),
    path('api/drf-auth/login/', login_user, name='drf-login'),
    path('api/drf-auth/logout/', logout_user, name='drf-logout'),
    path('api/drf-auth/user/', current_user, name='drf-user'),
    path('webhooks/mpesa/', mpesa_webhook, name='mpesa-webhook'),
    path('webhooks/mpesa', mpesa_webhook),  # backward compatibility
    path('api/status/', status_view),  # Add status endpoint
]
