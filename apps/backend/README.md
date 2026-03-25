# SIAKNG Lite - Backend

Backend application for SIAKNG Lite (Sistem Akademik New Generation Lite) built with NestJS, Fastify, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Docker (optional, for database)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Running the Application

```bash
# Development (with hot reload)
pnpm run dev

# Production
pnpm run build
pnpm run start
```

The server will start at `http://localhost:3000`

---

## 📚 API Documentation (Swagger)

### Accessing Swagger UI

After starting the server, open your browser and navigate to:

**Swagger UI**: http://localhost:3000/api/docs

**OpenAPI JSON**: http://localhost:3000/api/docs-json

### How to Use Swagger UI

1. **Open the URL** in your browser
2. You'll see all available API endpoints organized by tags
3. Click on an endpoint to expand it
4. Click **"Try it out"** to test the endpoint
5. Fill in the required parameters
6. Click **"Execute"** to send the request
7. View the response below

### Authentication in Swagger

For endpoints that require authentication:

1. First, use the **POST /auth/login** or **POST /auth/register** endpoint to get a token
2. Click the **"Authorize"** button at the top of Swagger UI
3. Enter the token in the format: `Bearer <your_token>`
4. Click **Authorize** to apply the token to all requests

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |

### Mata Kuliah

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/v1/matakuliah` | Get all mata kuliah | Yes | DOSEN/MAHASISWA |
| GET | `/api/v1/matakuliah/:id` | Get mata kuliah by ID | Yes | DOSEN/MAHASISWA |
| POST | `/api/v1/matakuliah` | Create mata kuliah | Yes | DOSEN |
| PATCH | `/api/v1/matakuliah/:id` | Update mata kuliah | Yes | DOSEN |
| DELETE | `/api/v1/matakuliah/:id` | Delete mata kuliah | Yes | DOSEN |

---

## 📝 Request/Response Examples

### Register User

**Request:**
```json
POST /api/v1/auth/register
{
  "email": "dosen@example.com",
  "password": "password123",
  "nama": "Dr. John Doe",
  "role": "DOSEN"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "dosen@example.com",
    "nama": "Dr. John Doe",
    "role": "DOSEN"
  }
}
```

### Login

**Request:**
```json
POST /api/v1/auth/login
{
  "email": "dosen@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Create Mata Kuliah (Requires DOSEN role)

**Request:**
```json
POST /api/v1/matakuliah
Authorization: Bearer <token>

{
  "kode": "MK0001",
  "nama": "Algoritma dan Pemrograman",
  "sks": 4,
  "semester": 1,
  "dosenId": "uuid-dosen"
}
```

---

## 🛠️ Available Scripts

```bash
# Development
pnpm run dev          # Start with hot reload

# Build
pnpm run build        # Build for production
pnpm run start        # Start production server

# Database
pnpm run db:generate  # Generate Drizzle migrations
pnpm run db:migrate   # Run migrations
pnpm run db:push      # Push schema to database
pnpm run db:studio    # Open Drizzle Studio

# Linting
pnpm run lint         # Run ESLint
```

---

## 🗂️ Project Structure

```
apps/backend/
├── src/
│   ├── domain/           # Domain layer
│   │   ├── entities/     # Entity definitions
│   │   └── repositories/ # Repository interfaces
│   ├── infrastructure/   # Infrastructure layer
│   │   ├── auth/         # JWT, Password services
│   │   └── database/     # Database connections, schemas
│   └── presentation/     # Presentation layer
│       ├── controllers/  # API controllers
│       └── guards/       # Auth guards
├── drizzle/              # Database migrations
└── package.json
```

---

## 🔧 Environment Variables

Create a `.env` file in `apps/backend/` directory:

```env
# Server
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
```

---

## 🐳 Docker Setup (Optional)

If you prefer using Docker for the database:

```bash
cd infra/docker
docker-compose up -d
```

This will start a PostgreSQL container on port 5432.

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Click Import
3. Select the collection file (if exported)

### Manual Testing

1. **Register** a new user via POST `/api/v1/auth/register`
2. **Login** to get the access token
3. **Copy** the access token
4. **Authorize** in Swagger or add `Authorization: Bearer <token>` header
5. **Test** other endpoints

---

## 📋 User Roles

| Role | Description |
|------|-------------|
| ADMIN | Full system access |
| DOSEN | Can manage mata kuliah |
| MAHASISWA | Can view mata kuliah |

---

## 📞 Support

For issues or questions, please check the Swagger documentation at http://localhost:3000/api/docs

---

## 📄 License

ISC
