# 🚀 Render Deployment - Quick Start Guide

## ✅ Pre-Deployment Completed
- [x] Code pushed to GitHub: https://github.com/jamiljuma2/My-django-project.git
- [x] wsgi.py and asgi.py configured
- [x] render.yaml ready
- [x] All requirements in requirements.txt
- [x] .env in .gitignore (security)

---

## 🔧 Deploy to Render NOW

### Step 1: Create Render Web Service

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click**: "New +" → "Web Service"
3. **Connect Repository**: 
   - Select: `jamiljuma2/My-django-project`
   - Or paste: https://github.com/jamiljuma2/My-django-project.git

### Step 2: Configure Build Settings

```
Name: mpesa-api (or your preferred name)
Region: Frankfurt (closest to Kenya)
Branch: main
Runtime: Python 3
Build Command: pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
Start Command: gunicorn mpesa_project.wsgi:application
Instance Type: Free
```

### Step 3: Set Environment Variables

**Click "Advanced" and add these environment variables:**

```bash
# Django Core (REQUIRED)
DJANGO_SECRET_KEY=your-random-50-char-secret-key-here
DEBUG=False
ALLOWED_HOSTS=mpesa-api.onrender.com  # Replace with your actual Render URL

# Lipana API (REQUIRED)
LIPANA_SECRET_KEY=lip_sk_live_4fffb2ea5d3f04e7bf1de5fa439869006108ee3c4aa6d29a57dbe326f920ef94
LIPANA_PUBLISHABLE_KEY=lip_pk_live_6f5479763ed13df6d9baad39780e5eabbe66919f18ea1fdd7ff31c9da857be9e
LIPANA_API_BASE=https://api.lipana.io
LIPANA_SKIP_DNS_CHECK=False
LIPANA_ENABLE_MOCK=False

# Python Version
PYTHON_VERSION=3.11.0
```

**⚠️ IMPORTANT: Generate a strong DJANGO_SECRET_KEY:**
```bash
# Run this in your terminal:
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Step 4: Deploy

1. **Click**: "Create Web Service"
2. **Wait**: Render will build and deploy (3-5 minutes)
3. **Watch**: Build logs in real-time

---

## 🎯 After Deployment

### Access Your App

Your app will be available at:
```
https://mpesa-api.onrender.com (or your chosen name)
```

**Test endpoints:**
```bash
# Health check
curl https://mpesa-api.onrender.com/health/

# Home page
curl https://mpesa-api.onrender.com/

# Admin
https://mpesa-api.onrender.com/admin/
```

### Create Admin User

1. Go to Render Dashboard → your service
2. Click **"Shell"** tab
3. Run:
```bash
python manage.py createsuperuser
```

### Update Lipana Webhook

Update your Lipana webhook URL to:
```
https://mpesa-api.onrender.com/webhooks/mpesa/
```

---

## 📊 Monitoring & Management

### View Logs
- Dashboard → **Logs** tab
- Real-time streaming
- Filter by severity

### Check Health
```bash
curl https://your-app.onrender.com/health/
# Should return: {"status":"ok","service":"mpesa","debug":false}
```

### Manual Deploy
- Dashboard → **Manual Deploy** → Select branch → Deploy

---

## 🔍 Troubleshooting

### Build Failed?
```bash
# Check these:
1. All dependencies in requirements.txt? ✓
2. Python version matches? (3.11.0) ✓
3. DJANGO_SECRET_KEY set? 
4. Build command correct? ✓
```

### App Won't Start?
```bash
# Verify:
1. gunicorn in requirements.txt ✓
2. wsgi.py exists ✓
3. All environment variables set
4. Check logs for errors
```

### 503 Service Unavailable?
```bash
# Common causes:
1. App is still building
2. Environment variables missing
3. Check logs for errors
```

---

## 🆓 Free Tier Limits

- **750 hours/month** (enough for 1 always-on service)
- **Sleeps after 15 min** of inactivity (first request takes 30-60s)
- **512 MB RAM**
- **0.1 CPU**

**Upgrade to Starter ($7/mo) for:**
- Always-on (no sleep)
- Better performance
- More resources

---

## 🔒 Security Checklist

- [x] `.env` in .gitignore
- [ ] Strong DJANGO_SECRET_KEY set
- [ ] DEBUG=False
- [ ] Proper ALLOWED_HOSTS
- [x] HTTPS enabled (automatic)
- [ ] Admin password set (after deployment)

---

## 🔄 Auto-Deploy

**Render auto-deploys on every `git push`:**
```bash
git add .
git commit -m "Update feature"
git push origin main
# Render deploys automatically
```

**To disable auto-deploy:**
Settings → Build & Deploy → Auto-Deploy: OFF

---

## 🎉 Next Steps

1. ✅ Deploy to Render (follow steps above)
2. ✅ Create admin user
3. ✅ Update Lipana webhook URL
4. ✅ Test STK Push API
5. ✅ Monitor logs

**Questions? Check:** https://render.com/docs/web-services

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Django Docs**: https://docs.djangoproject.com

---

**Your app is ready to deploy! 🚀**
