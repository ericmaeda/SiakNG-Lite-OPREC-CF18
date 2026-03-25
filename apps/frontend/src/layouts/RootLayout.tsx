import { Link, Outlet } from 'react-router'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white">
        <nav className="flex justify-between items-center container mx-auto">
          <Link to="/" className="text-xl font-bold no-underline text-white">
            SIAKNG Lite
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="no-underline text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/dashboard" className="no-underline text-white hover:text-gray-300">
              Dashboard
            </Link>
            <Link to="/matakuliah" className="no-underline text-white hover:text-gray-300">
              Mata Kuliah
            </Link>
            <Link to="/login" className="no-underline text-white hover:text-gray-300">
              Login
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="p-4 bg-gray-100 text-center">
        <p className="text-gray-600">&copy; 2026 SIAKNG Lite. All rights reserved.</p>
      </footer>
    </div>
  )
}
