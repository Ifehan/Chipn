import React, { useState } from 'react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void
  onBack?: () => void
}

export function LoginForm({ onSubmit, onBack }: LoginFormProps) {
  const [email, setEmail] = useState('test@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    onSubmit?.(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon="📧"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showPasswordToggle
        icon="🔒"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button variant="primary" fullWidth type="submit">
        Sign In
      </Button>
      <Button variant="outline" fullWidth onClick={onBack} type="button">
        Back
      </Button>
    </form>
  )
}

export default LoginForm
