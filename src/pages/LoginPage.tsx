import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { LoginForm } from '../components/molecules/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ApiError } from '../services/api-client'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')

    try {
      // Use AuthContext login which handles both authentication and user data fetching
      await login(email, password)
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
      title="Chipn"
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
