import { useAuth } from '../lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
}

export function DashboardMahasiswa() {
  const { user} = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
              Dashboard Mahasiswa
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome, {user?.name || 'Mahasiswa'}!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium" style={{ color: colors.tertiary }}>
                IPK Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: 'white' }}>3.75</p>
              <p className="text-gray-400 text-sm mt-2">Semester 4</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium" style={{ color: colors.tertiary }}>
                SKS Diambil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: 'white' }}>20</p>
              <p className="text-gray-400 text-sm mt-2">Dari 144 SKS</p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-lg font-medium" style={{ color: colors.tertiary }}>
                Mata Kuliah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold" style={{ color: 'white' }}>6</p>
              <p className="text-gray-400 text-sm mt-2">Semester ini</p>
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
                Lihat Mata Kuliah
              </Button>
              
              <Button
                className="py-6 px-6 rounded-lg font-semibold"
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.secondary,
                  border: 'none'
                }}
              >
                Lihat Nilai
              </Button>
              
              <Button
                className="py-6 px-6 rounded-lg font-semibold"
                style={{ 
                  backgroundColor: '#4A4A4A', 
                  color: 'white',
                  border: 'none'
                }}
              >
                Jadwal Kuliah
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jadwal Kuliah */}
        <Card className="mt-8" style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Jadwal Kuliah Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Algoritma & Struktur Data</p>
                  <p className="text-sm text-gray-400">08:00 - 10:30 • R. Lab Komputer A</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.tertiary, color: colors.secondary }}>
                  Berlangsung
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Basis Data</p>
                  <p className="text-sm text-gray-400">10:30 - 13:00 • R. 201</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
                  Berikutnya
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Pemrograman Web</p>
                  <p className="text-sm text-gray-400">13:30 - 16:00 • R. Lab Komputer B</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
                  Berikutnya
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card className="mt-8" style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Nilai Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}> Kalkulus</p>
                  <p className="text-sm text-gray-400">Nilai: 85 • Grade: A</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                  Released
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                <div>
                  <p className="font-medium" style={{ color: 'white' }}>Pengantar TI</p>
                  <p className="text-sm text-gray-400">Nilai: 90 • Grade: A</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                  Released
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
