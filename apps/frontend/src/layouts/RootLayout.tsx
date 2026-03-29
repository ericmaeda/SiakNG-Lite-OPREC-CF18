import { Link, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../lib/auth-context'

export function RootLayout() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - hanya muncul kalau sudah login */}
      {isAuthenticated && (
        <header className="p-4 bg-gray-800 text-white">
          <nav className="flex justify-between items-center container mx-auto">
            <Link to="/dashboard" className="text-xl font-bold no-underline text-white">
              SIAKNG Lite
            </Link>
            <div className="flex gap-6">
              <Link to="/dashboard" className="no-underline text-white hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/matakuliah" className="no-underline text-white hover:text-gray-300">
                Mata Kuliah
              </Link>
              <span className="text-gray-300">
                {user?.name} ({user?.role})
              </span>
              <button 
                onClick={handleLogout}
                className="no-underline text-white hover:text-gray-300 cursor-pointer bg-transparent border-none"
              >
                Logout
              </button>
            </div>
          </nav>
        </header>
      )}
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer - hanya muncul kalau sudah login */}
      {isAuthenticated && (
        <footer className="p-4 bg-gray-100 text-center">
          <p className="text-gray-600">&copy; 2026 SIAKNG Lite. All rights reserved.</p>
        </footer>
      )}
    </div>
  )
}
