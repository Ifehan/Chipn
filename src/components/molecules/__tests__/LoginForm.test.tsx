import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnBack = jest.fn()
  const mockOnForgotPassword = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form elements', () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('renders forgot password link when provided', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        onForgotPassword={mockOnForgotPassword}
      />
    )

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  it('does not render forgot password link when not provided', () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument()
  })

  it('shows validation error when submitting empty form', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    // Clear the default email value
    fireEvent.change(emailInput, { target: { value: '' } })
    fireEvent.change(passwordInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when email is empty', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: '' } })

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows validation error when password is empty', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with email and password when form is valid', async () => {
    mockOnSubmit.mockResolvedValue(undefined)

    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('calls onBack when back button is clicked', () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('calls onForgotPassword when forgot password link is clicked', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        onForgotPassword={mockOnForgotPassword}
      />
    )

    const forgotPasswordLink = screen.getByText(/forgot password/i)
    fireEvent.click(forgotPasswordLink)

    expect(mockOnForgotPassword).toHaveBeenCalledTimes(1)
  })

  it('displays loading state when isLoading is true', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={true}
      />
    )

    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('disables all inputs and buttons when loading', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        onForgotPassword={mockOnForgotPassword}
        isLoading={true}
      />
    )

    expect(screen.getByLabelText(/email address/i)).toBeDisabled()
    expect(screen.getByLabelText(/password/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
    expect(screen.getByText(/forgot password/i)).toBeDisabled()
  })

  it('displays external error message', () => {
    const errorMessage = 'Invalid credentials'

    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        error={errorMessage}
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
  })

  it('clears internal error when submitting again', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} onBack={mockOnBack} />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    // First submission with empty fields
    fireEvent.change(emailInput, { target: { value: '' } })
    fireEvent.change(passwordInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    })

    // Second submission with valid fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.queryByText(/please fill in all fields/i)).not.toBeInTheDocument()
    })
  })

  it('shows spinner icon when loading', () => {
    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={true}
      />
    )

    const spinner = screen.getByRole('button', { name: /signing in/i }).querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('prioritizes external error over internal error', async () => {
    const externalError = 'Server error'

    render(
      <LoginForm
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        error={externalError}
      />
    )

    // Try to trigger internal error
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(emailInput, { target: { value: '' } })
    fireEvent.change(passwordInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    // External error should be displayed
    expect(screen.getByRole('alert')).toHaveTextContent(externalError)
  })
})
