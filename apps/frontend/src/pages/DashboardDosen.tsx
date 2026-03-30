import { useAuth } from '../lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
}

export function DashboardDosen() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
              Dashboard Dosen
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome, {user?.name || 'Dosen'}!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium" style={{ color: colors.tertiary }}>
                Mata Kuliah Diampu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: 'white' }}>5</p>
              <p className="text-gray-400 text-sm mt-2">Semester ini</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium" style={{ color: colors.tertiary }}>
                Total Mahasiswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: 'white' }}>150</p>
              <p className="text-gray-400 text-sm mt-2">Di seluruh mata kuliah</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium" style={{ color: colors.tertiary }}>
                Nilai Belum Diinput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: 'white' }}>12</p>
              <p className="text-gray-400 text-sm mt-2">Menunggu input</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/matakuliah')}
                className="py-6 px-6 rounded-lg font-semibold"
                style={{ 
                  backgroundColor: colors.tertiary, 
                  color: colors.secondary,
                  border: 'none'
                }}
              >
                Kelola Mata Kuliah
              </Button>
              
              <Button
                className="py-6 px-6 rounded-lg font-semibold"
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.secondary,
                  border: 'none'
                }}
              >
                Input Nilai Mahasiswa
              </Button>
              
              <Button
                className="py-6 px-6 rounded-lg font-semibold"
                style={{ 
                  backgroundColor: '#4A4A4A', 
                  color: 'white',
                  border: 'none'
                }}
              >
                Lihat Jadwal Kuliah
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-8" style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Aktivitas Terkini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Nilai Algoritma diperbarui</p>
                  <p className="text-sm text-gray-400">5 mahasiswa - 2 jam yang lalu</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                  Selesai
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Nilai Struktur Data diperbarui</p>
                  <p className="text-sm text-gray-400">8 mahasiswa - 5 jam yang lalu</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                  Selesai
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Jadwal perkuliahan diperbarui</p>
                  <p className="text-sm text-gray-400">1 hari yang lalu</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FFA500', color: 'white' }}>
                  Ditinjau
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
