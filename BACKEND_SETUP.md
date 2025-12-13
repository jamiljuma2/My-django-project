# Backend Connection Setup Guide

## Current Setup

Your frontend is configured to connect to a backend API with:
- **Base URL**: http://localhost:3001/api (development) 
- **Configurable via**: NEXT_PUBLIC_API_URL environment variable

## What Needs to Be Done

1. **Create .env.local file** for local development
2. **Set backend URL** in environment variables
3. **Create/configure the backend server** (Node.js + Express, or another framework)
4. **Update authentication flow** to use API instead of localStorage
5. **Replace mock data** with real API calls

## Quick Start

### Option A: Connect to Existing Backend
If you have an existing backend, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Option B: Set Up Local Backend
1. Create a backend directory: `mkdir backend && cd backend`
2. Initialize Node.js project: `npm init -y`
3. Install dependencies: `npm install express cors dotenv axios`
4. Create server that matches the API client expectations

### API Endpoints Expected

The frontend API client expects these endpoints:

**Authentication:**
- POST /auth/login
- POST /auth/register
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/verify-email
- POST /auth/logout

**Assignments:**
- GET /assignments
- POST /assignments
- GET /assignments/:id
- PUT /assignments/:id
- DELETE /assignments/:id

**Payments:**
- GET /payments
- POST /payments/lipana-stk (M-Pesa)
- GET /payments/:id

**Other:**
- GET /tasks
- POST /tasks
- GET /notifications
- GET /profile
- PUT /profile

## Implementation Steps

1. Create `.env.local` file in project root
2. Add your backend URL (or keep default localhost:3001)
3. Create backend with matching endpoints
4. Update LoginForm to use API client instead of localStorage
5. Update RegisterForm to use API client
6. Update dashboard pages to fetch from API instead of mock data
7. Add error handling and loading states

Would you like me to help with any of these steps?
