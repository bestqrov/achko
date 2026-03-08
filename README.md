# ArwaPark SaaS Platform

A production-ready multi-tenant SaaS platform for fleet and transport management.

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multi-tenant architecture

### Frontend
- Next.js 14 (App Router)
- React + TailwindCSS
- Lucide Icons

## Project Structure

```
arwapark-saas/
├── backend/          # Node.js + Express API
└── frontend/         # Next.js 14 dashboard
```

## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your variables
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Base URL

```
http://localhost:5000/api/v1
```

## Environment Variables

### Backend `.env`

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arwapark
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
# achko
