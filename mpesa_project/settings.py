import os

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
ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(',') if h.strip()] or ['127.0.0.1', 'localhost']

INSTALLED_APPS = [
    'mpesa_app',
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
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

LIPANA_PUBLISHABLE_KEY = _get_setting('LIPANA_PUBLISHABLE_KEY', required=True)
LIPANA_SECRET_KEY = _get_setting('LIPANA_SECRET_KEY', required=True)
LIPANA_API_BASE = _get_setting('LIPANA_API_BASE', 'https://api.lipana.io')
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
