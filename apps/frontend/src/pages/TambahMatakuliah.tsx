import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../lib/auth-context'
import { api } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
}

export function TambahMatakuliah() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    sks: 1,
    semester: 1,
  })

  // Kelas form data
  const [kelasData, setKelasData] = useState({
    nama: 'A',
    quota: 30,
    hari: 'Senin',
    jamMulai: '08:00',
    jamSelesai: '10:00',
    ruangan: '',
  })

  // Redirect if not DOSEN or ADMIN
  if (user?.role !== 'DOSEN' && user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const dosenId = user?.id || ''
      
      // 1. Create mata kuliah first
      const matakuliah = await api.createMataKuliah({ 
        kode: formData.kode, 
        nama: formData.nama, 
        sks: formData.sks, 
        semester: formData.semester, 
        dosenId 
      })
      
      // 2. Automatically create kelas with schedule
      if (matakuliah?.id) {
        await api.createKelas({
          mataKuliahId: matakuliah.id,
          nama: kelasData.nama,
          quota: kelasData.quota,
          hari: kelasData.hari,
          jamMulai: kelasData.jamMulai,
          jamSelesai: kelasData.jamSelesai,
          ruangan: kelasData.ruangan || undefined,
        })
      }
      
      navigate('/matakuliah', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan mata kuliah')
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-calculate jamSelesai based on SKS (1 SKS = 50 menit)
  const calculateJamSelesai = (jamMulai: string, sks: number) => {
    const [hours, minutes] = jamMulai.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + (sks * 50)
    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMinutes = totalMinutes % 60
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'sks') {
      const newSks = parseInt(value) || 1
      const newJamSelesai = calculateJamSelesai(kelasData.jamMulai, newSks)
      setFormData(prev => ({ ...prev, sks: newSks }))
      setKelasData(prev => ({ ...prev, jamSelesai: newJamSelesai }))
    } else if (name === 'semester') {
      setFormData(prev => ({ ...prev, semester: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleKelasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'jamMulai') {
      const newJamSelesai = calculateJamSelesai(value, formData.sks)
      setKelasData(prev => ({ ...prev, jamMulai: value, jamSelesai: newJamSelesai }))
    } else if (name === 'quota') {
      setKelasData(prev => ({ ...prev, quota: parseInt(value) || 30 }))
    } else {
      setKelasData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
      <div className="max-w-2xl mx-auto">
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ color: colors.primary }}>
              Tambah Mata Kuliah & Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500 text-red-400 rounded">
                  {error}
                </div>
              )}

              {/* Mata Kuliah Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.primary }}>
                  Data Mata Kuliah
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="kode" style={{ color: 'white' }}>Kode Mata Kuliah</Label>
                  <Input
                    id="kode"
                    name="kode"
                    value={formData.kode}
                    onChange={handleChange}
                    placeholder="Contoh: CS101"
                    required
                    style={{ 
                      backgroundColor: '#3A3A3A', 
                      borderColor: '#4A4A4A',
                      color: 'white'
                    }}
                  />
                </div>

                <div className="space-y-2 mt-3">
                  <Label htmlFor="nama" style={{ color: 'white' }}>Nama Mata Kuliah</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Contoh: Algoritma & Struktur Data"
                    required
                    style={{ 
                      backgroundColor: '#3A3A3A', 
                      borderColor: '#4A4A4A',
                      color: 'white'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <Label htmlFor="sks" style={{ color: 'white' }}>Jumlah SKS</Label>
                    <Input
                      id="sks"
                      name="sks"
                      type="number"
                      min="1"
                      max="6"
                      value={formData.sks}
                      onChange={handleChange}
                      required
                      style={{ 
                        backgroundColor: '#3A3A3A', 
                        borderColor: '#4A4A4A',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester" style={{ color: 'white' }}>Semester</Label>
                    <Input
                      id="semester"
                      name="semester"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.semester}
                      onChange={handleChange}
                      required
                      style={{ 
                        backgroundColor: '#3A3A3A', 
                        borderColor: '#4A4A4A',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Kelas Section */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A', border: `1px solid ${colors.tertiary}` }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: colors.tertiary }}>
                  Jadwal Kelas
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="kelasNama" style={{ color: 'white' }}>Nama Kelas</Label>
                    <Input
                      id="kelasNama"
                      name="nama"
                      value={kelasData.nama}
                      onChange={handleKelasChange}
                      placeholder="A"
                      style={{ 
                        backgroundColor: '#4A4A4A', 
                        borderColor: '#5A5A5A',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="quota" style={{ color: 'white' }}>Kuota</Label>
                    <Input
                      id="quota"
                      name="quota"
                      type="number"
                      min="1"
                      value={kelasData.quota}
                      onChange={handleKelasChange}
                      style={{ 
                        backgroundColor: '#4A4A4A', 
                        borderColor: '#5A5A5A',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <Label htmlFor="hari" style={{ color: 'white' }}>Hari</Label>
                  <select
                    id="hari"
                    name="hari"
                    value={kelasData.hari}
                    onChange={handleKelasChange}
                    className="w-full p-2 rounded"
                    style={{ 
                      backgroundColor: '#4A4A4A', 
                      borderColor: '#5A5A5A',
                      color: 'white'
                    }}
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1">
                    <Label htmlFor="jamMulai" style={{ color: 'white' }}>Jam Mulai</Label>
                    <Input
                      id="jamMulai"
                      name="jamMulai"
                      type="time"
                      value={kelasData.jamMulai}
                      onChange={handleKelasChange}
                      style={{ 
                        backgroundColor: '#4A4A4A', 
                        borderColor: '#5A5A5A',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="jamSelesai" style={{ color: 'white' }}>Jam Selesai</Label>
                    <Input
                      id="jamSelesai"
                      name="jamSelesai"
                      type="time"
                      value={kelasData.jamSelesai}
                      onChange={handleKelasChange}
                      style={{ 
                        backgroundColor: '#4A4A4A', 
                        borderColor: '#5A5A5A',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <Label htmlFor="ruangan" style={{ color: 'white' }}>Ruangan</Label>
                  <Input
                    id="ruangan"
                    name="ruangan"
                    value={kelasData.ruangan}
                    onChange={handleKelasChange}
                    placeholder="Ruang 101"
                    style={{ 
                      backgroundColor: '#4A4A4A', 
                      borderColor: '#5A5A5A',
                      color: 'white'
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#3A3A3A', border: '1px solid #4A4A4A' }}>
                <p className="text-sm" style={{ color: colors.tertiary }}>
                  ✓ Mata kuliah ini akan diampu oleh Anda:
                </p>
                <p className="font-medium text-lg" style={{ color: 'white' }}>
                  {user?.name || 'Tidak ada'}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => navigate('/matakuliah')}
                  className="flex-1 py-6 rounded-lg font-semibold"
                  style={{ 
                    backgroundColor: '#4A4A4A', 
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-6 rounded-lg font-semibold"
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: colors.secondary,
                    border: 'none'
                  }}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan & Buat Kelas'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}