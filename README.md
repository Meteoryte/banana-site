# 🍌 The Invention of the Banana

A full-stack web application featuring mythical banana invention stories, an AI-powered Oracle, and OAuth authentication.

![Banana Site](https://img.shields.io/badge/🍌-Banana%20Site-yellow)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 🌟 Features

- **📚 Banana Explorer** - Browse 10+ legendary banana varieties with unique invention stories
- **🔮 AI Oracle** - Ask the mystical Banana Oracle any banana-related question (powered by GPT-4)
- **🔐 OAuth Login** - Sign in with Google or GitHub
- **📜 Terms & Conditions** - Full legal compliance with user acceptance tracking
- **⭐ Favorites Collection** - Save your favorite banana varieties
- **🎨 Premium Dark Theme** - Beautiful glassmorphism design with animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for production deployment)
- MongoDB Atlas account (or local MongoDB)
- OAuth credentials (Google & GitHub)
- OpenAI API key

### Environment Setup

1. **Backend** - Copy `.env.example` to `.env`:

```bash
cd banana-backend
cp .env.example .env
```

2. **Frontend** - Copy `.env.example` to `.env`:

```bash
cd banana-frontend
cp .env.example .env
```

3. Fill in your credentials in both `.env` files.

### Development

**Backend:**

```bash
cd banana-backend
npm install
npm run dev
```

**Frontend:**

```bash
cd banana-frontend
npm install
npm start
```

### Production Deployment

**Option 1: One-Command Deployment (Recommended)**

On Linux/Mac:

```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

On Windows:

```powershell
.\deploy-production.ps1
```

**Option 2: Docker Compose**

```bash
# Set environment variables first
export MONGO_URI="your-mongo-uri"
export OPENAI_API_KEY="your-openai-key"
export GOOGLE_CLIENT_ID="your-google-id"
export GOOGLE_CLIENT_SECRET="your-google-secret"
export GITHUB_CLIENT_ID="your-github-id"
export GITHUB_CLIENT_SECRET="your-github-secret"

# Deploy
docker-compose up -d
```

## 📁 Project Structure

```
Banana Site/
├── banana-backend/          # Express.js API
│   ├── src/
│   │   ├── config/          # Passport OAuth config
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Database seeding
│   ├── Dockerfile
│   └── package.json
│
├── banana-frontend/         # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Route pages
│   │   └── services/        # API service
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml       # Container orchestration
├── deploy-production.sh     # Linux/Mac deploy script
└── deploy-production.ps1    # Windows deploy script
```

## 🔌 API Endpoints

### Public

| Endpoint                 | Description            |
| ------------------------ | ---------------------- |
| `GET /api/banana`        | List all bananas       |
| `GET /api/banana/random` | Get random banana      |
| `GET /api/banana/:id`    | Get specific banana    |
| `GET /api/terms`         | Get terms & conditions |
| `GET /health`            | Health check           |

### Authentication

| Endpoint                      | Description        |
| ----------------------------- | ------------------ |
| `GET /api/auth/google`        | Start Google OAuth |
| `GET /api/auth/github`        | Start GitHub OAuth |
| `GET /api/auth/me`            | Get current user   |
| `POST /api/auth/logout`       | Logout             |
| `POST /api/auth/accept-terms` | Accept T&C         |

### Protected (Requires Auth)

| Endpoint                          | Description           |
| --------------------------------- | --------------------- |
| `POST /api/oracle/ask`            | Ask the AI Oracle     |
| `POST /api/oracle/generate-story` | Generate banana story |
| `POST /api/banana/:id/favorite`   | Add to favorites      |

## 🔧 OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add callback URL: `http://localhost:4000/api/auth/google/callback`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add callback URL: `http://localhost:4000/api/auth/github/callback`

## 🎨 Design System

The frontend uses a custom design system with:

- **Dark theme** with banana-yellow accents
- **Glassmorphism** effects
- **Framer Motion** animations
- **Responsive** mobile-first design
- **CSS Custom Properties** for theming

## 🔐 Security

- JWT authentication with 7-day expiry
- Passport.js for OAuth
- Helmet.js for security headers
- Rate limiting (100 req/15min)
- CORS configured for frontend
- Password hashing with bcrypt

## 📊 Database

Using MongoDB with Mongoose ODM:

- **Banana** - Varieties with invention stories
- **User** - OAuth users with preferences

Seed the database:

```bash
npm run seed
```

## 🤖 AI Oracle

The Oracle uses OpenAI's GPT-4 Turbo with:

- Custom system prompt for banana personality
- 10 free queries per day per user
- Story generation mode
- Query limit tracking

## 📝 License

MIT License - See LICENSE file

## 🍌 Have Fun!

This is a parody/entertainment project. All banana invention stories are fictional!

---

Made with 🍌 and ❤️
