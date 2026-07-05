# LifeGPS AI — Deployment Guide

## Overview

LifeGPS AI uses a two-service architecture:
- **Frontend** (Next.js) → Deploy to **Vercel**
- **Backend** (FastAPI) → Deploy to **Render**

---

## Prerequisites

1. A GitHub repository with the project code
2. A [Google Gemini API Key](https://aistudio.google.com/apikey)
3. Accounts on [Vercel](https://vercel.com) and [Render](https://render.com)

---

## Backend Deployment (Render)

### Step 1: Prepare for Production

Create a `Procfile` in the `backend/` directory (if not already present):
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

For PostgreSQL in production, update `DATABASE_URL`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `lifegps-ai-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `GEMINI_API_KEY` = your API key
   - `DATABASE_URL` = your PostgreSQL connection string (Render provides free PostgreSQL)
6. Click **Create Web Service**

### Step 3: Set Up Render PostgreSQL (Optional)

1. In Render, click **New** → **PostgreSQL**
2. Create a free PostgreSQL instance
3. Copy the **Internal Database URL**
4. Set it as `DATABASE_URL` in your web service environment variables
5. Replace `sqlite+aiosqlite` driver with `postgresql+asyncpg`

---

## Frontend Deployment (Vercel)

### Step 1: Configure Environment

Create `.env.production` in `frontend/`:
```env
NEXT_PUBLIC_API_URL=https://lifegps-ai-backend.onrender.com
```

### Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://lifegps-ai-backend.onrender.com`
6. Click **Deploy**

---

## Post-Deployment Checklist

- [ ] Backend is running and `/docs` endpoint works
- [ ] Frontend can reach the backend API
- [ ] CORS is configured for the Vercel domain
- [ ] Gemini API is responding
- [ ] Database tables are auto-created
- [ ] Seed data is populated

---

## Updating CORS for Production

In `backend/main.py`, update the CORS origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel domain
    ],
    ...
)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Update `allow_origins` in FastAPI CORS config |
| Database connection fails | Check `DATABASE_URL` format and credentials |
| Gemini API errors | Verify `GEMINI_API_KEY` is set and valid |
| Frontend shows loading forever | Check `NEXT_PUBLIC_API_URL` points to correct backend |
| Render free tier sleeps | First request may take ~30s as service wakes up |
