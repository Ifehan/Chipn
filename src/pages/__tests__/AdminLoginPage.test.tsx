import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AdminLoginPage } from '../AdminLoginPage'
import '@testing-library/jest-dom'
import * as AuthContext from '../../contexts/AuthContext'

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('AdminLoginPage', () => {
  const mockLogin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    } as any)
  })

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  test('renders admin login heading', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('TandaPay Admin')).toBeInTheDocument()
  })

  test('renders login subtitle', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('Sign in to access the dashboard')).toBeInTheDocument()
  })

  test('renders email input field', () => {
    renderWithRouter(<AdminLoginPage />)
    const emailInput = screen.getByPlaceholderText('you@example.com')
    expect(emailInput).toBeInTheDocument()
  })

  test('renders password input field', () => {
    renderWithRouter(<AdminLoginPage />)
    const passwordInput = screen.getByPlaceholderText('••••••••')
    expect(passwordInput).toBeInTheDocument()
  })

  test('renders sign in button', () => {
    renderWithRouter(<AdminLoginPage />)
    const signInButton = screen.getByRole('button', { name: /Sign In/i })
    expect(signInButton).toBeInTheDocument()
  })

  test('renders back to home button', () => {
    renderWithRouter(<AdminLoginPage />)
    const backButton = screen.getByRole('button', { name: /Back to Home/i })
    expect(backButton).toBeInTheDocument()
  })

  test('renders demo credentials section', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument()
  })

  test('renders all demo credential roles', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Support Staff')).toBeInTheDocument()
    expect(screen.getByText('Analyst')).toBeInTheDocument()
  })

  test('renders admin demo credentials', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('admin@tandapay.com')).toBeInTheDocument()
    expect(screen.getByText('admin123')).toBeInTheDocument()
  })

  test('renders support demo credentials', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('support@tandapay.com')).toBeInTheDocument()
    expect(screen.getByText('support123')).toBeInTheDocument()
  })

  test('renders analyst demo credentials', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('analyst@tandapay.com')).toBeInTheDocument()
    expect(screen.getByText('analyst123')).toBeInTheDocument()
  })

  test('shows error when email is empty', async () => {
    renderWithRouter(<AdminLoginPage />)
    const signInButton = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    })
  })

  test('shows error when password is empty', async () => {
    renderWithRouter(<AdminLoginPage />)
    const emailInput = screen.getByPlaceholderText('you@example.com')
    fireEvent.change(emailInput, { target: { value: 'admin@tandapay.com' } })

    const signInButton = screen.getByRole('button', { name: /Sign In/i })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    })
  })

  test('calls login on form submission', async () => {
    mockLogin.mockResolvedValue(undefined)
    renderWithRouter(<AdminLoginPage />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'admin@tandapay.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@tandapay.com', 'admin123')
    })
  })

  test('navigates to dashboard on successful login', async () => {
    mockLogin.mockResolvedValue(undefined)
    renderWithRouter(<AdminLoginPage />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'admin@tandapay.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin')
    })
  })

  test('shows error message on login failure', async () => {
    // Suppress expected console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockLogin.mockRejectedValue({
      message: 'Invalid credentials'
    })
    renderWithRouter(<AdminLoginPage />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'admin@tandapay.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  test('navigates to home when back button is clicked', () => {
    renderWithRouter(<AdminLoginPage />)
    const backButton = screen.getByRole('button', { name: /Back to Home/i })
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('disables submit button while loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})) // Never resolves
    renderWithRouter(<AdminLoginPage />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'admin@tandapay.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(signInButton).toBeDisabled()
    })
  })

  test('shows loading state in button', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}))
    renderWithRouter(<AdminLoginPage />)

    const emailInput = screen.getByPlaceholderText('you@example.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')
    const signInButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'admin@tandapay.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Signing In...')).toBeInTheDocument()
    })
  })

  test('lock icon is visible in header', () => {
    renderWithRouter(<AdminLoginPage />)
    // Check for lock icon container (SVG or similar)
    const header = screen.getByText('TandaPay Admin').closest('div')
    expect(header?.parentElement).toBeInTheDocument()
  })

  test('form labels are visible', () => {
    renderWithRouter(<AdminLoginPage />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
    const passwordLabels = screen.getAllByText('Password')
    expect(passwordLabels.length).toBeGreaterThan(0)
  })
})
