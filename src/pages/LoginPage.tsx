import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { LoginForm } from '../components/molecules/LoginForm'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import type { ApiError } from '../services/api-client'

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')

    try {
      await authService.login({ email, password })
      navigate('/home')
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Login failed. Please try again.')
      console.error('Login failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    navigate('/password-reset')
  }

  return (
    <AuthCard
      title="TandaPay"
      subtitle="Split bills and pay instantly via M-PESA"
    >
      <LoginForm
        onSubmit={handleLogin}
        onBack={() => navigate('/')}
        onForgotPassword={handleForgotPassword}
        isLoading={isLoading}
        error={error}
      />
    </AuthCard>
  )
}

export default LoginPage
