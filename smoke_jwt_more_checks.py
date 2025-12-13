import os
import json
import time
import traceback
import sys
import django
from django.test import Client

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mpesa_project.settings')
django.setup()

CLIENT = Client()
HOST_EXTRA = {'HTTP_HOST': 'localhost'}


def write_out(out, label, response):
    out.write(f"\n== {label} status= {response.status_code}\n")
    out.write(f"Content-Type: {response.get('Content-Type','')}\n")
    out.write(response.content.decode(errors='replace') + "\n")


def safe_json(response):
    try:
        return json.loads(response.content.decode() or '{}')
    except Exception:
        return {}


def do_post(path, payload=None, access_token=None):
    extra = dict(HOST_EXTRA)
    if access_token:
        extra['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
    return CLIENT.post(path, data=json.dumps(payload or {}), content_type='application/json', **extra)


def do_get(path, access_token=None):
    extra = dict(HOST_EXTRA)
    if access_token:
        extra['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
    return CLIENT.get(path, **extra)


def main():
    username = f"smokeuser_{int(time.time())}"
    password = "Testpass123"
    email = f"{username}@example.com"

    try:
        with open('smoke_jwt_more_output.txt', 'w', encoding='utf-8') as out:
            # Register
            reg_payload = {'username': username, 'email': email, 'password': password, 'password2': password}
            r = do_post('/api/drf-auth/register/', reg_payload)
            write_out(out, 'REGISTER', r)
            if r.status_code not in (200, 201):
                out.write('Registration failed, aborting further checks.\n')
                return

            # Obtain tokens
            r2 = do_post('/api/token/', {'username': username, 'password': password})
            write_out(out, 'TOKEN_OBTAIN', r2)
            tok = safe_json(r2)
            access = tok.get('access')
            refresh = tok.get('refresh')

            # Access protected endpoint
            r3 = do_get('/api/drf-auth/user/', access_token=access)
            write_out(out, 'USER_WITH_ACCESS', r3)

            # Refresh (if refresh token exists)
            new_access = None
            if refresh:
                r4 = do_post('/api/token/refresh/', {'refresh': refresh})
                write_out(out, 'TOKEN_REFRESH', r4)
                new_tok = safe_json(r4)
                new_access = new_tok.get('access')
            else:
                out.write('No refresh token returned; skipping refresh step.\n')

            # Logout (blacklist refresh)
            r5 = do_post('/api/drf-auth/logout/', {'refresh': refresh}, access_token=access)
            write_out(out, 'LOGOUT', r5)

            # Attempt refresh again
            if refresh:
                r6 = do_post('/api/token/refresh/', {'refresh': refresh})
                write_out(out, 'TOKEN_REFRESH_AFTER_LOGOUT', r6)

            # Access with new access (if any)
            if new_access:
                r7 = do_get('/api/drf-auth/user/', access_token=new_access)
                write_out(out, 'USER_WITH_NEW_ACCESS', r7)

        print('Wrote smoke_jwt_more_output.txt')
    except Exception:
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
