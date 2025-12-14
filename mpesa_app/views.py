import hashlib
import hmac
import json
import logging
import socket
import time
from urllib.parse import urlparse

import requests
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core import signing
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import MpesaTransaction  # This should work if models.py exists

logger = logging.getLogger(__name__)


def ok(message: str = "success", data: dict | None = None, status_code: int = 200):
    payload = {
        "status": "success",
        "message": message,
        "data": data or {},
        "error": None,
    }
    return JsonResponse(payload, status=status_code)


def fail(message: str, error: str | None = None, data: dict | None = None, status_code: int = 400):
    payload = {
        "status": "error",
        "message": message,
        "data": data or {},
        "error": error,
    }
    return JsonResponse(payload, status=status_code)


def home(request):
    return render(request, 'home.html')


def health(request):
    return ok("service healthy", {"service": "mpesa", "debug": settings.DEBUG})


# --- Lightweight token auth helpers (stateless Bearer tokens) ---
TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7  # 7 days
TOKEN_SALT = "drf-auth-token"


def _issue_token(user: User) -> str:
    signer = signing.TimestampSigner(salt=TOKEN_SALT)
    payload = {"uid": user.id, "iat": int(time.time())}
    return signer.sign_object(payload)


def _user_payload(user: User) -> dict:
    # Determine role based on user permissions
    if user.is_superuser:
        role = "admin"
    elif user.is_staff:
        role = "manager"
    else:
        role = "user"
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": role,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser
    }


def _authenticate_request(request):
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None, fail("Authorization header missing or invalid", status_code=401)

    token = header.removeprefix("Bearer ").strip()
    signer = signing.TimestampSigner(salt=TOKEN_SALT)
    try:
        payload = signer.unsign_object(token, max_age=TOKEN_MAX_AGE_SECONDS)
    except signing.SignatureExpired:
        return None, fail("Token expired", status_code=401)
    except signing.BadSignature:
        return None, fail("Invalid token", status_code=401)

    user_id = payload.get("uid")
    user = User.objects.filter(id=user_id).first()
    if not user:
        return None, fail("User not found", status_code=401)
    return user, None


def list_transactions(request):
    if request.method != "GET":
        return fail("Method not allowed", status_code=405)
    qs = MpesaTransaction.objects.order_by('-id')[:50]
    data = [
        {
            "id": t.id,
            "transaction_id": t.transaction_id,
            "phone": t.phone,
            "amount": t.amount,
            "reference": t.reference,
            "status": getattr(t, 'status', ''),
            "result_description": getattr(t, 'result_description', ''),
            "timestamp": getattr(t, 'timestamp', ''),
        }
        for t in qs
    ]
    return ok("latest transactions", {"items": data, "count": len(data)})


@csrf_exempt
def register_user(request):
    """JSON registration for JWT clients.

    Accepts: username (required), password or password1/password2 (required),
    email (optional), first_name (optional), last_name (optional), phone (optional).
    Returns: token + basic user info.
    """
    if request.method != "POST":
        return fail("Method not allowed", status_code=405)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return fail("Invalid JSON", status_code=400)

    username = (payload.get("username") or "").strip()
    password = (
        payload.get("password")
        or payload.get("password1")
        or payload.get("passwordOne")
        or ""
    )
    password_confirm = (
        payload.get("password2")
        or payload.get("confirm_password")
        or payload.get("confirmPassword")
        or payload.get("passwordTwo")
        or payload.get("password_confirmation")
        or ""
    )
    email = (payload.get("email") or "").strip()
    first_name = (payload.get("first_name") or payload.get("firstName") or "").strip()
    last_name = (payload.get("last_name") or payload.get("lastName") or "").strip()
    _phone = (
        payload.get("phone")
        or payload.get("phone_number")
        or payload.get("phoneNumber")
        or ""
    ).strip()

    if not username or not password:
        return fail("username and password are required", status_code=400)

    # If a confirm password is provided, enforce match
    if password_confirm and password != password_confirm:
        return fail("passwords do not match", status_code=400)

    if User.objects.filter(username=username).exists():
        return fail("username already exists", status_code=409)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
    )

    token = _issue_token(user)
    return ok("registered", {"token": token, "user": _user_payload(user)})


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return fail("Method not allowed", status_code=405)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return fail("Invalid JSON", status_code=400)

    # Accept username or email (snake_case or camelCase)
    username = (payload.get("username") or "").strip()
    email = (payload.get("email") or payload.get("emailAddress") or "").strip()
    password = payload.get("password") or ""

    if not (username or email) or not password:
        return fail("username (or email) and password are required", status_code=400)

    # If email is provided but username is empty, map email to username for authenticate
    lookup_username = username
    if not lookup_username and email:
        user_obj = User.objects.filter(email=email).first()
        if user_obj:
            lookup_username = user_obj.username

    if not lookup_username:
        return fail("User not found", status_code=404)

    user = authenticate(username=lookup_username, password=password)
    if not user:
        return fail("Invalid credentials", status_code=401)

    token = _issue_token(user)
    return ok("authenticated", {"token": token, "user": _user_payload(user)})


@csrf_exempt
def logout_user(request):
    # Stateless tokens cannot be revoked server-side without a store/blacklist.
    # Clients should delete their stored token. We return success for symmetry.
    if request.method != "POST":
        return fail("Method not allowed", status_code=405)
    return ok("logged out", {})


@csrf_exempt
def current_user(request):
    user, error = _authenticate_request(request)
    if error:
        return error
    return ok("current user", {"user": _user_payload(user)})


@csrf_exempt
def initiate_stk_push(request):
    if request.method != "POST":
        return fail("Method not allowed", status_code=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return fail("Invalid JSON", status_code=400)

    phone = data.get("phone")
    amount = data.get("amount")
    reference = data.get("reference", "Payment")

    if not phone or not amount:
        return fail("phone and amount are required", status_code=400)

    # Validate phone number format
    if not phone.startswith("254") or len(phone) != 12:
        return fail("Invalid phone format. Use 254xxxxxxxxx", status_code=400)

    try:
        amount = float(amount)
        if amount <= 0:
            return fail("Amount must be greater than 0", status_code=400)
    except ValueError:
        return fail("Amount must be a number", status_code=400)

    # Lipana STK Push API endpoint (configurable path)
    api_base = settings.LIPANA_API_BASE.rstrip("/")
    path = settings.LIPANA_STK_PATH
    if not path.startswith("/"):
        path = f"/{path}"
    url = f"{api_base}{path}"
    
    headers = {
        "x-api-key": settings.LIPANA_SECRET_KEY,
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
                return ok("Mocked STK push (DNS resolution failed)", {
                    "mock": True,
                    "status": "queued",
                    "phone": phone,
                    "amount": int(amount),
                    "reference": reference,
                })
            return fail(
                "Cannot resolve Lipana API host",
                error=f"host={hostname} details={str(e)}",
                status_code=503,
            )

    # Create transaction record immediately for instant tracking
    transaction = MpesaTransaction.objects.create(
        phone=phone,
        amount=amount,
        reference=reference,
        transaction_id=f"PENDING-{phone}-{int(amount)}",
        status="pending",
    )
    
    try:
        # Use shorter timeout for faster response (10s instead of 30s)
        response = requests.post(url, json=payload, headers=headers, timeout=10, verify=True)
        
        try:
            response_data = response.json()
        except ValueError:
            # Response is not valid JSON - might be HTML error page or empty response
            logger.error(f"Lipana API returned non-JSON response: Status {response.status_code}, Body: {response.text[:200]}")
            if settings.LIPANA_ENABLE_MOCK:
                logger.info("Returning mocked STK response due to invalid API response and LIPANA_ENABLE_MOCK=True")
                return ok("Mocked STK push (invalid API response)", {
                    "mock": True,
                    "status": "queued",
                    "phone": phone,
                    "amount": int(amount),
                    "reference": reference,
                })
            return fail(
                "Lipana API returned invalid response",
                error=f"status={response.status_code} body={response.text[:100]}",
                status_code=502,
            )
        
        logger.info(f"Lipana API Response: {response.status_code} - {response_data}")
        
        # Update transaction with real transaction ID from API
        if response.status_code in [200, 201] and response_data.get('data', {}).get('transactionId'):
            transaction.transaction_id = response_data['data']['transactionId']
            transaction.result_description = response_data.get('data', {}).get('message', 'STK push sent')
            transaction.save(update_fields=['transaction_id', 'result_description'])
        
        # Return immediately - don't wait for any other processing
        # Ensure wrapper even if upstream returns custom shape
        if response.status_code in [200, 201]:
            return ok("STK push sent", response_data.get("data") or response_data)
        else:
            return fail("Upstream error", error=response_data.get("error") or json.dumps(response_data)[:200], status_code=response.status_code)
            
    except requests.exceptions.Timeout:
        logger.error("Lipana API timeout")
        transaction.status = "timeout"
        transaction.result_description = "Request timeout - please try again"
        transaction.save(update_fields=['status', 'result_description'])
        return fail("Request timeout. Try again.", data={"transaction_id": transaction.id}, status_code=504)
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error: {str(e)}")
        root = getattr(e, "__cause__", None)
        name_error = isinstance(root, socket.gaierror) or "NameResolutionError" in str(e)
        if (settings.LIPANA_ENABLE_MOCK and name_error):
            logger.info("Returning mocked STK response due to connection resolution error and LIPANA_ENABLE_MOCK=True")
            return ok("Mocked STK push (connection resolution error)", {
                "mock": True,
                "status": "queued",
                "phone": phone,
                "amount": int(amount),
                "reference": reference,
            })
        if name_error:
            return fail("Cannot resolve Lipana API host", error=f"host={hostname} details={str(e)}", status_code=503)
        transaction.status = "failed"
        transaction.result_description = f"Network error: {str(e)[:100]}"
        transaction.save(update_fields=['status', 'result_description'])
        return fail("Network error. Check your internet connection and Lipana API availability.", error=str(e), data={"transaction_id": transaction.id}, status_code=503)
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        transaction.status = "failed"
        transaction.result_description = f"Request failed: {str(e)[:100]}"
        transaction.save(update_fields=['status', 'result_description'])
        return fail("Upstream request failed", error=str(e), data={"transaction_id": transaction.id}, status_code=502)


@csrf_exempt
def mpesa_webhook(request):
    if request.method != "POST":
        return ok("Mpesa Webhook OK")

    body = request.body or b""
    signature = request.headers.get("X-Lipana-Signature", "")
    if not signature:
        return fail("Missing signature", status_code=400)

    computed = hmac.new(
        settings.LIPANA_SECRET_KEY.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(computed, signature):
        return fail("Invalid signature", status_code=400)

    try:
        data = json.loads(body.decode() or "{}")
    except json.JSONDecodeError:
        return fail("Invalid JSON", status_code=400)

    transaction_id = data.get("transaction_id")
    if not transaction_id:
        return fail("transaction_id is required", status_code=400)

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

    return ok("Webhook processed", {"created": created})

