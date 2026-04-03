import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

export function MataKuliahDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<{
    mataKuliah: {
      id: string;
      kode: string;
      nama: string;
      sks: number;
      semester: number;
    };
    dosen: {
      id: string;
      nama: string;
      email: string;
    } | null;
    kelas: Array<{
      id: string;
      nama: string;
      quota: number;
      ruangan: string | null;
      hari: string | null;
      jamMulai: string | null;
      jamSelesai: string | null;
      currentEnrollment: number;
    }>;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadDetail(id)
    }
  }, [id])

  const loadDetail = async (mataKuliahId: string) => {
    try {
      setIsLoading(true)
      setError('')
      const result = await api.getMataKuliahDetail(mataKuliahId)
      setData(result)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail mata kuliah')
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
            <div className="h-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}>
            <p className="text-white">{error}</p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#4A4A4A', color: 'white', border: 'none' }}
          >
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-4xl mx-auto text-center text-gray-400">
          Data tidak ditemukan
        </div>
      </div>
    )
  }

  const { mataKuliah, dosen, kelas } = data

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
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
                {mataKuliah.nama}
              </h1>
              <p className="text-gray-400 mt-1">
                {mataKuliah.kode} • Semester {mataKuliah.semester}
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">SKS</p>
              <p className="text-3xl font-bold" style={{ color: colors.tertiary }}>
                {mataKuliah.sks}
              </p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">Jumlah Kelas</p>
              <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                {kelas.length}
              </p>
            </CardContent>
          </Card>
          
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardContent className="p-4">
              <p className="text-gray-400 text-sm">Total Kuota</p>
              <p className="text-3xl font-bold text-white">
                {kelas.reduce((sum, k) => sum + k.quota, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dosen Info */}
        <Card className="mb-6" style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ color: colors.primary }}>
              Dosen Pengampu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dosen ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" 
                  style={{ backgroundColor: colors.tertiary, color: colors.secondary }}>
                  {dosen.nama.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{dosen.nama}</p>
                  <p className="text-gray-400 text-sm">{dosen.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Dosen belum ditugaskan</p>
            )}
          </CardContent>
        </Card>

        {/* Kelas List */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ color: colors.primary }}>
              Daftar Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!kelas.length ? (
              <p className="text-gray-400 text-center py-8">Tidak ada kelas tersedia</p>
            ) : (
              <div className="space-y-4">
                {kelas.map((k) => {
                  const isFull = k.currentEnrollment >= k.quota
                  return (
                    <div 
                      key={k.id}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#3A3A3A' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-lg text-sm font-medium" 
                              style={{ backgroundColor: colors.tertiary, color: colors.secondary }}>
                              Kelas {k.nama}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              isFull 
                                ? 'text-white' 
                                : k.currentEnrollment >= k.quota * 0.8 
                                  ? 'text-white'
                                  : 'text-white'
                            }`}
                              style={{ 
                                backgroundColor: isFull 
                                  ? colors.danger 
                                  : k.currentEnrollment >= k.quota * 0.8 
                                    ? colors.warning 
                                    : colors.success 
                              }}>
                              {k.currentEnrollment} / {k.quota} mahasiswa
                              {isFull && ' (Penuh)'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Hari</p>
                              <p className="text-white">{k.hari || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Jam</p>
                              <p className="text-white">
                                {k.jamMulai && k.jamSelesai ? `${k.jamMulai} - ${k.jamSelesai}` : '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Ruangan</p>
                              <p className="text-white">{k.ruangan || '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Sisa Kuota</p>
                              <p className="text-white">{k.quota - k.currentEnrollment}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#4A4A4A' }}>
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${Math.min((k.currentEnrollment / k.quota) * 100, 100)}%`,
                              backgroundColor: isFull 
                                ? colors.danger 
                                : k.currentEnrollment >= k.quota * 0.8 
                                  ? colors.warning 
                                  : colors.success
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
