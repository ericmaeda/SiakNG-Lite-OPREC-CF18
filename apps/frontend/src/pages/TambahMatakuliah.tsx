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
      // Auto-assign to currently logged in DOSEN
      const dosenId = user?.id || ''
      await api.createMataKuliah({ kode: formData.kode, nama: formData.nama, sks: formData.sks, semester: formData.semester, dosenId })
      navigate('/matakuliah', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan mata kuliah')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sks' || name === 'semester' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colors.secondary }}>
      <div className="max-w-2xl mx-auto">
        <Card style={{ backgroundColor: '#2A2A2A', border: 'none' }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold" style={{ color: colors.primary }}>
              Tambah Mata Kuliah Baru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500 text-red-400 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="kode" style={{ color: 'white' }}>Kode Mata Kuliah</Label>
                <Input
                  id="kode"
                  name="kode"
                  value={formData.kode}
                  onChange={handleChange}
                  placeholder=" Contoh: CS101"
                  required
                  style={{ 
                    backgroundColor: '#3A3A3A', 
                    borderColor: '#4A4A4A',
                    color: 'white'
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama" style={{ color: 'white' }}>Nama Mata Kuliah</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder=" Contoh: Algoritma & Struktur Data"
                  required
                  style={{ 
                    backgroundColor: '#3A3A3A', 
                    borderColor: '#4A4A4A',
                    color: 'white'
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  {isLoading ? 'Menyimpan...' : 'Simpan Mata Kuliah'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
