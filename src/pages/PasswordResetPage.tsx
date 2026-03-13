import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { PasswordResetForm } from '../components/molecules/PasswordResetForm'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { apiClient } from '../services/api-client'
import type { ApiError } from '../services/api-client'

export function PasswordResetPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const handleRequestReset = async (email: string) => {
    setIsLoading(true)
    setError('')
    try {
      await authService.requestPasswordReset({ email })
      setSuccess(true)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmReset = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await apiClient.post('/auth/password-reset/confirm', { token, new_password: newPassword })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Reset failed. The link may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  // Confirm mode — user arrived via reset link in email
  if (token) {
    return (
      <AuthCard title="Set New Password" subtitle="Enter your new password below">
        {success ? (
          <div className="text-center py-4">
            <p className="text-emerald-600 font-medium">Password reset successfully!</p>
            <p className="text-slate-500 text-sm mt-1">Redirecting to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleConfirmReset}
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Saving...' : 'Set New Password'}
            </button>
            <button
              onClick={() => navigate('/login')}
              type="button"
              className="w-full py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="We'll send you a link to reset your password"
    >
      <PasswordResetForm
        onSubmit={handleRequestReset}
        onBack={() => navigate('/login')}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </AuthCard>
  )
}

export default PasswordResetPage
