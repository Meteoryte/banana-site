# 🍌 The Invention of the Banana - Production Deployment Script (Windows)
# Run with: .\deploy-production.ps1

Write-Host ""
Write-Host "🍌 ============================================" -ForegroundColor Yellow
Write-Host "🍌  THE INVENTION OF THE BANANA" -ForegroundColor Yellow
Write-Host "🍌  Automated Production Deployment" -ForegroundColor Yellow
Write-Host "🍌 ============================================" -ForegroundColor Yellow
Write-Host ""

# Configuration
$env:NODE_ENV = "production"
$BACKEND_PORT = 4000
$FRONTEND_PORT = 3000

# --------- Pre-flight Checks ---------
Write-Host "🔍 Running pre-flight checks..." -ForegroundColor Cyan

# Check for Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is required but not installed." -ForegroundColor Red
    Write-Host "   Install from: https://docs.docker.com/get-docker/"
    exit 1
}
Write-Host "✅ Docker found" -ForegroundColor Green

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is required but not installed." -ForegroundColor Red
    Write-Host "   Install from: https://nodejs.org/"
    exit 1
}
Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green

# Check environment variables
$requiredVars = @("MONGO_URI", "OPENAI_API_KEY", "GOOGLE_CLIENT_ID", "GITHUB_CLIENT_ID")
$missingVars = @()

foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if (-not $value -or $value -like "*<*") {
        $missingVars += $var
        Write-Host "⚠️  Warning: $var not set or is placeholder" -ForegroundColor Yellow
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host ""
    Write-Host "Set missing variables before deployment:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   `$env:$var = 'your-value'" -ForegroundColor DarkGray
    }
    Write-Host ""
}

$continue = Read-Host "Continue with deployment? (y/n)"
if ($continue -ne 'y' -and $continue -ne 'Y') {
    Write-Host "Deployment cancelled."
    exit 0
}

# --------- Backend Deployment ---------
Write-Host ""
Write-Host "🚀 STEP 1: Deploying Backend..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Set-Location banana-backend

# Build Docker image
Write-Host "🐳 Building backend Docker image..." -ForegroundColor White
docker build -t banana-backend:prod . --quiet

# Stop and remove old container if exists
Write-Host "🧹 Cleaning up old containers..." -ForegroundColor White
docker rm -f banana-backend-prod 2>$null

# Run production container
Write-Host "🏃 Starting backend container..." -ForegroundColor White
docker run -d `
  --name banana-backend-prod `
  --restart unless-stopped `
  -p ${BACKEND_PORT}:${BACKEND_PORT} `
  -e MONGO_URI="$env:MONGO_URI" `
  -e JWT_SECRET="$env:JWT_SECRET" `
  -e OPENAI_API_KEY="$env:OPENAI_API_KEY" `
  -e NODE_ENV="production" `
  -e FRONTEND_URL="http://localhost:$FRONTEND_PORT" `
  -e GOOGLE_CLIENT_ID="$env:GOOGLE_CLIENT_ID" `
  -e GOOGLE_CLIENT_SECRET="$env:GOOGLE_CLIENT_SECRET" `
  -e GITHUB_CLIENT_ID="$env:GITHUB_CLIENT_ID" `
  -e GITHUB_CLIENT_SECRET="$env:GITHUB_CLIENT_SECRET" `
  banana-backend:prod

Write-Host "✅ Backend running at http://localhost:$BACKEND_PORT" -ForegroundColor Green

# Wait for backend to be ready
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor White
Start-Sleep -Seconds 5

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor White
docker exec banana-backend-prod node src/utils/seed.js

Set-Location ..

# --------- Frontend Deployment ---------
Write-Host ""
Write-Host "🎨 STEP 2: Deploying Frontend..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Set-Location banana-frontend

# Create .env file
"REACT_APP_API_URL=http://localhost:$BACKEND_PORT/api" | Out-File -Encoding utf8 .env

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor White
npm ci --silent

Write-Host "🔨 Building production bundle..." -ForegroundColor White
npm run build

Write-Host "🌐 Starting frontend server..." -ForegroundColor White
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "serve", "-s", "build", "-l", $FRONTEND_PORT

Write-Host "✅ Frontend running at http://localhost:$FRONTEND_PORT" -ForegroundColor Green

Set-Location ..

# --------- Summary ---------
Write-Host ""
Write-Host "🍌 ============================================" -ForegroundColor Yellow
Write-Host "🍌  DEPLOYMENT COMPLETE!" -ForegroundColor Yellow
Write-Host "🍌 ============================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend:     http://localhost:$FRONTEND_PORT"
Write-Host "   Backend API:  http://localhost:$BACKEND_PORT/api"
Write-Host "   Health Check: http://localhost:$BACKEND_PORT/health"
Write-Host ""
Write-Host "📋 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View backend logs:   docker logs -f banana-backend-prod"
Write-Host "   Restart backend:     docker restart banana-backend-prod"
Write-Host ""
Write-Host "🍌 Happy Banana Exploring! 🍌" -ForegroundColor Yellow
