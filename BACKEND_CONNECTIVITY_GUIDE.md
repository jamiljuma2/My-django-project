# Backend Connectivity Troubleshooting

## Your Configuration

**API URL (set in Vercel):**
```
NEXT_PUBLIC_API_URL=https://my-django-project-1-0k73.onrender.com
```

**Backend CORS Settings (✅ Correct):**
- `CORS_ALLOWED_ORIGINS = ["https://edu-link-writers.vercel.app"]`
- `CORS_ALLOW_CREDENTIALS = True`
- `CSRF_TRUSTED_ORIGINS = ["https://edu-link-writers.vercel.app"]`

## Testing Endpoints

### 1. Test Health (No Auth Required)
```bash
curl https://my-django-project-1-0k73.onrender.com/health/
```
Expected: `{"status": "ok", "service": "mpesa", "debug": false}`

### 2. Test Login (DRF - Token Auth)
```bash
curl -X POST https://my-django-project-1-0k73.onrender.com/api/drf-auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```
Expected Response: `{"access": "<jwt_access>", "refresh": "<jwt_refresh>", "user": {...}}`
Or: `{"error": "Invalid credentials"}` (401)

### 3. Test Register (DRF)
```bash
curl -X POST https://my-django-project-1-0k73.onrender.com/api/drf-auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com","password":"pass123","password2":"pass123"}'
```

## Common Issues & Fixes

### Issue 1: "Cannot reach backend" on Vercel
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
2. Check frontend is using: `process.env.NEXT_PUBLIC_API_URL`
3. Ensure Vercel project is redeployed after adding env var

### Issue 2: CORS errors (No 'Access-Control-Allow-Origin' header)
**Check:**
- Backend is online: `curl https://my-django-project-1-0k73.onrender.com/health/`
- Render may need manual redeploy after code push

**Manual Redeploy on Render:**
1. Go to https://dashboard.render.com
2. Select your Django service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 2-3 minutes for deployment

### Issue 3: 404 errors on /api/drf-auth/* endpoints
**Cause:** Render hasn't deployed latest code yet
**Fix:** Manually redeploy (see above)

## Frontend Fetch Examples

### Register (with error handling)
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function register(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/api/drf-auth/register/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        email,
        password,
        password2: password
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }
    
    const {access, refresh, user} = await response.json();
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    return user;
  } catch (error) {
    console.error('Register failed:', error.message);
    throw error;
  }
}
```

### Login (with error handling)
```javascript
async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/api/drf-auth/login/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const {access, refresh, user} = await response.json();
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    return user;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
}
```

### Authenticated request (using token)
```javascript
async function getUser() {
  const access = localStorage.getItem('access');
  const response = await fetch(`${API_URL}/api/drf-auth/user/`, {
    headers: {
      'Authorization': `Bearer ${access}`
    }
  });
  return response.json();
}
```

## Debug Steps

1. **Check Vercel Console:**
   - Open browser DevTools → Network tab
   - Check failed request's response headers for CORS errors

2. **Check Backend Logs:**
   - Render Dashboard → Your service → Logs
   - Look for 404, 500, or CORS errors

3. **Test Locally First:**
   - Run local server: `python manage.py runserver`
   - Test with: `curl http://127.0.0.1:8000/health/`
   - Update frontend NEXT_PUBLIC_API_URL to local URL
   - Verify requests work before pushing to Render

4. **Verify Environment Variables in Vercel:**
   - Settings → Environment Variables
   - Confirm `NEXT_PUBLIC_API_URL` is set
   - Redeploy after changes

## Quick Action Items

- [ ] Ensure Vercel has `NEXT_PUBLIC_API_URL=https://my-django-project-1-0k73.onrender.com`
- [ ] Redeploy Vercel frontend
- [ ] Manually redeploy Render backend (Dashboard → Manual Deploy)
- [ ] Test `/health/` endpoint first
- [ ] Test `/api/drf-auth/login/` endpoint
- [ ] Check browser DevTools Network tab for CORS errors
