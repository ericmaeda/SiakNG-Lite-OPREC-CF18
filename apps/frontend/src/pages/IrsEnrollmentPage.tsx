import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MataKuliah, IrsSummary } from '@siakng/types'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

export function IrsEnrollmentPage() {
  const navigate = useNavigate()
  const [matakuliahList, setMatakuliahList] = useState<MataKuliah[]>([])
  const [kelasMap, setKelasMap] = useState<Record<string, { id: string; quota: number; currentEnrollment: number }>>({})
  const [irsData, setIrsData] = useState<IrsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollingMatkulId, setEnrollingMatkulId] = useState<string | null>(null)
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null)
  const [confirmMatkul, setConfirmMatkul] = useState<MataKuliah | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Load mata kuliah list
      const matakuliah = await api.getMataKuliah()
      setMatakuliahList(matakuliah)
      
      // Load kelas for each mata kuliah (to get enrollment status)
      const kelasData: Record<string, { id: string; quota: number; currentEnrollment: number }> = {}
      for (const mk of matakuliah) {
        try {
          const kelasList = await api.getKelasByMataKuliah(mk.id)
          if (kelasList.length > 0) {
            kelasData[mk.id] = {
              id: kelasList[0].id,
              quota: kelasList[0].quota,
              currentEnrollment: kelasList[0].currentEnrollment || 0
            }
          }
        } catch {
          // Skip if no kelas
        }
      }
      setKelasMap(kelasData)
      
      // Load current IRS
      try {
        const irs = await api.getMyIrs()
        setIrsData(irs)
      } catch {
        setIrsData({
          mahasiswa: { npm: '', nama: '', semester: 1, maxSks: 24 },
          totalSks: 0,
          sisaSks: 24,
          enrollments: []
        })
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async (matakuliah: MataKuliah) => {
    const kelas = kelasMap[matakuliah.id]
    if (!kelas) {
      setError('Kelas tidak tersedia untuk mata kuliah ini')
      return
    }

    // Show confirmation dialog
    setConfirmMatkul(matakuliah)
  }

  const handleConfirmEnroll = async () => {
    if (!confirmMatkul) return
    
    const kelas = kelasMap[confirmMatkul.id]
    if (!kelas) {
      setError('Kelas tidak tersedia untuk mata kuliah ini')
      setConfirmMatkul(null)
      return
    }

    try {
      setEnrollingMatkulId(confirmMatkul.id)
      setError('')
      setConfirmMatkul(null)
      
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth()
      const semester = currentMonth >= 2 && currentMonth <= 8 ? 2 : 1
      const tahunAkademik = currentMonth >= 2 && currentMonth <= 8 
        ? `${currentYear - 1}/${currentYear}` 
        : `${currentYear}/${currentYear + 1}`

      await api.enrollToKelas({
        kelasId: kelas.id,
        semester,
        tahunAkademik,
      })
      
      setEnrollSuccess(`${confirmMatkul.nama} berhasil ditambahkan ke IRS!`)
      
      // Refresh data
      await loadInitialData()
      
      setTimeout(() => setEnrollSuccess(null), 3000)
      
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil mata kuliah')
    } finally {
      setEnrollingMatkulId(null)
    }
  }

  const canEnroll = (matakuliah: MataKuliah) => {
    if (!irsData) return false
    return irsData.sisaSks >= matakuliah.sks
  }

  const isAlreadyEnrolled = (matakuliahId: string) => {
    return irsData?.enrollments.some(e => {
      // Check if the enrolled kelas belongs to this mata kuliah
      return e.mataKuliah?.id === matakuliahId
    }) || false
  }

  const isFull = (matakuliahId: string) => {
    const kelas = kelasMap[matakuliahId]
    return kelas && kelas.currentEnrollment >= kelas.quota
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-700 rounded"></div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
              Ambil Mata Kuliah
            </h1>
            <p className="text-gray-400 mt-1">
              Pilih mata kuliah yang tersedia
            </p>
          </div>
          <Button
            onClick={() => navigate('/irs')}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{ 
              backgroundColor: '#4A4A4A', 
              color: 'white',
              border: 'none'
            }}
          >
            Kembali ke IRS
          </Button>
        </div>

        {/* SKS Info Banner */}
        <Card className="mb-6" style={{ backgroundColor: '#2A2A2A', border: `1px solid ${colors.tertiary}` }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Total SKS IRS Saat Ini</p>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {irsData?.totalSks || 0} / {irsData?.mahasiswa.maxSks || 24} SKS
                  </p>
                </div>
                <div className="h-10 w-px bg-gray-600"></div>
                <div>
                  <p className="text-gray-400 text-xs">Sisa Kuota</p>
                  <p className="text-2xl font-bold" style={{ color: colors.tertiary }}>
                    {irsData?.sisaSks || 0} SKS
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-400">
                <p>Semester aktif tidak dapat melebihi {irsData?.mahasiswa.maxSks || 24} SKS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {enrollSuccess && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" 
            style={{ backgroundColor: '#1B3D1B', border: `1px solid ${colors.success}` }}>
            <span className="text-2xl">✓</span>
            <p className="text-white font-medium">{enrollSuccess}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}>
            <p className="text-white">{error}</p>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmMatkul && (
          <Card className="mb-6" style={{ backgroundColor: '#2A2A2A', border: `2px solid ${colors.primary}` }}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
                Konfirmasi Pengambilan Mata Kuliah
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mata Kuliah</span>
                  <span className="text-white font-medium">{confirmMatkul.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Kode</span>
                  <span className="text-white">{confirmMatkul.kode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SKS</span>
                  <span className="text-white">{confirmMatkul.sks} SKS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sisa Kuota SKS</span>
                  <span className="text-white">{irsData?.sisaSks || 0} SKS</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Apakah Anda yakin ingin mengambil mata kuliah ini?
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setConfirmMatkul(null)}
                  className="flex-1 py-3 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: '#4A4A4A', 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmEnroll}
                  disabled={enrollingMatkulId === confirmMatkul.id}
                  className="flex-1 py-3 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: colors.secondary,
                    border: 'none'
                  }}
                >
                  {enrollingMatkulId === confirmMatkul.id ? 'Mengambil...' : 'Ya, Ambil'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mata Kuliah List */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Daftar Mata Kuliah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!matakuliahList.length ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-400">Belum ada mata kuliah tersedia</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matakuliahList.map((matakuliah) => {
                  const kelas = kelasMap[matakuliah.id]
                  const enrolled = isAlreadyEnrolled(matakuliah.id)
                  const full = isFull(matakuliah.id)
                  const canTake = canEnroll(matakuliah)
                  
                  return (
                    <div 
                      key={matakuliah.id}
                      className="p-4 rounded-lg flex items-center justify-between"
                      style={{ backgroundColor: '#3A3A3A' }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button 
                            onClick={() => navigate(`/matakuliah/detail/${matakuliah.id}`)}
                            className="text-lg font-semibold text-left hover:underline"
                            style={{ color: colors.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            {matakuliah.nama}
                          </button>
                          <span className="px-2 py-0.5 rounded text-xs font-medium" 
                            style={{ backgroundColor: '#4A4A4A', color: colors.tertiary }}>
                            {matakuliah.kode}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium" 
                            style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
                            {matakuliah.sks} SKS
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium" 
                            style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
                            Semester {matakuliah.semester}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {kelas ? (
                            <>
                              <span>
                                {kelas.currentEnrollment} / {kelas.quota} mahasiswa
                              </span>
                              {full && (
                                <span className="px-2 py-0.5 rounded text-xs font-medium" 
                                  style={{ backgroundColor: colors.danger, color: 'white' }}>
                                  Penuh
                                </span>
                              )}
                            </>
                          ) : (
                            <span>Tidak ada kelas tersedia</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {enrolled ? (
                          <span 
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: colors.success, color: 'white' }}
                          >
                            ✓ Terdaftar
                          </span>
                        ) : !canTake ? (
                          <span 
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: '#666', color: 'white' }}
                          >
                            SKS Tidak Cukup
                          </span>
                        ) : full ? (
                          <span 
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{ backgroundColor: colors.danger, color: 'white' }}
                          >
                            Penuh
                          </span>
                        ) : (
                          <Button
                            onClick={() => handleEnroll(matakuliah)}
                            disabled={enrollingMatkulId === matakuliah.id}
                            className="px-4 py-2 rounded-lg font-medium"
                            style={{ 
                              backgroundColor: colors.primary, 
                              color: colors.secondary,
                              border: 'none'
                            }}
                          >
                            {enrollingMatkulId === matakuliah.id ? 'Mengambil...' : 'Ambil'}
                          </Button>
                        )}
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
