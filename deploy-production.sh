#!/bin/bash
# 🍌 The Invention of the Banana - Production Deployment Script
# This script automates the full production deployment

set -e  # Exit on error

echo "🍌 ============================================"
echo "🍌  THE INVENTION OF THE BANANA"
echo "🍌  Automated Production Deployment"
echo "🍌 ============================================"
echo ""

# --------- Configuration ---------
# These can be overridden by environment variables or a .env file
MONGO_URI="${MONGO_URI:-mongodb+srv://<user>:<pass>@cluster0.mongodb.net/banana-production}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 32)}"
OPENAI_API_KEY="${OPENAI_API_KEY:-<your-openai-api-key>}"
NODE_ENV="${NODE_ENV:-production}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_PORT="${BACKEND_PORT:-4000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

# OAuth Credentials
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:-<your-google-client-id>}"
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:-<your-google-client-secret>}"
GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID:-<your-github-client-id>}"
GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET:-<your-github-client-secret>}"

# --------- Pre-flight Checks ---------
echo "🔍 Running pre-flight checks..."

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed."
    echo "   Install from: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker found"

# Check for Node.js (for frontend build)
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check for required environment variables
check_env() {
    if [[ "$1" == *"<"* ]]; then
        echo "⚠️  Warning: $2 appears to be a placeholder. Set it in your environment."
        return 1
    fi
    return 0
}

echo ""
echo "🔐 Checking environment configuration..."
check_env "$MONGO_URI" "MONGO_URI" || echo "   Set: export MONGO_URI='your-connection-string'"
check_env "$OPENAI_API_KEY" "OPENAI_API_KEY" || echo "   Set: export OPENAI_API_KEY='sk-...'"
check_env "$GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_ID" || echo "   Set: export GOOGLE_CLIENT_ID='...'"
check_env "$GITHUB_CLIENT_ID" "GITHUB_CLIENT_ID" || echo "   Set: export GITHUB_CLIENT_ID='...'"

echo ""
read -p "Continue with deployment? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# --------- Backend Deployment ---------
echo ""
echo "🚀 STEP 1: Deploying Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd banana-backend

# Create .env file for backend
cat > .env << EOF
MONGO_URI=${MONGO_URI}
JWT_SECRET=${JWT_SECRET}
OPENAI_API_KEY=${OPENAI_API_KEY}
NODE_ENV=${NODE_ENV}
PORT=${BACKEND_PORT}
FRONTEND_URL=${FRONTEND_URL}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
EOF

echo "📝 Created backend .env file"

# Build Docker image
echo "🐳 Building backend Docker image..."
docker build -t banana-backend:prod . --quiet

# Stop and remove old container if exists
echo "🧹 Cleaning up old containers..."
docker rm -f banana-backend-prod 2>/dev/null || true

# Run production container
echo "🏃 Starting backend container..."
docker run -d \
  --name banana-backend-prod \
  --restart unless-stopped \
  -p ${BACKEND_PORT}:${BACKEND_PORT} \
  --env-file .env \
  banana-backend:prod

echo "✅ Backend running at http://localhost:${BACKEND_PORT}"

# Wait for backend to be ready
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Health check
if curl -s "http://localhost:${BACKEND_PORT}/health" > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "⚠️  Backend health check failed - check logs with: docker logs banana-backend-prod"
fi

# Seed database
echo "🌱 Seeding database..."
docker exec banana-backend-prod node src/utils/seed.js || echo "⚠️  Seeding may have failed - check connection"

cd ..

# --------- Frontend Deployment ---------
echo ""
echo "🎨 STEP 2: Deploying Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd banana-frontend

# Create .env file for frontend
cat > .env << EOF
REACT_APP_API_URL=http://localhost:${BACKEND_PORT}/api
EOF

echo "📝 Created frontend .env file"

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm ci --silent

# Build production bundle
echo "🔨 Building production bundle..."
npm run build

# Serve frontend
echo "🌐 Starting frontend server..."
# Kill any existing serve process
pkill -f "serve -s build" 2>/dev/null || true

# Start serve in background
npx serve -s build -l ${FRONTEND_PORT} &
FRONTEND_PID=$!

echo "✅ Frontend running at http://localhost:${FRONTEND_PORT}"
echo "   (PID: $FRONTEND_PID)"

cd ..

# --------- Verification ---------
echo ""
echo "🔍 STEP 3: Verifying Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 3

# Test backend endpoints
echo "Testing API endpoints..."

echo -n "  /health: "
if curl -s "http://localhost:${BACKEND_PORT}/health" | grep -q "healthy"; then
    echo "✅ OK"
else
    echo "❌ Failed"
fi

echo -n "  /api/banana/random: "
if curl -s "http://localhost:${BACKEND_PORT}/api/banana/random" | grep -q "name"; then
    echo "✅ OK"
else
    echo "❌ Failed (may need seeding)"
fi

echo -n "  /api/terms: "
if curl -s "http://localhost:${BACKEND_PORT}/api/terms" | grep -q "version"; then
    echo "✅ OK"
else
    echo "❌ Failed"
fi

# Test frontend
echo -n "  Frontend: "
if curl -s "http://localhost:${FRONTEND_PORT}" | grep -q "Banana"; then
    echo "✅ OK"
else
    echo "❌ Failed"
fi

# --------- Summary ---------
echo ""
echo "🍌 ============================================"
echo "🍌  DEPLOYMENT COMPLETE!"
echo "🍌 ============================================"
echo ""
echo "📍 Access Points:"
echo "   Frontend:     http://localhost:${FRONTEND_PORT}"
echo "   Backend API:  http://localhost:${BACKEND_PORT}/api"
echo "   Health Check: http://localhost:${BACKEND_PORT}/health"
echo ""
echo "🔮 Features:"
echo "   • Random Banana: /api/banana/random"
echo "   • All Bananas:   /api/banana"
echo "   • AI Oracle:     /api/oracle/ask (requires auth)"
echo "   • Terms:         /api/terms"
echo ""
echo "🔐 OAuth Endpoints:"
echo "   • Google:  /api/auth/google"
echo "   • GitHub:  /api/auth/github"
echo ""
echo "⚠️  Remember to configure your OAuth provider callback URLs:"
echo "   Google: http://localhost:${BACKEND_PORT}/api/auth/google/callback"
echo "   GitHub: http://localhost:${BACKEND_PORT}/api/auth/github/callback"
echo ""
echo "📋 Useful Commands:"
echo "   View backend logs:   docker logs -f banana-backend-prod"
echo "   Restart backend:     docker restart banana-backend-prod"
echo "   Stop all:            docker stop banana-backend-prod && pkill -f 'serve -s build'"
echo ""
echo "🍌 Happy Banana Exploring! 🍌"
