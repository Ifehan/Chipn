import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { SignupForm, SignupData } from '../components/molecules/SignupForm'
import { useNavigate } from 'react-router-dom'

export function SignupPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual signup logic
      console.log('Signing up:', data)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // navigate('/dashboard')
    } catch (error) {
      console.error('Signup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="TandaPay"
      subtitle="Split bills and pay instantly via M-PESA"
    >
      <SignupForm
        onSubmit={handleSignup}
        onBack={() => navigate('/')}
      />
    </AuthCard>
  )
}

export default SignupPage
