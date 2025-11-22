import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PasswordResetForm } from '../PasswordResetForm'

describe('PasswordResetForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form elements', () => {
    render(<PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument()
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument()
  })

  it('shows validation error when submitting empty email', async () => {
    render(<PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error for invalid email format', async () => {
    render(<PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send reset link/i })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with email when form is valid', async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('calls onBack when back button is clicked', () => {
    render(<PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const backButton = screen.getByRole('button', { name: /back to login/i })
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('displays loading state when isLoading is true', () => {
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={true}
      />
    )

    expect(screen.getByText(/sending/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  it('disables all inputs and buttons when loading', () => {
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={true}
      />
    )

    expect(screen.getByLabelText(/email address/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /back to login/i })).toBeDisabled()
  })

  it('displays external error message', () => {
    const errorMessage = 'Email not found'

    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        error={errorMessage}
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
  })

  it('shows success message when success is true', () => {
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        success={true}
      />
    )

    expect(screen.getByText(/check your email/i)).toBeInTheDocument()
    expect(screen.getByText(/password reset link has been sent/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument()

    // Form should not be visible
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /send reset link/i })).not.toBeInTheDocument()
  })

  it('calls onBack when back button is clicked in success state', () => {
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        success={true}
      />
    )

    const backButton = screen.getByRole('button', { name: /back to login/i })
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('clears internal error when submitting again', async () => {
    render(<PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)

    // First submission with empty email
    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument()
    })

    // Second submission with valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText(/please enter your email address/i)).not.toBeInTheDocument()
    })
  })

  it('shows spinner icon when loading', () => {
    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={true}
      />
    )

    const spinner = screen.getByRole('button', { name: /sending/i }).querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('prioritizes external error over internal error', async () => {
    const externalError = 'Server error'

    render(
      <PasswordResetForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        error={externalError}
      />
    )

    // Try to trigger internal error
    const submitButton = screen.getByRole('button', { name: /send reset link/i })
    fireEvent.click(submitButton)

    // External error should be displayed
    expect(screen.getByRole('alert')).toHaveTextContent(externalError)
  })

  it('validates email with various invalid formats', async () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      'user@example',
    ]

    for (const invalidEmail of invalidEmails) {
      const { unmount } = render(
        <PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      )

      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /send reset link/i })

      fireEvent.change(emailInput, { target: { value: invalidEmail } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
      unmount()
      jest.clearAllMocks()
    }
  })

  it('accepts valid email formats', async () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user123@test-domain.com',
    ]

    for (const validEmail of validEmails) {
      mockOnSubmit.mockResolvedValue(undefined)

      const { unmount } = render(
        <PasswordResetForm onSubmit={mockOnSubmit} onBack={mockOnBack} />
      )

      const emailInput = screen.getByLabelText(/email address/i)
      fireEvent.change(emailInput, { target: { value: validEmail } })

      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(validEmail)
      })

      unmount()
      jest.clearAllMocks()
    }
  })
})
