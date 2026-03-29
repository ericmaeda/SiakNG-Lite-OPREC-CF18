import { Link } from 'react-router'
import { useAuth } from '../lib/auth-context'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600">
        Welcome, {user?.name}! You are logged in as {user?.role}.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Mata Kuliah</h3>
          <p className="text-gray-600 mb-4">Kelola mata kuliah</p>
          <Link to="/matakuliah" className="text-blue-600 hover:text-blue-800">
            Lihat Details
          </Link>
        </div>
        
        {user?.role === 'DOSEN' && (
          <>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Nilai</h3>
              <p className="text-gray-600">Kelola nilai mahasiswa</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Jadwal</h3>
              <p className="text-gray-600">Kelola jadwal kuliah</p>
            </div>
          </>
        )}
        
        {user?.role === 'MAHASISWA' && (
          <>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">KRS</h3>
              <p className="text-gray-600">Kartu Rencana Studi</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Nilai</h3>
              <p className="text-gray-600">Lihat nilai mahasiswa</p>
            </div>
          </>
        )}
        
        {user?.role === 'ADMIN' && (
          <>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Users</h3>
              <p className="text-gray-600">Kelola user</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Settings</h3>
              <p className="text-gray-600">Pengaturan sistem</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
