import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { IrsSummary } from '@siakng/types'
import { JadwalGrid } from '@/components/jadwal-view'
import { toast } from '@/components/toast'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

export function IrsPage() {
  const navigate = useNavigate()
  const [irsData, setIrsData] = useState<IrsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [unenrollingId, setUnenrollingId] = useState<string | null>(null)
  const [confirmUnenroll, setConfirmUnenroll] = useState<{ kelasId: string; nama: string } | null>(null)

  // Default to current semester/year
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const defaultSemester = currentMonth >= 2 && currentMonth <= 8 ? 2 : 1
  const defaultTahunAkademik = currentMonth >= 2 && currentMonth <= 8 
    ? `${currentYear - 1}/${currentYear}` 
    : `${currentYear}/${currentYear + 1}`

  useEffect(() => {
    loadIrs()
  }, [])

  const loadIrs = async () => {
    try {
      setIsLoading(true)
      const data = await api.getMyIrs()
      setIrsData(data)
    } catch (err: any) {
      toast(err.message || 'Gagal memuat IRS', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnenroll = (kelasId: string, mataKuliahNama: string) => {
    setConfirmUnenroll({ kelasId, nama: mataKuliahNama })
  }

  const handleConfirmUnenroll = async () => {
    if (!confirmUnenroll) return
    
    try {
      setUnenrollingId(confirmUnenroll.kelasId)
      setConfirmUnenroll(null)
      await api.unenrollFromKelas(confirmUnenroll.kelasId)
      await loadIrs() // Refresh data
      toast('Mata kuliah berhasil dilepas dari IRS', 'success')
    } catch (err: any) {
      toast(err.message || 'Gagal melepas mata kuliah', 'error')
    } finally {
      setUnenrollingId(null)
    }
  }

  const getSksColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return colors.danger
    if (percentage >= 75) return colors.warning
    return colors.success
  }

  const getStatusBadge = (status: string, isApproved: boolean) => {
    if (isApproved) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium" 
          style={{ backgroundColor: colors.success, color: 'white' }}>
          Disetujui
        </span>
      )
    }
    if (status === 'aktif') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium" 
          style={{ backgroundColor: colors.tertiary, color: colors.secondary }}>
          Aktif
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium" 
        style={{ backgroundColor: '#666', color: 'white' }}>
        {status}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
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
              IRS - Isian Rencana Studi
            </h1>
            <p className="text-gray-400 mt-1">
              Tahun Akademik: {irsData?.mahasiswa.semester || defaultSemester} / {defaultTahunAkademik}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/matakuliah')}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{ 
                backgroundColor: '#4A4A4A', 
                color: 'white',
                border: 'none'
              }}
            >
              Lihat Mata Kuliah
            </Button>
            <Button
              onClick={() => navigate('/irs/enroll')}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{ 
                backgroundColor: colors.primary, 
                color: colors.secondary,
                border: 'none'
              }}
            >
              Tambah Mata Kuliah
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmUnenroll && (
          <Card className="mb-6" style={{ backgroundColor: '#2A2A2A', border: `2px solid ${colors.danger}` }}>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.danger }}>
                Konfirmasi Lepas Mata Kuliah
              </h3>
              <p className="text-gray-300 mb-6">
                Apakah Anda yakin ingin melepas mata kuliah <span className="font-medium text-white">{confirmUnenroll.nama}</span> dari IRS?
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setConfirmUnenroll(null)}
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
                  onClick={handleConfirmUnenroll}
                  disabled={!!unenrollingId}
                  className="flex-1 py-3 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: colors.danger, 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {unenrollingId ? 'Melepas...' : 'Ya, Lepas'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SKS Summary Card */}
        <Card className="mb-8" style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total SKS Diambil</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold" style={{ color: getSksColor(irsData?.totalSks || 0, irsData?.mahasiswa.maxSks || 24) }}>
                    {irsData?.totalSks || 0}
                  </span>
                  <span className="text-gray-400 text-xl">/ {irsData?.mahasiswa.maxSks || 24} SKS</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Sisa Kuota</p>
                <p className="text-3xl font-bold" style={{ color: colors.tertiary }}>
                  {irsData?.sisaSks || 0} SKS
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#3A3A3A' }}>
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(((irsData?.totalSks || 0) / (irsData?.mahasiswa.maxSks || 24)) * 100, 100)}%`,
                  backgroundColor: getSksColor(irsData?.totalSks || 0, irsData?.mahasiswa.maxSks || 24)
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Jadwal Grid - Visual Schedule */}
        {irsData && irsData.enrollments.length > 0 && (
          <Card className="mb-8" style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
                Jadwal Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <JadwalGrid 
                  enrollments={irsData.enrollments}
                  showHeader={true}
                  onEnrollmentClick={(e) => navigate(`/matakuliah/detail/${e.mataKuliah.id}`)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* IRS List */}
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
              Mata Kuliah yang Diambil
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!irsData?.enrollments?.length ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-400 mb-4">Belum ada mata kuliah dalam IRS</p>
                <Button
                  onClick={() => navigate('/irs/enroll')}
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: colors.secondary,
                    border: 'none'
                  }}
                >
                  Ambil Mata Kuliah
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {irsData.enrollments.map((enrollment) => (
                  <div 
                    key={enrollment.id}
                    className="p-4 rounded-lg transition-all"
                    style={{ backgroundColor: '#3A3A3A' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button 
                            onClick={() => enrollment.mataKuliah?.id && navigate(`/matakuliah/detail/${enrollment.mataKuliah.id}`)}
                            className="text-lg font-semibold text-left hover:underline"
                            style={{ color: colors.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            {enrollment.mataKuliah?.nama || 'Unknown'}
                          </button>
                          <span className="px-2 py-0.5 rounded text-xs font-medium" 
                            style={{ backgroundColor: '#4A4A4A', color: colors.tertiary }}>
                            {enrollment.mataKuliah?.kode}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium" 
                            style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
                            {enrollment.mataKuliah?.sks} SKS
                          </span>
                          {getStatusBadge(enrollment.status, enrollment.isApproved)}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>Kelas {enrollment.kelas?.nama}</span>
                          <span>•</span>
                          <span>{enrollment.kelas?.hari || '-'}</span>
                          <span>•</span>
                          <span>{enrollment.kelas?.jamMulai || '-'} - {enrollment.kelas?.jamSelesai || '-'}</span>
                          <span>•</span>
                          <span>{enrollment.kelas?.ruangan || '-'}</span>
                        </div>
                      </div>
                      
                      {!enrollment.isApproved && (
                        <Button
                          onClick={() => handleUnenroll(enrollment.kelas?.id || '', enrollment.mataKuliah?.nama || '')}
                          disabled={unenrollingId === enrollment.kelas?.id}
                          className="ml-4 px-3 py-1 rounded text-sm font-medium"
                          style={{ 
                            backgroundColor: colors.danger, 
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          {unenrollingId === enrollment.kelas?.id ? 'Melepas...' : 'Lepas'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Unenroll Confirmation Modal */}
      {confirmUnenroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setConfirmUnenroll(null)}
          />
          {/* Modal Content */}
          <Card className="relative w-full max-w-sm mx-4" style={{ backgroundColor: '#2A2A2A', border: `2px solid ${colors.danger}` }}>
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.danger }}>
                Lepas Mata Kuliah?
              </h3>
              <p className="text-gray-400 mb-6">
                Anda akan melepas mata kuliah <span className="text-white font-medium">{confirmUnenroll.nama}</span> dari IRS Anda.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setConfirmUnenroll(null)}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: '#4A4A4A', 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmUnenroll}
                  disabled={unenrollingId === confirmUnenroll.kelasId}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: colors.danger, 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {unenrollingId === confirmUnenroll.kelasId ? 'Melepas...' : 'Lepas'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
