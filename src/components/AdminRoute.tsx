import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ADMIN_ROLES = ['admin', 'support', 'analyst'] as const

interface AdminRouteProps {
  children: React.ReactNode
}

/**
 * AdminRoute guards routes that require an administrative role.
 * Unauthenticated users are sent to /login.
 * Authenticated users without an admin role are sent back to /home.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.role || !(ADMIN_ROLES as readonly string[]).includes(user.role)) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
