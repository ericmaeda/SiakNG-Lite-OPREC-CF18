import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MataKuliah } from '@siakng/types'
import { toast } from '@/components/toast'

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
  const [matakuliahList, setMatakuliahList] = useState<MataKuliah[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Delete confirmation modal
  const [deleteConfirmData, setDeleteConfirmData] = useState<{ id: string; nama: string; matkul: string } | null>(null)
  
  // Create kelas modal
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newKelas, setNewKelas] = useState({
    mataKuliahId: '',
    nama: 'A',
    quota: 30,
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '10:00',
    ruangan: ''
  })

  useEffect(() => {
    loadKelas()
  }, [])

  const loadKelas = async () => {
    try {
      setIsLoading(true)
      const [kelasData, matakuliahData] = await Promise.all([
        api.getDosenMyKelas(),
        api.getMataKuliah()
      ])
      setKelasList(kelasData)
      setMatakuliahList(matakuliahData)
    } catch (err: any) {
      toast(err.message || 'Gagal memuat daftar kelas', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (kelas: any) => {
    setDeleteConfirmData({ 
      id: kelas.id, 
      nama: kelas.nama, 
      matkul: kelas.mataKuliahNama 
    })
  }
  
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmData) return
    
    try {
      setDeletingId(deleteConfirmData.id)
      await api.deleteKelas(deleteConfirmData.id)
      setKelasList(kelasList.filter(k => k.id !== deleteConfirmData.id))
      setDeleteConfirmData(null)
      toast('Kelas berhasil dihapus', 'success')
    } catch (err: any) {
      toast(err.message || 'Gagal menghapus kelas', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateKelas = async () => {
    if (!newKelas.mataKuliahId) {
      toast('Pilih mata kuliah terlebih dahulu', 'warning')
      return
    }
    
    try {
      setCreating(true)
      
      // Create kelas
      await api.createKelas({
        mataKuliahId: newKelas.mataKuliahId,
        nama: newKelas.nama,
        quota: newKelas.quota,
        ruangan: newKelas.ruangan || undefined,
        hari: newKelas.hari,
        jamMulai: newKelas.jamMulai,
        jamSelesai: newKelas.jamSelesai
      })
      
      // Close modal and refresh
      setShowCreateModal(false)
      setNewKelas({
        mataKuliahId: '',
        nama: 'A',
        quota: 30,
        hari: 'Senin',
        jamMulai: '08:00',
        jamSelesai: '10:00',
        ruangan: ''
      })
      await loadKelas()
      toast('Kelas berhasil dibuat', 'success')
    } catch (err: any) {
      toast(err.message || 'Gagal membuat kelas', 'error')
    } finally {
      setCreating(false)
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

        {/* Create Kelas Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4" style={{ backgroundColor: '#2A2A2A' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold" style={{ color: colors.primary }}>
                  Buat Kelas Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mata Kuliah Select */}
                <div>
                  <Label className="text-gray-300">Mata Kuliah *</Label>
                  <select
                    value={newKelas.mataKuliahId}
                    onChange={(e) => setNewKelas({ ...newKelas, mataKuliahId: e.target.value })}
                    className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="">Pilih Mata Kuliah</option>
                    {matakuliahList.map(mk => (
                      <option key={mk.id} value={mk.id}>
                        {mk.kode} - {mk.nama} ({mk.sks} SKS)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Kelas */}
                <div>
                  <Label className="text-gray-300">Nama Kelas</Label>
                  <Input
                    value={newKelas.nama}
                    onChange={(e) => setNewKelas({ ...newKelas, nama: e.target.value })}
                    placeholder="A"
                    className="mt-1 bg-gray-700 text-white border-gray-600"
                  />
                </div>

                {/*Quota */}
                <div>
                  <Label className="text-gray-300">Kuota</Label>
                  <Input
                    type="number"
                    value={newKelas.quota}
                    onChange={(e) => setNewKelas({ ...newKelas, quota: parseInt(e.target.value) || 30 })}
                    className="mt-1 bg-gray-700 text-white border-gray-600"
                  />
                </div>

                {/*Hari */}
                <div>
                  <Label className="text-gray-300">Hari</Label>
                  <select
                    value={newKelas.hari}
                    onChange={(e) => setNewKelas({ ...newKelas, hari: e.target.value })}
                    className="w-full mt-1 p-2 rounded bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                {/* Jam Mulai */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Jam Mulai</Label>
                    <Input
                      type="time"
                      value={newKelas.jamMulai}
                      onChange={(e) => setNewKelas({ ...newKelas, jamMulai: e.target.value })}
                      className="mt-1 bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Jam Selesai</Label>
                    <Input
                      type="time"
                      value={newKelas.jamSelesai}
                      onChange={(e) => setNewKelas({ ...newKelas, jamSelesai: e.target.value })}
                      className="mt-1 bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                {/* Ruangan */}
                <div>
                  <Label className="text-gray-300">Ruangan</Label>
                  <Input
                    value={newKelas.ruangan}
                    onChange={(e) => setNewKelas({ ...newKelas, ruangan: e.target.value })}
                    placeholder="Ruang 101"
                    className="mt-1 bg-gray-700 text-white border-gray-600"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 rounded-lg"
                    style={{ backgroundColor: '#4A4A4A', color: 'white', border: 'none' }}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleCreateKelas}
                    disabled={creating || !newKelas.mataKuliahId}
                    className="flex-1 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary, color: colors.secondary, border: 'none' }}
                  >
                    {creating ? 'Membuat...' : 'Buat Kelas'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Classes List */}
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 rounded-lg font-medium"
            style={{ backgroundColor: colors.primary, color: colors.secondary, border: 'none' }}
          >
            + Buat Kelas Baru
          </Button>
        </div>

        {!kelasList.length ? (
          <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400 mb-2">Belum ada kelas</p>
              <p className="text-sm text-gray-500 mb-4">Klik "Buat Kelas Baru" untuk membuat kelas mahasiswa</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 rounded-lg"
                style={{ backgroundColor: colors.primary, color: colors.secondary, border: 'none' }}
              >
                Buat Kelas Baru
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

                      <div className="ml-4 flex flex-col gap-2">
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
                        <Button
                          onClick={() => handleDeleteClick(kelas)}
                          disabled={deletingId === kelas.id}
                          className="px-4 py-2 rounded-lg font-medium"
                          style={{ 
                            backgroundColor: colors.danger, 
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          {deletingId === kelas.id ? 'Menghapus...' : 'Hapus Kelas'}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={() => setDeleteConfirmData(null)}
          />
          {/* Modal Content */}
          <Card className="relative w-full max-w-sm mx-4" style={{ backgroundColor: '#2A2A2A', border: `2px solid ${colors.danger}` }}>
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.danger }}>
                Hapus Kelas?
              </h3>
              <p className="text-gray-400 mb-6">
                Anda akan menghapus kelas <span className="text-white font-medium">{deleteConfirmData.nama}</span> 
                dari mata kuliah <span className="text-white font-medium">{deleteConfirmData.matkul}</span>.
                Mahasiswa yang sudah enroll akan terlepas dari kelas ini.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeleteConfirmData(null)}
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
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === deleteConfirmData.id}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ 
                    backgroundColor: colors.danger, 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {deletingId === deleteConfirmData.id ? 'Menghapus...' : 'Hapus'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
