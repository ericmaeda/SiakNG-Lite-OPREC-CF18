import { Link } from 'react-router'

export function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to SIAKNG Lite</h1>
      <p className="text-lg text-gray-600 mb-8">Sistem Informasi Akademik Mahasiswa</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
