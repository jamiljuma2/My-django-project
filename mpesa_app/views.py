import hashlib
import hmac
import json
import requests
import logging
import socket
from urllib.parse import urlparse

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import MpesaTransaction  # This should work if models.py exists

logger = logging.getLogger(__name__)


def home(request):
    return JsonResponse({"message": "Welcome to the M-Pesa API Project", "status": "active"})


def health(request):
    return JsonResponse({"status": "ok", "service": "mpesa", "debug": settings.DEBUG})


# --- Auth helpers for frontend ---
@csrf_exempt
def auth_csrf(request):
    """Return a CSRF token so the frontend can include it in subsequent requests."""
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


@csrf_exempt
def auth_register(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()
    email = (data.get("email") or "").strip()

    if not username or not password:
        return JsonResponse({"error": "username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "username already exists"}, status=409)

    user = User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse({"id": user.id, "username": user.username, "email": user.email}, status=201)


@csrf_exempt
def auth_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return JsonResponse({"error": "username and password are required"}, status=400)

    user = authenticate(request, username=username, password=password)
    if not user:
        return JsonResponse({"error": "invalid credentials"}, status=401)

    login(request, user)
    return JsonResponse({"id": user.id, "username": user.username, "email": user.email})


@csrf_exempt
def auth_logout(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    logout(request)
    return JsonResponse({"status": "logged out"})


@csrf_exempt
def initiate_stk_push(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    phone = data.get("phone")
    amount = data.get("amount")
    reference = data.get("reference", "Payment")

    if not phone or not amount:
        return JsonResponse({"error": "phone and amount are required"}, status=400)

    # Validate phone number format
    if not phone.startswith("254") or len(phone) != 12:
        return JsonResponse({"error": "Invalid phone format. Use 254xxxxxxxxx"}, status=400)

    try:
        amount = float(amount)
        if amount <= 0:
            return JsonResponse({"error": "Amount must be greater than 0"}, status=400)
    except ValueError:
        return JsonResponse({"error": "Amount must be a number"}, status=400)

    # Lipana STK Push API endpoint
    api_base = settings.LIPANA_API_BASE.rstrip("/")
    url = f"{api_base}/v1/stk/push"
    
    headers = {
        "Authorization": f"Bearer {settings.LIPANA_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "phone": phone,
        "amount": int(amount),
        "reference": reference,
        "callback_url": request.build_absolute_uri('/webhooks/mpesa/'),
    }

    parsed = urlparse(api_base)
    hostname = parsed.hostname

    if hostname and not settings.LIPANA_SKIP_DNS_CHECK:
        try:
            socket.gethostbyname(hostname)
        except socket.gaierror as e:
            logger.error(f"DNS resolution failed for {hostname}: {e}")
            if settings.LIPANA_ENABLE_MOCK:
                logger.info("Returning mocked STK response due to DNS failure and LIPANA_ENABLE_MOCK=True")
                return JsonResponse({
                    "mock": True,
                    "status": "queued",
                    "message": "Mocked STK push (DNS resolution failed)",
                    "phone": phone,
                    "amount": int(amount),
                    "reference": reference,
                }, status=200)
            return JsonResponse({
                "error": f"Cannot resolve Lipana API host ({hostname}). Check DNS/network connectivity, set LIPANA_API_BASE to a reachable host, or set LIPANA_SKIP_DNS_CHECK=True.",
                "details": str(e),
            }, status=503)

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30, verify=True)
        response_data = response.json()
        
        logger.info(f"Lipana API Response: {response.status_code} - {response_data}")
        
        if response.status_code in [200, 201]:
            return JsonResponse(response_data, status=response.status_code)
        else:
            return JsonResponse(response_data, status=response.status_code)
            
    except requests.exceptions.Timeout:
        logger.error("Lipana API timeout")
        return JsonResponse({"error": "Request timeout. Try again."}, status=504)
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error: {str(e)}")
        root = getattr(e, "__cause__", None)
        name_error = isinstance(root, socket.gaierror) or "NameResolutionError" in str(e)
        if (settings.LIPANA_ENABLE_MOCK and name_error):
            logger.info("Returning mocked STK response due to connection resolution error and LIPANA_ENABLE_MOCK=True")
            return JsonResponse({
                "mock": True,
                "status": "queued",
                "message": "Mocked STK push (connection resolution error)",
                "phone": phone,
                "amount": int(amount),
                "reference": reference,
            }, status=200)
        if name_error:
            return JsonResponse({
                "error": f"Cannot resolve Lipana API host ({hostname}). Check DNS/network connectivity, set LIPANA_API_BASE to a reachable host, or set LIPANA_SKIP_DNS_CHECK=True.",
                "details": str(e),
            }, status=503)
        return JsonResponse({
            "error": "Network error. Check your internet connection and Lipana API availability.",
            "details": str(e),
        }, status=503)
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return JsonResponse({"error": "Upstream request failed", "details": str(e)}, status=502)


@csrf_exempt
def mpesa_webhook(request):
    if request.method != "POST":
        return HttpResponse("Mpesa Webhook OK", status=200)

    body = request.body or b""
    signature = request.headers.get("X-Lipana-Signature", "")
    if not signature:
        return HttpResponse("Missing signature", status=400)

    computed = hmac.new(
        settings.LIPANA_SECRET_KEY.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(computed, signature):
        return HttpResponse("Invalid signature", status=400)

    try:
        data = json.loads(body.decode() or "{}")
    except json.JSONDecodeError:
        return HttpResponse("Invalid JSON", status=400)

    transaction_id = data.get("transaction_id")
    if not transaction_id:
        return HttpResponse("transaction_id is required", status=400)

    defaults = {
        "amount": data.get("amount", 0),
        "phone": data.get("phone", ""),
        "reference": data.get("reference", ""),
        "timestamp": data.get("timestamp", ""),
    }
    _, created = MpesaTransaction.objects.update_or_create(
        transaction_id=transaction_id,
        defaults=defaults,
    )

    return JsonResponse({"status": "ok", "created": created})

