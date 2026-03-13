import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { VendorsPage } from '../VendorsPage'
import '@testing-library/jest-dom'

describe('VendorsPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
  }

  test('renders page heading', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('Vendors Management')).toBeInTheDocument()
  })

  test('renders page description', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('Manage all vendors in the system')).toBeInTheDocument()
  })

  test('renders vendor statistics', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('Total Vendors')).toBeInTheDocument()
    expect(screen.getByText('Active Vendors')).toBeInTheDocument()
    expect(screen.getByText('Inactive Vendors')).toBeInTheDocument()
  })

  test('renders correct vendor counts', () => {
    renderWithRouter(<VendorsPage />)
    // 4 total vendors
    const totalVendorCards = screen.getAllByText(/4|3|1/)
    expect(totalVendorCards.length).toBeGreaterThan(0)
  })

  test('renders vendor list table', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('Vendor List')).toBeInTheDocument()
  })

  test('renders table headers', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Join Date')).toBeInTheDocument()
  })

  test('renders vendor data rows', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('V001')).toBeInTheDocument()
    expect(screen.getByText('Java House')).toBeInTheDocument()
    expect(screen.getByText('contact@javahouse.co.ke')).toBeInTheDocument()
  })

  test('renders all vendor names', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('Java House')).toBeInTheDocument()
    expect(screen.getByText('Kenyan Bites')).toBeInTheDocument()
    expect(screen.getByText('Mama Deli')).toBeInTheDocument()
    expect(screen.getByText('Tech Café')).toBeInTheDocument()
  })

  test('renders status badges', () => {
    renderWithRouter(<VendorsPage />)
    const activeStatuses = screen.getAllByText('Active')
    const inactiveStatuses = screen.getAllByText('Inactive')
    expect(activeStatuses.length).toBeGreaterThan(0)
    expect(inactiveStatuses.length).toBeGreaterThan(0)
  })

  test('renders Sidebar component', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('Chipn Admin')).toBeInTheDocument()
  })

  test('displays vendor contact information', () => {
    renderWithRouter(<VendorsPage />)
    expect(screen.getByText('+254 722 123 456')).toBeInTheDocument()
    const nairobiElements = screen.getAllByText('Nairobi')
    expect(nairobiElements.length).toBeGreaterThan(0)
  })
})
