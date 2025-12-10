# Deployment Guide - Render

## Pre-deployment Checklist

1. **Update settings:**
   ```bash
   export DEBUG=False
   export DJANGO_SECRET_KEY="your-strong-random-key"
   export ALLOWED_HOSTS="yourdomain.onrender.com"
   ```

2. **Collect static files:**
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

## Render Deployment Steps

### 1. Prepare Your Repository

Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/mpesa-project.git
git push -u origin main
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### 3. Configure Web Service

**Build Settings:**
- **Repository:** Select your GitHub repo
- **Name:** mpesa-api
- **Region:** Choose closest to Kenya (e.g., Frankfurt, Singapore)
- **Branch:** main
- **Root Directory:** (leave blank)
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- **Start Command:** `gunicorn mpesa_project.wsgi:application`

### 4. Environment Variables

Add these in Render Dashboard → Environment:

```
DJANGO_SECRET_KEY=<generate-random-50-char-string>
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com
LIPANA_SECRET_KEY=lip_sk_live_1ed27384b2d8a8327f64b730f0ae24578cae5b27fd2761564465f4707a49d00b
LIPANA_PUBLISHABLE_KEY=lip_pk_live_d25e520310614c8fa2a9ad6791f8f46d048853c812779c12530b4b79120fc9c2
LIPANA_API_BASE=https://api.lipana.io
LIPANA_ENABLE_MOCK=False
LIPANA_SKIP_DNS_CHECK=False
PYTHON_VERSION=3.11.0
```

### 5. Deploy

Click "Create Web Service" - Render will automatically deploy.

### 6. Post-Deployment

**Create superuser via Render Shell:**
```bash
# In Render Dashboard → Shell tab
python manage.py createsuperuser
```

**Access your app:**
```
https://your-app-name.onrender.com
https://your-app-name.onrender.com/admin
https://your-app-name.onrender.com/health
```

## Database Setup (Optional)

For production database on Render:

1. Create PostgreSQL database: New → PostgreSQL
2. Update environment variables:
```
DATABASE_URL=<postgres-connection-string-from-render>
```

3. Update `settings.py` to use PostgreSQL:
```python
import dj_database_url
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}
```

4. Add to `requirements.txt`:
```
psycopg2-binary>=2.9.0
dj-database-url>=2.1.0
```

## Webhook Configuration

Update Lipana webhook URL to:
```
https://your-app-name.onrender.com/webhooks/mpesa/
```

## Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add your domain (e.g., api.yourdomain.com)
3. Update DNS records as instructed
4. Update `ALLOWED_HOSTS` environment variable

## Monitoring

**View Logs:**
- Render Dashboard → Logs tab
- Real-time log streaming

**Health Check:**
```bash
curl https://your-app-name.onrender.com/health/
```

## Troubleshooting

**App won't start:**
- Check logs for errors
- Verify all environment variables are set
- Ensure `gunicorn` is in requirements.txt

**Static files not loading:**
- Run: `python manage.py collectstatic --noinput`
- Verify `STATIC_ROOT` is set in settings

**Database errors:**
- Run migrations: `python manage.py migrate`
- Check DATABASE_URL is correct

## Auto-Deploy

Render automatically deploys on every `git push` to main branch.

To disable:
Settings → Build & Deploy → Auto-Deploy: Off

## Scaling

Free tier limitations:
- Sleeps after 15 minutes of inactivity
- 750 hours/month free

Upgrade to Starter ($7/mo) for:
- Always-on service
- No sleep
- Better performance

## Security Checklist

- [x] `DEBUG=False`
- [x] Strong `DJANGO_SECRET_KEY`
- [x] Proper `ALLOWED_HOSTS`
- [x] HTTPS enabled (automatic on Render)
- [x] Environment variables secured
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Monitor error logs

## Rollback

Render keeps deployment history:
1. Go to Dashboard → Events
2. Click "Rollback" on previous successful deploy
