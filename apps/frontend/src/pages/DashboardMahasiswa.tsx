import { useAuth } from '../lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

export function DashboardMahasiswa() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: colors.primary }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full filter blur-3xl" style={{ backgroundColor: colors.tertiary }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold" 
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})`, color: colors.secondary }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: colors.primary }}>
                Selamat Datang,
              </h1>
              <p className="text-2xl font-medium" style={{ color: 'white' }}>
                {user?.name || 'Mahasiswa'}
              </p>
              <p className="text-gray-400 mt-1">Mahasiswa Aktif</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 -mt-4">
        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
          Menu Utama
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/irs')}
            className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#2A2A2A', border: `1px solid ${colors.primary}30` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 transform translate-x-6 -translate-y-6" 
              style={{ backgroundColor: colors.primary }} />
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
              style={{ backgroundColor: `${colors.primary}20` }}>
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: colors.primary }}>IRS Saya</h3>
            <p className="text-sm text-gray-400">Kelola rencana studi</p>
          </button>

          <button
            onClick={() => navigate('/matakuliah')}
            className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#2A2A2A', border: `1px solid ${colors.tertiary}30` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 transform translate-x-6 -translate-y-6" 
              style={{ backgroundColor: colors.tertiary }} />
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
              style={{ backgroundColor: `${colors.tertiary}20` }}>
              <span className="text-3xl">📖</span>
            </div>
            <h3 className="text-lg font-bold mb-1" style={{ color: colors.tertiary }}>Mata Kuliah</h3>
            <p className="text-sm text-gray-400">Lihat semua matkul</p>
          </button>

          <button
            onClick={() => navigate('/irs/enroll')}
            className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: '#2A2A2A', border: '1px solid #4A4A4A' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 transform translate-x-6 -translate-y-6" 
              style={{ backgroundColor: '#888' }} />
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
              style={{ backgroundColor: '#4A4A4A' }}>
              <span className="text-3xl">➕</span>
            </div>
            <h3 className="text-lg font-bold mb-1 text-white">Ambil Matkul</h3>
            <p className="text-sm text-gray-400">Tambah matkul ke IRS</p>
          </button>


        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden" style={{ backgroundColor: '#2A2A2A', border: `1px solid ${colors.tertiary}30` }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" 
                  style={{ background: `linear-gradient(135deg, ${colors.tertiary}30, ${colors.tertiary}10)` }}>
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.tertiary }}>Tips untuk Kamu</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Periksa IRS kamu secara berkala dan pastikan total SKS tidak melebihi batas maksimal. 
                    Konsultasikan dengan dosen pembimbing jika ada kendala.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden" style={{ backgroundColor: '#2A2A2A', border: `1px solid ${colors.primary}30` }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" 
                  style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.primary}10)` }}>
                  <span className="text-2xl">📌</span>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.primary }}>Pengingat</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Jangan lupa untuk selalu memperbarui IRS kamu setiap awal semester sebelum batas waktu yang ditentukan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
