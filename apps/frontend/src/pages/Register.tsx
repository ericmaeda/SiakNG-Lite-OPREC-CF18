import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { api } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UserRole } from '@siakng/types'

// Color palette
const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  neutral: '#1A1A1A',
}

export function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    role: 'MAHASISWA' as UserRole,
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await api.register(formData)
      
      if (response.user) {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative overflow-hidden"
        style={{ backgroundColor: colors.secondary }}
      >
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: colors.tertiary }} />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.primary }} />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full opacity-15" style={{ backgroundColor: colors.primary }} />
        
        <div className="relative z-10 text-center">
          <h1 
            className="text-6xl font-bold mb-6 tracking-tight"
            style={{ color: colors.primary }}
          >
            SIAKNG
          </h1>
          <h2 className="text-3xl font-semibold mb-4 text-white">
            Lite
          </h2>
          <p className="text-lg text-gray-300 text-center max-w-md px-8 mb-8 leading-relaxed">
            Bergabunglah dengan ribuan mahasiswa dan dosen dalam sistem akademik digital yang modern dan efisien.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <span 
              className="px-5 py-2 rounded-full text-sm font-medium shadow-lg"
              style={{ backgroundColor: colors.primary, color: colors.secondary }}
            >
              Gratis Terdaftar
            </span>
            <span 
              className="px-5 py-2 rounded-full text-sm font-medium shadow-lg"
              style={{ backgroundColor: colors.tertiary, color: colors.secondary }}
            >
              Akses Penuh
            </span>
          </div>
        </div>
        
        {/* Bottom feature list */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 text-gray-400 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            100% Online
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.tertiary }} />
            Data Aman
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            Realtime
          </span>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold" style={{ color: colors.primary }}>
              SIAKNG Lite
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 
                className="text-2xl font-bold"
                style={{ color: colors.secondary }}
              >
                Buat Akun
              </h2>
              <p className="text-gray-500 mt-2">
                Daftar untuk memulai
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="John Doe"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-lg border-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@universitas.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-lg border-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-lg border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Daftar Sebagai
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex h-12 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                >
                  <option value="MAHASISWA">Mahasiswa</option>
                  <option value="DOSEN">Dosen</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                disabled={isLoading}
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.secondary,
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : 'Daftar Sekarang'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Sudah punya akun?{' '}
                <Link 
                  to="/login" 
                  className="font-medium hover:underline transition-colors"
                  style={{ color: colors.tertiary }}
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            © 2026 SIAKNG Lite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
