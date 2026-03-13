import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminDashboard } from '../AdminDashboard'
import '@testing-library/jest-dom'

// Mock hooks that hit the API
vi.mock('../../hooks/useVendors', () => ({
  useVendors: () => ({ vendors: [], loading: false, error: null }),
}))
vi.mock('../../hooks/useTransactionHistory', () => ({
  useTransactionHistory: () => ({
    transactions: [],
    total: 0,
    isLoading: false,
    error: null,
  }),
}))
vi.mock('../../hooks/useUsers', () => ({
  useCurrentUser: () => ({
    data: { first_name: 'Admin', last_name: 'User', role: 'admin' },
    isLoading: false,
  }),
}))

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('AdminDashboard', () => {
  test('renders dashboard heading', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
  })

  test('renders stat card labels', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText('Total Vendors')).toBeInTheDocument()
    expect(screen.getByText('Transactions Today')).toBeInTheDocument()
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
  })

  test('renders transaction volume section', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText('Transaction Volume (Last 7 Days)')).toBeInTheDocument()
  })

  test('renders recent transactions section', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  test('renders View All link', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText(/View All/i)).toBeInTheDocument()
  })

  test('renders transaction table headers', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText('TRANSACTION ID')).toBeInTheDocument()
    expect(screen.getByText('VENDOR')).toBeInTheDocument()
    expect(screen.getByText('AMOUNT')).toBeInTheDocument()
    expect(screen.getByText('STATUS')).toBeInTheDocument()
    expect(screen.getByText('TIME')).toBeInTheDocument()
  })

  test('renders Sidebar component', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByText('Chipn Admin')).toBeInTheDocument()
    expect(screen.getByText('Bill Splitting Dashboard')).toBeInTheDocument()
  })
})
