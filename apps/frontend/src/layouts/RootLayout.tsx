import { Link, Outlet, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../lib/auth-context'

// Color palette
const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  neutral: '#1A1A1A',
}

export function RootLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Hide navbar on auth pages (login/register)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header - only show when authenticated and NOT on auth pages */}
      {isAuthenticated && !isAuthPage && !isLoading && (
        <header 
          className="px-8 py-4 flex items-center justify-between"
          style={{ backgroundColor: colors.secondary }}
        >
          <Link to="/dashboard" className="text-xl font-bold no-underline">
            <span style={{ color: colors.primary }}>SIAKNG</span>
            <span className="text-white"> Lite</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="no-underline text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/matakuliah" 
              className="no-underline text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Mata Kuliah
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-white/60">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 text-white/80 hover:text-white cursor-pointer border-none bg-transparent"
            >
              Keluar
            </button>
          </nav>
        </header>
      )}
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer - only show when authenticated and NOT on auth pages */}
      {isAuthenticated && !isAuthPage && !isLoading && (
        <footer 
          className="px-8 py-4 text-center"
          style={{ backgroundColor: colors.secondary }}
        >
          <p className="text-sm text-white/60">
            © 2026 SIAKNG Lite. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}
