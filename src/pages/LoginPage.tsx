import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { LoginForm } from '../components/molecules/LoginForm'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual login logic
      console.log('Logging in:', { email, password })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Set authentication flag
      sessionStorage.setItem('isAuthenticated', 'true')
      navigate('/home')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="TandaPay"
      subtitle="Split bills and pay instantly via M-PESA"
    >
      <LoginForm
        onSubmit={handleLogin}
        onBack={() => navigate('/')}
      />
    </AuthCard>
  )
}


export default LoginPage
