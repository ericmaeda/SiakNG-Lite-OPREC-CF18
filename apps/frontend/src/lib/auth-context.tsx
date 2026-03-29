import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, type LoginResponse } from './api'
import type { User, UserRole } from '@siakng/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = api.getCurrentUser()
    if (storedUser && api.isAuthenticated()) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    
    // Store user info from response or create from login data
    if (response.user) {
      const userData: User = {
        id: response.user.id,
        name: response.user.nama,
        email: response.user.email,
        role: response.user.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      api.setCurrentUser(userData)
      setUser(userData)
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}