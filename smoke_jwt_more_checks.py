import os
import json
import traceback
import sys
import django
from django.test import Client

# Set working directory to My-django-project
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'My-django-project'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mpesa_project.settings')
django.setup()

CLIENT = Client()
HOST_EXTRA = {'HTTP_HOST': 'localhost'}


def write_out(out, label, response):
    out.write(f"\n== {label} status= {response.status_code}\n")
    out.write(f"Content-Type: {response.get('Content-Type','')}\n")
    cid_header = response.get('X-Correlation-ID') or response.get('x-correlation-id')
    if cid_header:
        out.write(f"X-Correlation-ID: {cid_header}\n")
    try:
        body = response.content.decode(errors='replace')
    except Exception:
        body = ''
    out.write(body + "\n")


def safe_json(response):
    try:
        return json.loads(response.content.decode() or '{}')
    except Exception:
        return {}


def do_get(path, access_token=None):
    extra = dict(HOST_EXTRA)
    if access_token:
        extra['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
    return CLIENT.get(path, **extra)


def main():
    try:
        with open('smoke_jwt_more_output.txt', 'w', encoding='utf-8') as out:
            # Status check
            r_status = do_get('/api/status/')
            write_out(out, 'STATUS', r_status)
            status_json = safe_json(r_status)
            # Extract CID from body if present
            body_cid = None
            try:
                data = status_json.get('data') or {}
                body_cid = data.get('cid')
            except Exception:
                body_cid = None
            if body_cid:
                out.write(f"Body CID: {body_cid}\n")

            # Transactions list (should be public or controlled by backend logic)
            r_tx = do_get('/api/transactions/')
            write_out(out, 'TRANSACTIONS', r_tx)

        print('Wrote smoke_jwt_more_output.txt')
    except Exception:
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
