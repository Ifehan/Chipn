import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { usersService } from '../services/users.service'
import type { User } from '../services/types/user.types'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await usersService.getCurrentUser()
      setUser(userData)
    } catch (err: unknown) {
      const apiErr = err as { message?: string; status?: number }
      setError(apiErr.message || 'Failed to fetch user data')
      if (apiErr?.status === 401) {
        await authService.logout()
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * C-4: On app startup, silently attempt to refresh the access token using the
   * httpOnly cookie. This restores the session after a page refresh without
   * touching localStorage. If the cookie is expired or missing, user goes to login.
   */
  useEffect(() => {
    const initAuth = async () => {
      const newToken = await authService.refreshAccessToken()
      if (newToken) {
        await fetchCurrentUser()
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [fetchCurrentUser])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      await authService.login({ email, password })
      await fetchCurrentUser()
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setError(apiErr.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setError(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const refreshUser = async () => {
    await fetchCurrentUser()
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
