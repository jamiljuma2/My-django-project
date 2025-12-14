import os
from pathlib import Path
from datetime import timedelta

# Load environment variables from .env file if it exists (for development)
try:
    from dotenv import load_dotenv
    BASE_DIR = Path(__file__).resolve().parent.parent
    env_path = BASE_DIR / '.env'
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass  # python-dotenv not installed, skip

def _get_setting(name, default=None, required=False):
    val = os.environ.get(name)
    if val:
        return val
    if required:
        raise RuntimeError(f"Missing required setting: {name}")
    return default

# For development, use a default secret key if not set
SECRET_KEY = _get_setting('DJANGO_SECRET_KEY', default='dev-secret-key-change-in-production-!@#$%^&*()')

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ["my-django-project-1-0k73.onrender.com", "127.0.0.1", "localhost"]
if DEBUG:
    # Allow local testing hosts in development
    ALLOWED_HOSTS += ["127.0.0.1", "localhost"]

INSTALLED_APPS = [
    'mpesa_app',
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
]

ROOT_URLCONF = 'mpesa_project.urls'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# For development, allow these to be optional (will use mock mode)
LIPANA_PUBLISHABLE_KEY = _get_setting('LIPANA_PUBLISHABLE_KEY', default='dev-publishable-key')
LIPANA_SECRET_KEY = _get_setting('LIPANA_SECRET_KEY', default='dev-secret-key')
LIPANA_API_BASE = _get_setting('LIPANA_API_BASE', 'https://api.lipana.io')
LIPANA_SKIP_DNS_CHECK = os.environ.get('LIPANA_SKIP_DNS_CHECK', 'True') == 'True'
LIPANA_ENABLE_MOCK = os.environ.get(
    'LIPANA_ENABLE_MOCK',
    'True' if DEBUG else 'False'
) == 'True'

if not DEBUG:
    if not SECRET_KEY or SECRET_KEY == 'dev-secret-key-change-in-production-!@#$%^&*()':
        raise RuntimeError("DJANGO_SECRET_KEY must be set in production")
    if not LIPANA_SECRET_KEY or LIPANA_SECRET_KEY == 'dev-secret-key':
        raise RuntimeError("LIPANA_SECRET_KEY must be set in production")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_URL = '/static/'

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    "https://edu-link-writers.vercel.app"
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Production security settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'
    CSRF_COOKIE_SAMESITE = 'None'
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    # In development, browsers may block SameSite=None without Secure; keep default

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# Allow credentials (cookies) in cross-origin requests
CORS_ALLOW_CREDENTIALS = True

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    "https://edu-link-writers.vercel.app",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# Simple JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

