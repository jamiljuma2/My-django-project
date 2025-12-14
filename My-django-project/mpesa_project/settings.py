import os
from dotenv import load_dotenv
import dj_database_url

# Load environment variables from .env file
load_dotenv()

def _get_setting(name, default=None, required=False):
    val = os.environ.get(name)
    if val:
        return val
    if required:
        raise RuntimeError(f"Missing required setting: {name}")
    return default

SECRET_KEY = _get_setting('DJANGO_SECRET_KEY', required=True)

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

raw_hosts = os.environ.get('ALLOWED_HOSTS', '')
ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(',') if h.strip()]
if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'my-django-project-1-0k73.onrender.com']

INSTALLED_APPS = [
    'mpesa_app',
    'corsheaders',
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.sessions',
    'django.contrib.messages',
]

ROOT_URLCONF = 'mpesa_project.urls'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # WhiteNoise for static files on production
    'corsheaders.middleware.CorsMiddleware',
    'mpesa_project.middleware.CorrelationIdMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'mpesa_project.middleware.RequestResponseLoggerMiddleware',
]

LIPANA_PUBLISHABLE_KEY = _get_setting('LIPANA_PUBLISHABLE_KEY', required=True)
LIPANA_SECRET_KEY = _get_setting('LIPANA_SECRET_KEY', required=True)
LIPANA_API_BASE = _get_setting('LIPANA_API_BASE', 'https://api.lipana.io')
LIPANA_STK_PATH = _get_setting('LIPANA_STK_PATH', '/v1/stk/push')
LIPANA_SKIP_DNS_CHECK = os.environ.get('LIPANA_SKIP_DNS_CHECK', 'True') == 'True'
LIPANA_ENABLE_MOCK = os.environ.get(
    'LIPANA_ENABLE_MOCK',
    'True' if DEBUG else 'False'
) == 'True'

if not DEBUG:
    if not SECRET_KEY or SECRET_KEY == 'dev-secret-key':
        raise RuntimeError("DJANGO_SECRET_KEY must be set in production")
    if not LIPANA_SECRET_KEY:
        raise RuntimeError("LIPANA_SECRET_KEY must be set in production")

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=False
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Production security settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

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

# CORS configuration for frontend -> backend communication
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://my-django-project-1-0k73.onrender.com',
    'https://edulink-writers.vercel.app',
]
CORS_ALLOW_CREDENTIALS = True

# CSRF trusted origins for dev and production
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://my-django-project-1-0k73.onrender.com',
    'https://edulink-writers.vercel.app',
]

