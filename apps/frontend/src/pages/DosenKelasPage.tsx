import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
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

export function DosenKelasPage() {
  const navigate = useNavigate()
  const [kelasList, setKelasList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadKelas()
  }, [])

  const loadKelas = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await api.getDosenMyKelas()
      setKelasList(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar kelas')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            className="mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#4A4A4A', color: 'white', border: 'none' }}
          >
            ← Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Kelas Saya
          </h1>
          <p className="text-gray-400 mt-1">
            Daftar kelas yang Anda ampu
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}>
            <p className="text-white">{error}</p>
          </div>
        )}

        {/* Classes List */}
        {!kelasList.length ? (
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400">Belum ada kelas</p>
              <Button
                onClick={() => navigate('/matakuliah/tambah')}
                className="mt-4 px-6 py-2 rounded-lg"
                style={{ backgroundColor: colors.primary, color: colors.secondary, border: 'none' }}
              >
                Tambah Mata Kuliah
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {kelasList.map((kelas) => {
              const isFull = kelas.currentEnrollment >= kelas.quota
              const fillPercentage = (kelas.currentEnrollment / kelas.quota) * 100
              
              return (
                <Card key={kelas.id} style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-lg text-sm font-medium" 
                            style={{ backgroundColor: colors.tertiary, color: colors.secondary }}>
                            {kelas.mataKuliahKode || 'MK'}
                          </span>
                          <h3 className="text-lg font-bold" style={{ color: 'white' }}>
                            {kelas.mataKuliahNama || 'Mata Kuliah'}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-xs" 
                            style={{ backgroundColor: '#4A4A4A', color: colors.primary }}>
                            Kelas {kelas.nama}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                          <span>{kelas.jamMulai && kelas.jamSelesai ? `${kelas.hari}, ${kelas.jamMulai} - ${kelas.jamSelesai}` : kelas.hari || 'Jadwal belum diatur'}</span>
                          <span>•</span>
                          <span>{kelas.ruangan || 'Ruangan belum diatur'}</span>
                          <span>•</span>
                          <span>{kelas.mataKuliahSks || '?'} SKS</span>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Kuota Terisi</span>
                            <span style={{ color: isFull ? colors.danger : colors.success }}>
                              {kelas.currentEnrollment} / {kelas.quota}
                            </span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#3A3A3A' }}>
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${Math.min(fillPercentage, 100)}%`,
                                backgroundColor: isFull ? colors.danger : fillPercentage >= 80 ? colors.warning : colors.success
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button
                          onClick={() => navigate(`/kelas/${kelas.id}/mahasiswa`)}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{ 
                            backgroundColor: colors.primary, 
                            color: colors.secondary,
                            border: 'none'
                          }}
                        >
                          Lihat Mahasiswa ({kelas.currentEnrollment})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
