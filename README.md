# SIAKNG Lite

> Sistem Akademik New Generation Lite — A modern academic management system with role-based access control.

## Overview

SIAKNG Lite is a fullstack web application for academic management, built with a monorepo architecture using pnpm workspaces and Turbo. It provides authentication and Mata Kuliah (course) management with three user roles: **ADMIN**, **DOSEN** (Lecturer), and **MAHASISWA** (Student).

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | NestJS, Fastify, PostgreSQL, Drizzle ORM |
| **Auth** | JWT (Passport.js) |
| **Package Manager** | pnpm 10+ |
| **Build System** | Turbo |

## Project Structure

```
siakng-lite-rev/
├── apps/
│   ├── backend/        # NestJS API server (Port 3000)
│   └── frontend/       # React SPA (Port 5173)
├── packages/
│   ├── config/         # Shared ESLint, TypeScript configs
│   ├── types/          # Shared TypeScript types
│   └── validators/    # Shared Zod validators
├── infra/              # Infrastructure (Docker, etc.)
├── turbo.json          # Turbo monorepo config
└── pnpm-workspace.yaml
```

## Features

- **Authentication**: JWT-based login/register with role-based access
- **Role-Based Access**:
  - `ADMIN` — Full system access
  - `DOSEN` — Manage Mata Kuliah (Create, Read, Update, Delete)
  - `MAHASISWA` — View Mata Kuliah (Read only)
- **Mata Kuliah Management**: CRUD operations for courses (kode, nama, sks, semester, dosen)
- **Swagger API Docs**: Interactive API documentation with Try-it-out feature
- **Type Safety**: Shared types and validators across monorepo

## Prerequisites

- Node.js 18+
- pnpm 10+
- PostgreSQL 14+ (or Docker)

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies in monorepo
pnpm install
```

### 2. Environment Setup

Create `.env` file in project root:

```env
# Backend
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=siakng

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Start Database (Optional - Docker)

```bash
cd infra/docker
docker-compose up -d
```

### 4. Database Migrations

```bash
# Generate migration files
pnpm run db:generate

# Run migrations
pnpm run db:migrate
```

### 5. Run Application

```bash
# Run both frontend & backend
pnpm run dev

# Or run individually
cd apps/backend && pnpm run dev   # http://localhost:3000
cd apps/frontend && pnpm run dev # http://localhost:5173
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Run all apps in development mode |
| `pnpm run build` | Build all apps for production |
| `pnpm run lint` | Lint all apps |
| `pnpm run db:generate` | Generate Drizzle migrations |
| `pnpm run db:migrate` | Run database migrations |
| `pnpm run db:studio` | Open Drizzle Studio |

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| DOSEN | dosen@test.com | password123 |
| MAHASISWA | mahasiswa@test.com | password123 |

## API Endpoints

### Authentication

```
POST /api/v1/auth/register  - Register new user
POST /api/v1/auth/login    - Login (returns JWT token)
```

### Mata Kuliah

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/v1/matakuliah` | List all courses | DOSEN/MAHASISWA/ADMIN |
| GET | `/api/v1/matakuliah/:id` | Get course by ID | DOSEN/MAHASISWA/ADMIN |
| POST | `/api/v1/matakuliah` | Create course | DOSEN/ADMIN |
| PATCH | `/api/v1/matakuliah/:id` | Update course | DOSEN/ADMIN |
| DELETE | `/api/v1/matakuliah/:id` | Delete course | DOSEN/ADMIN |

### Request Example - Create Mata Kuliah

```bash
curl -X POST http://localhost:3000/api/v1/matakuliah \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "kode": "CS101",
    "nama": "Algoritma dan Pemrograman",
    "sks": 4,
    "semester": 1,
    "dosenId": "uuid-dosen"
  }'
```

## API Documentation

Once the backend is running, access the interactive Swagger documentation:

- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

### Using Swagger

1. Open http://localhost:3000/api/docs
2. Login via `/api/v1/auth/login` to get a token
3. Click "Authorize" button at top
4. Enter token: `Bearer <your_token>`
5. Test any endpoint with "Try it out"

## Architecture

### Backend (NestJS + Fastify)

```
apps/backend/src/
├── domain/
│   ├── entities/          # Domain models
│   └── repositories/     # Repository interfaces
├── infrastructure/
│   ├── auth/             # JWT & Password services
│   └── database/         # Drizzle schemas & connections
└── presentation/
    ├── controllers/      # API endpoints
    ├── guards/           # Auth guards (Role-based)
    └── dto/             # Data Transfer Objects
```

### Frontend (React + Vite)

```
apps/frontend/src/
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api.ts            # API client wrapper
│   ├── auth-context.tsx  # Auth context provider
│   └── utils.ts          # Utility functions (cn, etc.)
├── pages/                # Route pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── DashboardDosen.tsx
│   ├── DashboardMahasiswa.tsx
│   ├── Matakuliah.tsx
│   └── TambahMatakuliah.tsx
└── router.tsx            # React Router configuration
```

### Shared Packages

```
packages/
├── config/      # ESLint, TypeScript shared configs
├── types/      # TypeScript interfaces shared across apps
└── validators/ # Zod validation schemas for API requests
```

## Security

- Passwords hashed with Argon2
- JWT tokens with configurable expiration
- Role-based route protection on both frontend and backend
- CORS configured for frontend origin

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Check PostgreSQL is running |
| `401 Unauthorized` | Token expired, re-login |
| CORS error | Ensure `FRONTEND_URL` matches frontend port |
| Migration error | Run `db:generate` then `db:migrate` |

### Database Studio

Open Drizzle Studio to visually manage your database:

```bash
pnpm run db:studio
```

## License

ISC