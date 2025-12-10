---
description: Deploy the Banana Site to production with one command
---

# 🍌 Production Deployment Workflow

This workflow automates the full production deployment of The Invention of the Banana site.

## Prerequisites

1. Docker installed and running
2. Node.js 18+ installed
3. MongoDB Atlas account with connection string
4. OAuth credentials configured (Google & GitHub)
5. OpenAI API key

## Steps

### 1. Configure Environment Variables

Set all required environment variables before deployment:

```powershell
# MongoDB Connection
$env:MONGO_URI = "mongodb+srv://user:pass@cluster0.mongodb.net/banana-production"

# Security
$env:JWT_SECRET = "your-secure-jwt-secret-at-least-32-chars"

# OAuth - Google
$env:GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"

# OAuth - GitHub
$env:GITHUB_CLIENT_ID = "your-github-client-id"
$env:GITHUB_CLIENT_SECRET = "your-github-client-secret"

# OpenAI
$env:OPENAI_API_KEY = "sk-your-openai-api-key"
```

### 2. Run Deployment Script

// turbo

```powershell
cd "x:\Banana Site"
.\deploy-production.ps1
```

### 3. Verify Deployment

The deployment script will automatically verify:

- Backend health check
- API endpoints (/api/banana/random, /api/terms)
- Frontend accessibility

### 4. Manual Verification (Optional)

Open browser to:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/banana
- Health Check: http://localhost:4000/health

## Alternative: Docker Compose

For full containerized deployment:

```bash
docker-compose up -d
```

## Troubleshooting

**Backend won't start:**

```powershell
docker logs banana-backend-prod
```

**Database connection issues:**

- Verify MONGO_URI is correct
- Check MongoDB Atlas network access (whitelist your IP)

**OAuth not working:**

- Verify callback URLs in OAuth provider settings
- Ensure GOOGLE_CLIENT_ID and GITHUB_CLIENT_ID are set

**Oracle not responding:**

- Check OPENAI_API_KEY is valid
- Verify user has accepted terms
- Check query limit hasn't been exceeded

## Stopping the Stack

```powershell
docker stop banana-backend-prod
# Kill frontend serve process if running
Get-Process node | Where-Object { $_.MainWindowTitle -like "*serve*" } | Stop-Process
```

## Redeploying

```powershell
# Backend only
docker restart banana-backend-prod

# Full redeploy
.\deploy-production.ps1
```
