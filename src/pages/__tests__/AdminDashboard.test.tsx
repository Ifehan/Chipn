import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AdminDashboard } from '../AdminDashboard'
import '@testing-library/jest-dom'

describe('AdminDashboard', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  test('renders dashboard heading', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
  })

  test('renders welcome message', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('Welcome back, Admin User!')).toBeInTheDocument()
  })

  test('renders stat cards with correct labels', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('Total Vendors')).toBeInTheDocument()
    expect(screen.getByText('Transactions Today')).toBeInTheDocument()
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
  })

  test('renders stat card values', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('KES 835,100')).toBeInTheDocument()
  })

  test('renders transaction volume section', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('Transaction Volume (Last 7 Days)')).toBeInTheDocument()
  })

  test('renders recent transactions section', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
  })

  test('renders View All link for transactions', () => {
    renderWithRouter(<AdminDashboard />)
    const viewAllLink = screen.getByText(/View All/i)
    expect(viewAllLink).toBeInTheDocument()
  })

  test('renders transaction table with correct headers', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('TRANSACTION ID')).toBeInTheDocument()
    expect(screen.getByText('VENDOR')).toBeInTheDocument()
    expect(screen.getByText('AMOUNT')).toBeInTheDocument()
    expect(screen.getByText('STATUS')).toBeInTheDocument()
    expect(screen.getByText('TIME')).toBeInTheDocument()
  })

  test('renders sample transactions', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('TXN001')).toBeInTheDocument()
    expect(screen.getByText('Java House')).toBeInTheDocument()
    expect(screen.getByText('KES 1,500')).toBeInTheDocument()
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  test('renders Sidebar component', () => {
    renderWithRouter(<AdminDashboard />)
    expect(screen.getByText('TandaPay Admin')).toBeInTheDocument()
    expect(screen.getByText('Bill Splitting Dashboard')).toBeInTheDocument()
  })
})
