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

export function KelasMahasiswaPage() {
  const { kelasId } = useParams<{ kelasId: string }>()
  const navigate = useNavigate()
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (kelasId) {
      loadMahasiswa(kelasId)
    }
  }, [kelasId])

  const loadMahasiswa = async (id: string) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await api.getKelasMahasiswa(id)
      setMahasiswaList(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar mahasiswa')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
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
          <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Daftar Mahasiswa
          </h1>
          <p className="text-gray-400 mt-1">
            {mahasiswaList.length} mahasiswa terdaftar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}>
            <p className="text-white">{error}</p>
          </div>
        )}

        {/* Student List */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardContent className="p-0">
            {!mahasiswaList.length ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-gray-400">Belum ada mahasiswa terdaftar</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: '#3A3A3A' }}>
                {mahasiswaList.map((item) => (
                  <div 
                    key={item.mahasiswa.id}
                    className="p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors cursor-pointer"
                    style={{ backgroundColor: '#2A2A2A' }}
                    onClick={() => navigate(`/mahasiswa/${item.mahasiswa.id}/profile`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" 
                        style={{ backgroundColor: colors.tertiary, color: colors.secondary }}>
                        {item.mahasiswa.nama?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'white' }}>
                          {item.mahasiswa.nama || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.mahasiswa.npm} • {item.mahasiswa.prodi}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.isApproved ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium" 
                          style={{ backgroundColor: colors.success, color: 'white' }}>
                          Disetujui
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium" 
                          style={{ backgroundColor: colors.warning, color: 'white' }}>
                          Pending
                        </span>
                      )}
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
