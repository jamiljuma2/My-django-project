import os, django, json, sys, traceback
os.environ.setdefault('DJANGO_SETTINGS_MODULE','mpesa_project.settings')
django.setup()
from django.test import Client

c=Client()

def pretty(r,label, out):
    out.write(f"\n== {label} status= {r.status_code}\n")
    ct=r.get('Content-Type','')
    out.write(f"Content-Type: {ct}\n")
    text=r.content.decode(errors='replace')
    out.write(text[:4000] + '\n')
    return text


data={'username':'smokeuser','email':'smoke@example.com','password':'Testpass123','password2':'Testpass123'}
try:
    with open('smoke_jwt_output.txt','w', encoding='utf-8') as out:
        r=c.post('/api/drf-auth/register/', data=json.dumps(data), content_type='application/json', **{'HTTP_HOST':'localhost'})
        pretty(r,'REGISTER', out)

        r2=c.post('/api/token/', data=json.dumps({'username':'smokeuser','password':'Testpass123'}), content_type='application/json', **{'HTTP_HOST':'localhost'})
        pretty(r2,'TOKEN', out)

        try:
            tok = json.loads(r2.content.decode() or '{}')
        except Exception as e:
            out.write('Token JSON load failed: ' + str(e) + '\n')
            tok = {}

        access = tok.get('access')
        headers = {'HTTP_AUTHORIZATION': f'Bearer {access}'} if access else {}
        # include HTTP_HOST to avoid DisallowedHost during test client requests
        if headers:
            headers['HTTP_HOST'] = 'localhost'
        else:
            headers = {'HTTP_HOST': 'localhost'}
        r3=c.get('/api/drf-auth/user/', **headers)
        pretty(r3,'USER', out)
    print('Wrote smoke_jwt_output.txt')
except Exception:
    traceback.print_exc()
    sys.exit(1)
