import React from 'react'
import { render, screen } from '@testing-library/react'
import { TransactionsTable } from '../TransactionsTable'
import '@testing-library/jest-dom'

describe('TransactionsTable', () => {
  const mockTransactions = [
    {
      id: 'TXN001',
      vendor: 'Java House',
      amount: 'KES 1,500',
      status: 'Success',
      time: '29/11/2025, 10:30:00'
    },
    {
      id: 'TXN002',
      vendor: 'Kenyan Bites',
      amount: 'KES 2,200',
      status: 'Pending',
      time: '29/11/2025, 11:00:00'
    },
    {
      id: 'TXN003',
      vendor: 'Mama Deli',
      amount: 'KES 750',
      status: 'Failed',
      time: '29/11/2025, 12:15:00'
    }
  ]

  test('renders table headers', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    expect(screen.getByText('TRANSACTION ID')).toBeInTheDocument()
    expect(screen.getByText('VENDOR')).toBeInTheDocument()
    expect(screen.getByText('AMOUNT')).toBeInTheDocument()
    expect(screen.getByText('STATUS')).toBeInTheDocument()
    expect(screen.getByText('TIME')).toBeInTheDocument()
  })

  test('renders all transaction rows', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    expect(screen.getByText('TXN001')).toBeInTheDocument()
    expect(screen.getByText('TXN002')).toBeInTheDocument()
    expect(screen.getByText('TXN003')).toBeInTheDocument()
  })

  test('renders transaction data correctly', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    expect(screen.getByText('Java House')).toBeInTheDocument()
    expect(screen.getByText('Kenyan Bites')).toBeInTheDocument()
    expect(screen.getByText('Mama Deli')).toBeInTheDocument()
    expect(screen.getByText('KES 1,500')).toBeInTheDocument()
    expect(screen.getByText('KES 2,200')).toBeInTheDocument()
    expect(screen.getByText('KES 750')).toBeInTheDocument()
  })

  test('renders status badges', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  test('applies correct status styles', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    const successBadge = screen.getByText('Success').closest('span')
    const pendingBadge = screen.getByText('Pending').closest('span')
    const failedBadge = screen.getByText('Failed').closest('span')

    expect(successBadge).toHaveClass('bg-green-100')
    expect(pendingBadge).toHaveClass('bg-yellow-100')
    expect(failedBadge).toHaveClass('bg-red-100')
  })

  test('renders empty table when no transactions', () => {
    const { container } = render(<TransactionsTable transactions={[]} />)
    const tbody = container.querySelector('tbody')
    expect(tbody?.children.length).toBe(0)
  })

  test('renders timestamps', () => {
    render(<TransactionsTable transactions={mockTransactions} />)
    expect(screen.getByText('29/11/2025, 10:30:00')).toBeInTheDocument()
    expect(screen.getByText('29/11/2025, 11:00:00')).toBeInTheDocument()
    expect(screen.getByText('29/11/2025, 12:15:00')).toBeInTheDocument()
  })
})
