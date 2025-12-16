import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from '../Sidebar'
import '@testing-library/jest-dom'

describe('Sidebar', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  test('renders sidebar with branding', () => {
    renderWithRouter(<Sidebar />)
    expect(screen.getByText('TandaPay Admin')).toBeInTheDocument()
    expect(screen.getByText('Bill Splitting Dashboard')).toBeInTheDocument()
  })

  test('renders navigation links', () => {
    renderWithRouter(<Sidebar />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Vendors')).toBeInTheDocument()
    expect(screen.getByText('Transactions')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
  })

  test('Dashboard link has correct href', () => {
    renderWithRouter(<Sidebar />)
    const dashboardLink = screen.getAllByText('Dashboard')[0].closest('a')
    expect(dashboardLink).toHaveAttribute('href', '/admin')
  })

  test('Vendors link has correct href', () => {
    renderWithRouter(<Sidebar />)
    const vendorsLink = screen.getByText('Vendors').closest('a')
    expect(vendorsLink).toHaveAttribute('href', '/admin/vendors')
  })

  test('Transactions link has correct href', () => {
    renderWithRouter(<Sidebar />)
    const transactionsLink = screen.getByText('Transactions').closest('a')
    expect(transactionsLink).toHaveAttribute('href', '/admin/transactions')
  })

  test('User Management link has correct href', () => {
    renderWithRouter(<Sidebar />)
    const userManagementLink = screen.getByText('User Management').closest('a')
    expect(userManagementLink).toHaveAttribute('href', '/admin/users')
  })

  test('renders user profile section', () => {
    renderWithRouter(<Sidebar />)
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@tandapay.com')).toBeInTheDocument()
  })

  test('renders logout button', () => {
    renderWithRouter(<Sidebar />)
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    expect(logoutButton).toBeInTheDocument()
  })

  test('renders Avatar component', () => {
    renderWithRouter(<Sidebar />)
    // Avatar shows initials
    expect(screen.getByText('AU')).toBeInTheDocument()
  })
})
