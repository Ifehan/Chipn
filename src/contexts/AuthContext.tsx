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
  logout: () => void
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

  /**
   * Fetch current user data from /users/me
   * This is called once after login or on app initialization if token exists
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await usersService.getCurrentUser()
      setUser(userData)
    } catch (err: any) {
      console.error('Failed to fetch user:', err)
      setError(err.message || 'Failed to fetch user data')

      // If unauthorized, clear auth state
      if (err?.status === 401) {
        authService.logout()
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Initialize auth state on mount
   * Check if token exists and fetch user data
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getAccessToken()
      const isAuth = authService.isAuthenticated()

      if (token && isAuth) {
        await fetchCurrentUser()
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [fetchCurrentUser])

  /**
   * Login handler
   * Performs login and fetches user data
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // Perform login
      await authService.login({ email, password })

      // Fetch user data after successful login
      await fetchCurrentUser()
    } catch (err: any) {
      console.error('Login failed:', err)
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logout handler
   * Clears auth state and redirects to login
   */
  const logout = () => {
    authService.logout()
    setUser(null)
    setError(null)
    navigate('/login', { replace: true })
  }

  /**
   * Refresh user data
   * Can be called manually if user data needs to be updated
   */
  const refreshUser = async () => {
    await fetchCurrentUser()
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user && authService.isAuthenticated(),
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
