import { Link } from 'react-router'

export function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome to your dashboard!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Mata Kuliah</h3>
          <p className="text-gray-600 mb-4">Kelola mata kuliah</p>
          <Link to="/matakuliah" className="text-blue-600 hover:text-blue-800">
            Lihat Details
          </Link>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Nilai</h3>
          <p className="text-gray-600">Kelola nilai mahasiswa</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Jadwal</h3>
          <p className="text-gray-600">Kelola jadwal kuliah</p>
        </div>
      </div>
    </div>
  )
}
