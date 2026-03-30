import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardDosen } from './pages/DashboardDosen';
import { DashboardMahasiswa } from './pages/DashboardMahasiswa';
import { Matakuliah } from './pages/Matakuliah';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './lib/protected-route';
import { useAuth } from './lib/auth-context';

// Wrapper component for role-based dashboard
function DashboardWrapper() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'DOSEN' || user.role === 'ADMIN') {
    return <DashboardDosen />;
  }

  return <DashboardMahasiswa />;
}

// React Router v7 configuration
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard-dosen',
        element: (
          <ProtectedRoute allowedRoles={['DOSEN', 'ADMIN']}>
            <DashboardDosen />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard-mahasiswa',
        element: (
          <ProtectedRoute allowedRoles={['MAHASISWA']}>
            <DashboardMahasiswa />
          </ProtectedRoute>
        ),
      },
      {
        path: 'matakuliah',
        element: (
          <ProtectedRoute>
            <Matakuliah />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
