import React, { useState } from 'react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'

interface SignupFormProps {
  onSubmit?: (data: SignupData) => void
  onBack?: () => void
}

export interface SignupData {
  fullName: string
  email: string
  phone: string
  password: string
}

export function SignupForm({ onSubmit, onBack }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupData>({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        icon="👤"
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        name="email"
        value={formData.email}
        onChange={handleChange}
        helpText="Used for account login and notifications"
        icon="📧"
      />
      <Input
        label="M-PESA Phone Number"
        placeholder="0712345678 or +254712345678"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        helpText="Must be registered with M-PESA for payments"
        icon="📱"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create a secure password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        showPasswordToggle
        helpText="Must be at least 6 characters"
        icon="🔒"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button variant="primary" fullWidth type="submit">
        Create Account
      </Button>
      <Button variant="outline" fullWidth onClick={onBack} type="button">
        Back
      </Button>
    </form>
  )
}

export default SignupForm
