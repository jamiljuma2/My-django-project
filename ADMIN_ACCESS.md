# 🔐 Admin Access Guide

## Access Admin Site

### **For Render (Production)**
https://my-django-project-1-0k73.onrender.com/admin/

### **For Local Development**
http://localhost:8000/admin/

---

## 📝 Create Admin User

### **Option 1: Via Render Shell (Live Production)**

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Select your service: `my-django-project-1-0k73`

2. **Open Shell Tab**
   - Click **"Shell"** at the top

3. **Run this command:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Follow the prompts:**
   ```
   Username: admin
   Email: your-email@example.com
   Password: (enter your password - won't be displayed)
   Password (again): (confirm)
   ```

5. **Access Admin:**
   - Go to: https://my-django-project-1-0k73.onrender.com/admin/
   - Login with your credentials

---

### **Option 2: Non-Interactive (Render Shell)**

```bash
python manage.py createsuperuser --noinput --username=admin --email=admin@example.com
```

Then set password:
```bash
python manage.py shell
from django.contrib.auth.models import User
user = User.objects.get(username='admin')
user.set_password('your-secure-password')
user.save()
exit()
```

---

## 🏠 Local Testing

### **1. Create Local Admin User**
```bash
python manage.py createsuperuser
```

### **2. Start Server**
```bash
python manage.py runserver
```

### **3. Access Admin**
```
http://localhost:8000/admin/
```

---

## ✅ Admin Features

Once logged in, you can:
- ✅ View M-Pesa Transactions
- ✅ Filter by phone, amount, reference
- ✅ View transaction timestamps
- ✅ Manage users and permissions
- ✅ View logs and activity

---

## 🔑 Login Credentials

**Save these securely:**
```
Username: [YOUR USERNAME]
Password: [YOUR PASSWORD]
Admin URL: https://my-django-project-1-0k73.onrender.com/admin/
```

---

## 🛡️ Security Tips

- ✅ Use strong passwords
- ✅ Don't share admin credentials
- ✅ Use unique usernames
- ✅ Enable HTTPS (automatic on Render)
- ✅ Monitor access logs regularly

---

## 🆘 Forgot Password?

**In Render Shell:**
```bash
python manage.py changepassword admin
```

---

## 📊 Admin Dashboard Features

### **M-Pesa Transactions**
View all incoming payments:
- Transaction ID
- Amount
- Phone number
- Reference
- Timestamp

### **Users Management**
- Create additional admin users
- Set permissions
- Manage staff status
- View login history

### **Site Administration**
- View all models
- Add/edit/delete records
- Bulk actions
- Advanced filtering

---

## 📞 Need Help?

1. **Can't access admin?**
   - Check URL: https://my-django-project-1-0k73.onrender.com/admin/
   - Verify superuser was created: check Render logs
   - Try clearing browser cache

2. **Forgot password?**
   - Use Render Shell: `python manage.py changepassword admin`

3. **App offline?**
   - Check Render Dashboard → Logs
   - Verify all environment variables are set
   - Ensure app is deployed successfully

---

**Admin access is ready!** 🎉
