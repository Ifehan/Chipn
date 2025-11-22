import React, { useState } from 'react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'

interface SignupFormProps {
  onSubmit?: (data: SignupData) => void
  onBack?: () => void
  isLoading?: boolean
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  idType: string
  password: string
}

export function SignupForm({ onSubmit, onBack, isLoading = false }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    idType: 'national_id',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.idType || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="First Name"
        placeholder="Enter your first name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        icon="👤"
      />
      <Input
        label="Last Name"
        placeholder="Enter your last name"
        name="lastName"
        value={formData.lastName}
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
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        helpText="Must be registered with M-PESA for payments"
        icon="📱"
      />
      <div className="space-y-2">
        <label htmlFor="idType" className="block text-sm font-medium text-slate-700">
          ID Type
        </label>
        <select
          id="idType"
          name="idType"
          value={formData.idType}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-slate-900"
        >
          <option value="national_id">National ID</option>
          <option value="passport">Passport</option>
          <option value="drivers_license">Driver's License</option>
        </select>
      </div>
      <Input
        label="Password"
        type="password"
        placeholder="Create a secure password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        showPasswordToggle
        helpText="Must be at least 8 characters"
        icon="🔒"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button variant="primary" fullWidth type="submit" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </Button>
      <Button variant="outline" fullWidth onClick={onBack} type="button" disabled={isLoading}>
        Back
      </Button>
    </form>
  )
}

export default SignupForm
