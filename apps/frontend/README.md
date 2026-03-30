# SIAKNG Lite - Frontend

Frontend application for SIAKNG Lite (Sistem Akademik New Generation Lite) built with React, Vite, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install
```

### Running the Application

```bash
# Development (with hot reload)
pnpm run dev

# Production build
pnpm run build
```

The application will start at `http://localhost:5173` (or next available port)

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| React 18 | UI Framework |
| Vite | Build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| shadcn/ui | UI component library |
| React Hook Form | Form handling |

---

## 📱 Pages

| Route | Page | Auth Required | Access |
|-------|------|---------------|--------|
| `/` | Home | No | All |
| `/login` | Login | No | Guest |
| `/register` | Register | No | Guest |
| `/dashboard` | Dashboard | Yes | DOSEN/MAHASISWA/ADMIN |
| `/matakuliah` | Mata Kuliah List | Yes | DOSEN/MAHASISWA/ADMIN |
| `/matakuliah/tambah` | Tambah Mata Kuliah | Yes | DOSEN/ADMIN |

---

## 🗂️ Project Structure

```
apps/frontend/
├── src/
│   ├── components/      # UI Components
│   │   └── ui/         # shadcn/ui components
│   ├── layouts/        # Layout components
│   ├── lib/            # Utilities
│   │   ├── api.ts      # API client
│   │   ├── auth-context.tsx  # Auth context
│   │   └── protected-route.tsx # Route protection
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── DashboardDosen.tsx
│   │   ├── DashboardMahasiswa.tsx
│   │   ├── Matakuliah.tsx
│   │   └── TambahMatakuliah.tsx
│   ├── router.tsx      # Route configuration
│   ├── main.tsx        # App entry
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔐 Authentication Flow

### Login
1. User enters email & password
2. API sends credentials to backend
3. Backend validates and returns JWT token + user data
4. Frontend stores token in localStorage
5. User is redirected to dashboard based on role

### Token Storage
- **localStorage**: `access_token` - JWT token for API requests
- **localStorage**: `user` - User data object
- **React Context**: Current user state

### Protected Routes
- Routes are protected via `ProtectedRoute` component
- Unauthenticated users are redirected to `/login`
- Role-based access control implemented

---

## 🔗 API Integration

### Environment Variables

Create a `.env` file in `apps/frontend/`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### API Client ([`lib/api.ts`](apps/frontend/src/lib/api.ts))

```typescript
import { api } from './lib/api'

// Login
const response = await api.login(email, password)

// Get data
const matakuliah = await api.getMataKuliah()

// Create data
await api.createMataKuliah({ kode, nama, sks, semester, dosenId })
```

---

## 🎨 UI Components

Using [shadcn/ui](https://ui.shadcn.com/) components:

| Component | Usage |
|-----------|-------|
| Button | Actions, forms |
| Input | Form fields |
| Label | Form labels |
| Card | Content containers |
| Avatar | User profiles |
| Form | Complex forms |
| Calendar | Date selection |
| Skeleton | Loading states |

---

## 🧩 Component States

### Loading States
- Button shows "Menyimpan..." when submitting
- Skeleton loaders for async data

### Error States
- Form validation errors displayed inline
- API errors shown in alert boxes

### Success States
- Redirects after successful operations
- Toast notifications (future enhancement)

---

## 🚦 Route Protection

```typescript
// router.tsx
<Route path="/dashboard" element={
  <ProtectedRoute allowedRoles={['DOSEN', 'MAHASISWA', 'ADMIN']}>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Role-Based Redirects
- **MAHASISWA** → `/dashboard` (Mahasiswa view)
- **DOSEN** → `/dashboard` (Dosen view)
- **ADMIN** → `/dashboard` (Admin view)

---

## 🐛 Debugging Tips

### Check Authentication State
1. Open browser DevTools → Application → Local Storage
2. Look for `access_token` and `user` keys

### View API Requests
1. DevTools → Network tab
2. Filter by fetch/XHR
3. Check request/response bodies

### Common Issues
- **401 Unauthorized**: Token expired or invalid
- **CORS Error**: Backend not configured for frontend origin
- **Empty Data**: Check if backend API is running

---

## 📋 Available Scripts

```bash
# Development
pnpm run dev          # Start dev server with hot reload

# Build
pnpm run build        # Build for production
pnpm run preview      # Preview production build

# Linting
pnpm run lint         # Run ESLint
```

---

## 🔗 Connected Backend

The frontend connects to the [SIAKNG Backend](apps/backend/README.md) at `http://localhost:3000`.

**Default test accounts:**
- DOSEN: `dosen@test.com` / `password123`
- MAHASISWA: `mahasiswa@test.com` / `password123`

---

## 📞 Support

For issues:
1. Check backend is running on port 3000
2. Verify CORS settings in backend
3. Check browser console for errors

---

## 📄 License

ISC
