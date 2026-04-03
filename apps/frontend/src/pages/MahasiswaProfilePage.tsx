import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { api } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

export function MahasiswaProfilePage() {
  const { mahasiswaId } = useParams<{ mahasiswaId: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mahasiswaId) {
      loadProfile(mahasiswaId)
    }
  }, [mahasiswaId])

  const loadProfile = async (id: string) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await api.getMahasiswaProfile(id)
      setProfile(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat profil mahasiswa')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#4A4A4A', color: 'white', border: 'none' }}
          >
            ← Kembali
          </Button>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}>
            <p className="text-white">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-4xl mx-auto text-center text-gray-400">
          Data tidak ditemukan
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#4A4A4A', color: 'white', border: 'none' }}
          >
            ← Kembali
          </Button>
        </div>

        {/* Profile Card */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardContent className="p-8">
            {/* Avatar and Name */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold" 
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})`, color: colors.secondary }}>
                {profile.nama?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
                  {profile.nama || 'Unknown'}
                </h1>
                <p className="text-gray-400">{profile.email}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg" style={{ color: colors.primary }}>Informasi Pribadi</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">NPM</span>
                    <span style={{ color: 'white' }}>{profile.npm}</span>
                  </div>
                  
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">Program Studi</span>
                    <span style={{ color: 'white' }}>{profile.prodi}</span>
                  </div>
                  
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">Fakultas</span>
                    <span style={{ color: 'white' }}>{profile.fakultas}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg" style={{ color: colors.primary }}>Informasi Akademik</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">Angkatan</span>
                    <span style={{ color: 'white' }}>{profile.angkatan}</span>
                  </div>
                  
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">Semester</span>
                    <span style={{ color: 'white' }}>{profile.semester}</span>
                  </div>
                  
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">IPK</span>
                    <span style={{ color: colors.tertiary, fontWeight: 'bold' }}>{profile.ipk}</span>
                  </div>
                  
                  <div className="flex justify-between p-3 rounded-lg" style={{ backgroundColor: '#3A3A3A' }}>
                    <span className="text-gray-400">Max SKS</span>
                    <span style={{ color: colors.primary, fontWeight: 'bold' }}>{profile.maxSks} SKS</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
