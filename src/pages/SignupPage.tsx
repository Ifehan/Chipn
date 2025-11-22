import { useState } from 'react'
import { AuthCard } from '../components/organisms/AuthCard'
import { SignupForm, SignupData } from '../components/molecules/SignupForm'
import { useNavigate } from 'react-router-dom'
import { useCreateUser } from '../hooks/useUsers'

/**
 * Signup Page
 * Uses POST /users/ endpoint to create new user accounts
 * Route: /signup
 */
export function SignupPage() {
  const navigate = useNavigate()
  const { createUser, loading, error } = useCreateUser()
  const [apiError, setApiError] = useState<string>('')

  const handleSignup = async (data: SignupData) => {
    setApiError('')
    try {
      // Transform form data to match API request format
      const user = await createUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        id_type: data.idType,
        password: data.password,
      })

      console.log('User created successfully:', user)

      // Store user ID in localStorage for later use
      if (user.id) {
        localStorage.setItem('userId', user.id)
      }

      // Redirect to login page after successful signup
      navigate('/login')
    } catch (err: any) {
      console.error('Signup failed:', err)
      setApiError(err?.message || 'Failed to create account. Please try again.')
    }
  }

  return (
    <AuthCard
      title="TandaPay"
      subtitle="Split bills and pay instantly via M-PESA"
    >
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {apiError}
        </div>
      )}
      <SignupForm
        onSubmit={handleSignup}
        onBack={() => navigate('/')}
        isLoading={loading}
      />
    </AuthCard>
  )
}

export default SignupPage
