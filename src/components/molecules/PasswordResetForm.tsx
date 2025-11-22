import React, { useState } from 'react'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'

interface PasswordResetFormProps {
  onSubmit?: (email: string) => Promise<void>
  onBack?: () => void
  isLoading?: boolean
  error?: string
  success?: boolean
}

export function PasswordResetForm({
  onSubmit,
  onBack,
  isLoading = false,
  error: externalError,
  success = false
}: PasswordResetFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (onSubmit) {
      await onSubmit(email)
    }
  }

  const displayError = externalError || error

  if (success) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Check Your Email
              </h3>
              <p className="text-sm text-green-700">
                Password reset link has been sent to your email. Please check your inbox and follow the instructions.
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          fullWidth
          onClick={onBack}
          type="button"
        >
          Back to Login
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon="📧"
        disabled={isLoading}
      />
      {displayError && (
        <p className="text-red-500 text-sm" role="alert">
          {displayError}
        </p>
      )}
      <Button
        variant="primary"
        fullWidth
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Reset Link'
        )}
      </Button>
      <Button
        variant="outline"
        fullWidth
        onClick={onBack}
        type="button"
        disabled={isLoading}
      >
        Back to Login
      </Button>
    </form>
  )
}

export default PasswordResetForm
