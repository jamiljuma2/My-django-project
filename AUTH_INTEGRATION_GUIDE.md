# Django Auth API Usage Guide

## Overview
The Django backend now has JWT bearer token authentication at `/api/drf-auth/*`. The frontend API client has been updated to use these endpoints.

## Backend Endpoints

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/drf-auth/register/` | POST | `{username, password, email?}` | `{status, message, data: {token, user}}` |
| `/api/drf-auth/login/` | POST | `{username, password}` | `{status, message, data: {token, user}}` |
| `/api/drf-auth/logout/` | POST | `{}` | `{status, message}` |
| `/api/drf-auth/user/` | GET | Headers: `Authorization: Bearer <token>` | `{status, message, data: {user}}` |

## Frontend Usage

### 1. Login
```typescript
import { apiClient } from '@/services/api';

const handleLogin = async (username: string, password: string) => {
  try {
    const response = await apiClient.login(username, password);
    // Token is automatically stored in localStorage
    // User data available in response.data.user
    console.log('Logged in:', response.data.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. Register
```typescript
const handleRegister = async (username: string, password: string, email: string) => {
  try {
    const response = await apiClient.register(username, password, email);
    // Token is automatically stored in localStorage
    // User data available in response.data.user
    console.log('Registered:', response.data.user);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 3. Get Current User
```typescript
const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.getCurrentUser();
    // Returns user data if token is valid
    console.log('Current user:', response.data.user);
  } catch (error) {
    console.error('Not authenticated or token expired');
  }
};
```

### 4. Logout
```typescript
const handleLogout = async () => {
  try {
    await apiClient.logout();
    // Token is automatically removed from localStorage
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Authentication Flow

1. **User registers or logs in** → API returns token + user data
2. **Token stored in localStorage** → Axios interceptor adds `Authorization: Bearer <token>` to all requests
3. **Protected requests** → Backend validates token, returns user data or 401 error
4. **Token expires after 7 days** → User must login again

## CORS Configuration

The backend allows requests from:
- `http://localhost:3000` (Next.js dev)
- `http://127.0.0.1:3000`
- `https://my-django-project-1-0k73.onrender.com` (Backend)
- `https://edulink-writers.vercel.app` (Production frontend)

## Response Format

All endpoints return:
```json
{
  "status": "success" | "error",
  "message": "Human-readable message",
  "data": { /* endpoint-specific data */ },
  "error": null | "error details"
}
```

## Example: Login Component

```typescript
'use client';

import { useState } from 'react';
import { apiClient } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.login(username, password);
      
      if (response.status === 'success') {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.error || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Testing the API

### Using curl:
```bash
# Register
curl -X POST https://my-django-project-1-0k73.onrender.com/api/drf-auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Pass123!","email":"test@example.com"}'

# Login
curl -X POST https://my-django-project-1-0k73.onrender.com/api/drf-auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Pass123!"}'

# Get current user (use token from login/register)
curl -X GET https://my-django-project-1-0k73.onrender.com/api/drf-auth/user/ \
  -H "Authorization: Bearer <your-token-here>"
```

### Using PowerShell:
```powershell
# Register
$body = @{username="testuser"; password="Pass123!"; email="test@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://my-django-project-1-0k73.onrender.com/api/drf-auth/register/" `
  -Method POST -Body $body -ContentType "application/json"

# Login
$body = @{username="testuser"; password="Pass123!"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "https://my-django-project-1-0k73.onrender.com/api/drf-auth/login/" `
  -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token

# Get current user
Invoke-RestMethod -Uri "https://my-django-project-1-0k73.onrender.com/api/drf-auth/user/" `
  -Method GET -Headers @{Authorization="Bearer $token"}
```

## Environment Variables

Create a `.env.local` file in your Next.js project root:

```env
# Production
NEXT_PUBLIC_API_BASE=https://my-django-project-1-0k73.onrender.com

# Or for local development:
# NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

## Notes

- Tokens are stateless (signed with Django's TimestampSigner)
- Tokens expire after 7 days
- No server-side session storage required
- Logout is client-side only (delete token from localStorage)
- All auth endpoints are CSRF-exempt and use Bearer token authentication
