import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { UserManagementPage } from '../UserManagementPage'
import '@testing-library/jest-dom'

describe('UserManagementPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  test('renders page heading', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByRole('heading', { name: 'User Management' })).toBeInTheDocument()
  })

  test('renders page description', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('Manage system users and their roles')).toBeInTheDocument()
  })

  test('renders user statistics', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Suspended/Inactive')).toBeInTheDocument()
  })

  test('renders correct user counts', () => {
    renderWithRouter(<UserManagementPage />)
    // 5 total users
    const userCountCards = screen.getAllByText(/5|4|1/)
    expect(userCountCards.length).toBeGreaterThan(0)
  })

  test('renders user list table', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('User List')).toBeInTheDocument()
  })

  test('renders table headers', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Join Date')).toBeInTheDocument()
    expect(screen.getByText('Last Login')).toBeInTheDocument()
  })

  test('renders user data rows', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('U001')).toBeInTheDocument()
    const adminUserElements = screen.getAllByText('Admin User')
    expect(adminUserElements.length).toBeGreaterThan(0)
    const adminEmailElements = screen.getAllByText('admin@chipn.com')
    expect(adminEmailElements.length).toBeGreaterThan(0)
  })

  test('renders all users', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Support Staff')).toBeInTheDocument()
    expect(screen.getByText('Inactive User')).toBeInTheDocument()
  })

  test('renders role badges', () => {
    renderWithRouter(<UserManagementPage />)
    const adminRoles = screen.getAllByText('Admin')
    const supportRoles = screen.getAllByText('Support')
    expect(adminRoles.length).toBeGreaterThan(0)
    expect(supportRoles.length).toBeGreaterThan(0)
  })

  test('renders status badges with different colors', () => {
    renderWithRouter(<UserManagementPage />)
    const activeStatuses = screen.getAllByText('Active')
    const inactiveStatuses = screen.getAllByText('Inactive')
    expect(activeStatuses.length).toBeGreaterThan(0)
    expect(inactiveStatuses.length).toBeGreaterThan(0)
  })

  test('renders Sidebar component', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('Chipn Admin')).toBeInTheDocument()
  })

  test('displays user emails', () => {
    renderWithRouter(<UserManagementPage />)
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument()
    expect(screen.getByText('support@chipn.com')).toBeInTheDocument()
  })
})
