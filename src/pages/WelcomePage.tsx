import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/organisms/AuthCard'
import { Button } from '../components/atoms/Button'

export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <AuthCard
      title="Chipn"
      subtitle="Split bills and pay instantly via M-PESA"
    >
      <div className="space-y-4">
        <p className="text-center text-gray-600 text-sm">
          Welcome to Chipn! Split bills and get paid instantly via M-PESA.
        </p>
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate('/signup')}
        >
          Create New Account
        </Button>
        <Button
          variant="outline"
          fullWidth
          onClick={() => navigate('/login')}
        >
          Sign In to Existing Account
        </Button>
      </div>
    </AuthCard>
  )
}

export default WelcomePage
