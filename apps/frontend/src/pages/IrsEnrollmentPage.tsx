import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MataKuliah, IrsSummary, Kelas } from '@siakng/types'
import { toast } from '@/components/toast'

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
  const [kelasMap, setKelasMap] = useState<Record<string, Kelas[]>>({})
  const [irsData, setIrsData] = useState<IrsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [enrollingMatkulId, setEnrollingMatkulId] = useState<string | null>(null)
  
  // Confirmation state - includes matakuliah AND kelas info
  const [confirmData, setConfirmData] = useState<{
    matakuliah: MataKuliah
    kelas: any
  } | null>(null)

  useEffect(() => {
    // Always fetch fresh data on mount (in case DOSEN deleted matkul/kelas)
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      
      // Load mata kuliah list (always fresh from API)
      const matakuliah = await api.getMataKuliah()
      // Sort alphabetically by nama
      const sortedMatakuliah = [...matakuliah].sort((a, b) => 
        a.nama.localeCompare(b.nama)
      )
      setMatakuliahList(sortedMatakuliah)
      
      // Load kelas for each mata kuliah
      console.log('=== Loading kelas for matakuliah ===')
      const kelasData: Record<string, Kelas[]> = {}
      for (const mk of matakuliah) {
        console.log(`Loading kelas for ${mk.kode} (id: ${mk.id})`)
        try {
          const kelasList = await api.getKelasByMataKuliah(mk.id)
          console.log(`Kelas for ${mk.kode}:`, kelasList)
          if (kelasList && kelasList.length > 0) {
            kelasData[mk.id] = kelasList
            console.log(`Added kelas for ${mk.kode} to map`)
          }
        } catch (e) {
          console.error(`Error loading kelas for ${mk.kode}:`, e)
        }
      }
      console.log('=== Final kelasMap ===', kelasData)
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
      toast(err.message || 'Gagal memuat data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1: User clicks "Ambil" - always fetch fresh data from API
  const handleEnroll = async (matakuliah: MataKuliah) => {
    console.log('=== handleEnroll ===')
    console.log('matakuliah.id:', matakuliah.id)
    console.log('matakuliah.nama:', matakuliah.nama)
    
    // Always fetch fresh data from API to get latest kelas (including deleted ones)
    let kelasList: Kelas[] = []
    try {
      console.log('Fetching fresh data from API...')
      const response: any = await api.getKelasByMataKuliah(matakuliah.id)
      console.log('API response:', response)
      if (Array.isArray(response)) {
        kelasList = response
      }
    } catch (e: any) {
      console.error('API error:', e)
      toast('Error: ' + e.message, 'error')
      return
    }
    
    console.log('Final kelasList:', kelasList)
    
    if (!kelasList || kelasList.length === 0) {
      toast(`TIDAK ADA KELAS untuk ${matakuliah.nama}. Hubungi dosen.`, 'warning')
      return
    }
    
    // If there's only 1 kelas, auto-select. If multiple, show selection modal.
    if (kelasList.length === 1) {
      setConfirmData({
        matakuliah,
        kelas: kelasList[0]
      })
    } else {
      // Show kelas selection - set matakuliah and show options
      setSelectedMatakuliahForSelection(matakuliah)
      setKelasOptionsForSelection(kelasList)
    }
  }

  // State for kelas selection modal
  const [selectedMatakuliahForSelection, setSelectedMatakuliahForSelection] = useState<MataKuliah | null>(null)
  const [kelasOptionsForSelection, setKelasOptionsForSelection] = useState<Kelas[]>([])

  // User selects a specific kelas from the options
  const handleSelectKelas = (kelas: Kelas) => {
    if (selectedMatakuliahForSelection) {
      setConfirmData({
        matakuliah: selectedMatakuliahForSelection,
        kelas: kelas
      })
      setSelectedMatakuliahForSelection(null)
      setKelasOptionsForSelection([])
    }
  }

  // Step 2: User confirms enrollment
  const handleConfirmEnroll = async () => {
    if (!confirmData) return
    
    const { matakuliah, kelas } = confirmData
    console.log('Confirming enrollment for:', matakuliah.nama, 'with kelas:', kelas.id)
    
    try {
      setEnrollingMatkulId(matakuliah.id)
      
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
      
      toast(`${matakuliah.nama} berhasil ditambahkan ke IRS!`, 'success')
      setConfirmData(null)
      await loadInitialData()
      
    } catch (err: any) {
      toast(err.message || 'Gagal mengambil mata kuliah', 'error')
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
      return e.mataKuliah?.id === matakuliahId
    }) || false
  }

  const isFull = (matakuliahId: string) => {
    const kelasList = kelasMap[matakuliahId]
    if (!kelasList || kelasList.length === 0) return false
    return kelasList.every(k => (k.currentEnrollment || 0) >= k.quota)
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

  if (!matakuliahList.length) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
              Ambil Mata Kuliah
            </h1>
            <p className="text-gray-400 mt-1">Pilih mata kuliah yang tersedia</p>
          </div>
          <Card style={{ backgroundColor: '#2A2A2A' }}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-300 mb-2">Belum ada mata kuliah</p>
              <p className="text-gray-500">Hubungi bagian akademik</p>
            </CardContent>
          </Card>
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

        {/* SKS Info */}
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

        {/* Confirmation Modal */}
        {confirmData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70"
              onClick={() => setConfirmData(null)}
            />
            {/* Modal Content */}
            <Card className="relative w-full max-w-md mx-4" style={{ backgroundColor: '#2A2A2A', border: `2px solid ${colors.primary}` }}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
                  Konfirmasi Pengambilan Mata Kuliah
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mata Kuliah</span>
                    <span className="text-white font-medium">{confirmData.matakuliah.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kode</span>
                    <span className="text-white">{confirmData.matakuliah.kode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SKS</span>
                    <span className="text-white">{confirmData.matakuliah.sks} SKS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kelas</span>
                    <span className="text-white">{confirmData.kelas.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Jadwal</span>
                    <span className="text-white">
                      {confirmData.kelas.hari || '-'} {confirmData.kelas.jamMulai || '-'} - {confirmData.kelas.jamSelesai || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ruangan</span>
                    <span className="text-white">{confirmData.kelas.ruangan || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kuota</span>
                    <span className="text-white">{confirmData.kelas.currentEnrollment || 0}/{confirmData.kelas.quota}</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Apakah Anda yakin ingin mengambil mata kuliah ini?
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setConfirmData(null)}
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
                    disabled={enrollingMatkulId === confirmData.matakuliah.id}
                    className="flex-1 py-3 rounded-lg font-medium"
                    style={{ 
                      backgroundColor: colors.primary, 
                      color: colors.secondary,
                      border: 'none'
                    }}
                  >
                    {enrollingMatkulId === confirmData.matakuliah.id ? 'Mengambil...' : 'Ya, Ambil'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Kelas Selection Modal */}
        {selectedMatakuliahForSelection && kelasOptionsForSelection.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70"
              onClick={() => {
                setSelectedMatakuliahForSelection(null)
                setKelasOptionsForSelection([])
              }}
            />
            {/* Modal Content */}
            <Card className="relative w-full max-w-md mx-4" style={{ backgroundColor: '#2A2A2A', border: `2px solid ${colors.tertiary}` }}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.tertiary }}>
                  Pilih Kelas untuk {selectedMatakuliahForSelection.nama}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Terdapat {kelasOptionsForSelection.length} kelas tersedia. Pilih salah satu:
                </p>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {kelasOptionsForSelection.map(kelas => {
                    const isFullKelas = (kelas.currentEnrollment || 0) >= kelas.quota
                    return (
                      <div 
                        key={kelas.id}
                        className="p-4 rounded-lg flex items-center justify-between"
                        style={{ backgroundColor: '#3A3A3A' }}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-white">Kelas {kelas.nama}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${isFullKelas ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                              {kelas.currentEnrollment || 0}/{kelas.quota} mhs
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {kelas.hari || '-'} {kelas.jamMulai || '-'} - {kelas.jamSelesai || '-'}
                            {kelas.ruangan && ` • ${kelas.ruangan}`}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectKelas(kelas)}
                          disabled={isFullKelas}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{ 
                            backgroundColor: isFullKelas ? '#666' : colors.primary, 
                            color: colors.secondary,
                            border: 'none'
                          }}
                        >
                          {isFullKelas ? 'Penuh' : 'Pilih'}
                        </Button>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      setSelectedMatakuliahForSelection(null)
                      setKelasOptionsForSelection([])
                    }}
                    className="w-full py-2 rounded-lg font-medium"
                    style={{ 
                      backgroundColor: '#4A4A4A', 
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mata Kuliah List */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Daftar Mata Kuliah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matakuliahList.map((matakuliah) => {
                const kelasList = kelasMap[matakuliah.id]
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
                      </div>
                      
                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                          {kelasList && kelasList.length > 0 ? (
                            <>
                              {kelasList.filter(k => k.hari && k.jamMulai && k.jamSelesai).map(k => (
                                <div key={k.id} className="flex items-center gap-3 flex-wrap">
                                  <span className="font-medium text-white">Kelas {k.nama}:</span>
                                  <span className="text-gray-300">{k.currentEnrollment || 0}/{k.quota} mhs</span>
                                  <span className="text-green-400">
                                    {k.hari} {k.jamMulai}-{k.jamSelesai}
                                  </span>
                                  {k.ruangan && <span className="text-gray-500">({k.ruangan})</span>}
                                </div>
                              ))}
                              {kelasList.filter(k => k.hari && k.jamMulai && k.jamSelesai).length === 0 && (
                                <span className="text-yellow-500">Belum ada jadwal kelas</span>
                              )}
                            </>
                          ) : (
                            <span>Belum ada kelas tersedia</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}