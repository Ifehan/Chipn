import React from 'react'

// Mock user data for tests
const mockUser = {
  id: 'user-1',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone_number: '254712345678',
  id_type: 'national_id',
  role: 'user' as const,
}

// Mock AuthContext values
const mockAuthContextValue = {
  user: mockUser,
  loading: false,
  error: null,
  isAuthenticated: true,
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  refreshUser: vi.fn().mockResolvedValue(undefined),
}

// Mock AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// Mock useAuth hook
export const useAuth = vi.fn(() => mockAuthContextValue)

// Export mock values for test customization
export const mockAuthContext = mockAuthContextValue
export const setMockUser = (user: any) => {
  mockAuthContextValue.user = user
}
export const setMockLoading = (loading: boolean) => {
  mockAuthContextValue.loading = loading
}
export const setMockError = (error: string | null) => {
  ;(mockAuthContextValue as any).error = error
}
export const setMockAuthenticated = (isAuthenticated: boolean) => {
  mockAuthContextValue.isAuthenticated = isAuthenticated
}
