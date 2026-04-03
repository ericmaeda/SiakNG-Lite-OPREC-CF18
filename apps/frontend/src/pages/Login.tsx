import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { useAuth } from '../lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Color palette
const colors = {
  primary: '#FFD700',
  secondary: '#1A1A1A',
  tertiary: '#00F1FF',
  neutral: '#1A1A1A',
}

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
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
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: colors.primary }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.tertiary }} />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-15" style={{ backgroundColor: colors.tertiary }} />
        
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
            Sistem Informasi Akademik Modern untuk mengelola mata kuliah, nilai, dan jadwal perkuliahan dengan mudah dan efisien.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <span 
              className="px-5 py-2 rounded-full text-sm font-medium shadow-lg"
              style={{ backgroundColor: colors.tertiary, color: colors.secondary }}
            >
              Akademik Digital
            </span>
            <span 
              className="px-5 py-2 rounded-full text-sm font-medium shadow-lg"
              style={{ backgroundColor: colors.primary, color: colors.secondary }}
            >
              Modern & Cepat
            </span>
          </div>
        </div>
        
        {/* Bottom feature list */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-8 text-gray-400 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.tertiary }} />
            Kelola Mata Kuliah
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            Input Nilai
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.tertiary }} />
            Jadwal Kuliah
          </span>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
                Welcome Back
              </h2>
              <p className="text-gray-500 mt-2">
                Masuk untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@universitas.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-lg border-gray-200 focus:ring-2 focus:ring-offset-1"
                  style={{ '--tw-ring-color': colors.primary } as React.CSSProperties}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-lg border-gray-200"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-gray-500">Ingat saya</span>
                </label>
                <a href="#" className="hover:underline" style={{ color: colors.neutral }}>
                  Lupa password?
                </a>
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
                ) : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Belum punya akun?{' '}
                <Link 
                  to="/register" 
                  className="font-medium hover:underline transition-colors"
                  style={{ color: colors.tertiary }}
                >
                  Daftar Sekarang
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
