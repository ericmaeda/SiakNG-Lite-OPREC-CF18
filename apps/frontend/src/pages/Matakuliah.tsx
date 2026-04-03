import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../lib/auth-context'
import { api } from '../lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MataKuliah } from '@siakng/types'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
}

export function Matakuliah() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [matakuliah, setMatakuliah] = useState<MataKuliah[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isDosen = user?.role === 'DOSEN'

  useEffect(() => {
    loadMataKuliah()
  }, [])

  const loadMataKuliah = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await api.getMataKuliah() as MataKuliah[]
      setMatakuliah(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat mata kuliah')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (mk: MataKuliah) => {
    if (!confirm(`Hapus mata kuliah "${mk.nama}"?`)) return
    
    try {
      setDeletingId(mk.id)
      await api.deleteMataKuliah(mk.id)
      setMatakuliah(matakuliah.filter(m => m.id !== mk.id))
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus mata kuliah')
    } finally {
      setDeletingId(null)
    }
  }

  // Group by semester
  const groupedBySemester = matakuliah.reduce((acc, mk) => {
    const semester = mk.semester
    if (!acc[semester]) acc[semester] = []
    acc[semester].push(mk)
    return acc
  }, {} as Record<number, MataKuliah[]>)

  const sortedSemesters = Object.keys(groupedBySemester)
    .map(Number)
    .sort((a, b) => a - b)

  if (isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondary }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full filter blur-3xl" style={{ backgroundColor: colors.primary }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
                Mata Kuliah
              </h1>
              <p className="text-gray-400 mt-1">
                {matakuliah.length} mata kuliah tersedia
              </p>
            </div>
            {isDosen && (
              <Button
                onClick={() => navigate('/matakuliah/tambah')}
                className="px-6 py-3 rounded-xl font-semibold"
                style={{ backgroundColor: colors.primary, color: colors.secondary, border: 'none' }}
              >
                ➕ Tambah Matkul
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#5C2020', border: `1px solid ${colors.danger}` }}>
            <p className="text-white">{error}</p>
          </div>
        )}

        {matakuliah.length === 0 ? (
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>
                Belum Ada Mata Kuliah
              </h3>
              <p className="text-gray-400 mb-4">
                {isDosen ? 'Mulai dengan menambahkan mata kuliah pertama Anda' : 'Mata kuliah belum tersedia'}
              </p>
              {isDosen && (
                <Button
                  onClick={() => navigate('/matakuliah/tambah')}
                  className="px-6 py-3 rounded-xl"
                  style={{ backgroundColor: colors.primary, color: colors.secondary, border: 'none' }}
                >
                  Tambah Mata Kuliah
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {sortedSemesters.map(semester => (
              <div key={semester}>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                  <span className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: `${colors.primary}20` }}>
                    Semester {semester}
                  </span>
                  <span className="text-gray-400 text-sm font-normal">
                    {groupedBySemester[semester].length} mata kuliah
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedBySemester[semester].map((mk) => (
                    <Card 
                      key={mk.id} 
                      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                      onClick={() => navigate(`/matakuliah/detail/${mk.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" 
                            style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.tertiary}30)` }}>
                            {mk.kode.substring(0, 2)}
                          </div>
                          {isDosen && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(mk)
                                }}
                                disabled={deletingId === mk.id}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
                                style={{ backgroundColor: `${colors.danger}20` }}
                                title="Hapus"
                              >
                                {deletingId === mk.id ? '...' : '🗑️'}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg mb-2" style={{ color: 'white' }}>
                          {mk.nama}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-1 rounded text-xs font-medium" 
                            style={{ backgroundColor: `${colors.tertiary}20`, color: colors.tertiary }}>
                            {mk.kode}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium" 
                            style={{ backgroundColor: '#4A4A4A', color: 'white' }}>
                            {mk.sks} SKS
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Semester {mk.semester}</span>
                          <span className="flex items-center gap-1" style={{ color: colors.primary }}>
                            Lihat Detail →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
