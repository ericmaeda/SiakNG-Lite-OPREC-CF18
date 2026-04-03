import { Navigate, useLocation } from 'react-router'
import { useAuth } from './auth-context'
import type { UserRole } from '@siakng/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#FFD700' }}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to role-specific dashboard
    if (user.role === 'DOSEN' || user.role === 'ADMIN') {
      return <Navigate to="/dashboard-dosen" replace />
    }
    return <Navigate to="/dashboard-mahasiswa" replace />
  }

  return <>{children}</>
}
