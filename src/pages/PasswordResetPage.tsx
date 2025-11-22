import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { PasswordResetForm } from '../components/molecules/PasswordResetForm'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { ApiError } from '../services/api-client'

export function PasswordResetPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePasswordReset = async (email: string) => {
    setIsLoading(true)
    setError('')

    try {
      await authService.requestPasswordReset({ email })
      setSuccess(true)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Failed to send reset link. Please try again.')
      console.error('Password reset failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/login')
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="We'll send you a link to reset your password"
    >
      <PasswordResetForm
        onSubmit={handlePasswordReset}
        onBack={handleBack}
        isLoading={isLoading}
        error={error}
        success={success}
      />
    </AuthCard>
  )
}

export default PasswordResetPage
