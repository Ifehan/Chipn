import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { BackButton } from '../components/atoms/BackButton'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import type { Transaction } from '../services/types/payment.types'

type TabType = 'all' | 'pending' | 'completed'

interface TabData {
  id: TabType
  label: string
  count: number
}

export function TransactionHistoryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const { transactions, total, isLoading, error } = useTransactionHistory({
    status: activeTab,
    page: currentPage,
    page_size: pageSize,
  })

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase()
    return (
      transaction.account_reference.toLowerCase().includes(query) ||
      transaction.phone_number.includes(query) ||
      transaction.mpesa_receipt_number?.toLowerCase().includes(query) ||
      transaction.transaction_desc.toLowerCase().includes(query)
    )
  })

  // Calculate counts for tabs
  const allCount = activeTab === 'all' ? total : 0
  const pendingCount = activeTab === 'pending' ? total : 0
  const completedCount = activeTab === 'completed' ? total : 0

  const tabs: TabData[] = [
    { id: 'all', label: 'All', count: allCount },
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'completed', label: 'Completed', count: completedCount },
  ]

  const getTabIcon = (tabId: TabType) => {
    switch (tabId) {
      case 'pending':
        return <Clock size={14} />
      case 'completed':
        return <CheckCircle size={14} />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower === 'completed' || statusLower === 'success') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle size={12} />
          Completed
        </span>
      )
    }

    if (statusLower === 'pending' || statusLower === 'processing') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Clock size={12} />
          Pending
        </span>
      )
    }

    if (statusLower === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle size={12} />
          Failed
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <AlertCircle size={12} />
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount)
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const totalPages = Math.ceil(total / pageSize)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="app-shell bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-gray-100">
        <BackButton onClick={() => navigate(-1)} />
        <h1 className="text-lg font-semibold text-gray-900">Transaction History</h1>
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2.5 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {getTabIcon(tab.id)}
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[11px] font-semibold ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center bg-white rounded-2xl border border-gray-100 py-16 px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-sm text-gray-500">Loading transactions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-red-100 py-16 px-6">
            <XCircle size={48} className="text-red-500 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">Error Loading Transactions</h3>
            <p className="text-sm text-gray-500 text-center">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 py-16 px-6 mt-4">
            <div className="mb-3">
              <DollarSign size={72} className="text-gray-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">
              {searchQuery ? 'No matching transactions' : 'No transactions yet'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Your transaction history will appear here'}
            </p>
          </div>
        )}

        {/* Transaction List */}
        {!isLoading && !error && filteredTransactions.length > 0 && (
          <div className="space-y-3">
            {filteredTransactions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {transaction.account_reference}
                    </h3>
                    <p className="text-xs text-gray-500">{transaction.transaction_desc}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-gray-900">
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{transaction.phone_number}</span>
                  <span>{formatDate(transaction.transaction_date || transaction.created_at)}</span>
                </div>

                <div className="flex items-center justify-between">
                  {getStatusBadge(transaction.status)}
                  {transaction.mpesa_receipt_number && (
                    <span className="text-xs text-gray-500">
                      Receipt: {transaction.mpesa_receipt_number}
                    </span>
                  )}
                </div>

                {transaction.error_message && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">{transaction.error_message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredTransactions.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistoryPage
