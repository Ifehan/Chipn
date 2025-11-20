import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { BackButton } from '../components/atoms/BackButton'

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

  const tabs: TabData[] = [
    { id: 'all', label: 'All', count: 0 },
    { id: 'pending', label: 'Pending', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
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
            placeholder="Search bills..."
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
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {getTabIcon(tab.id)}
              {tab.label}
              <span
                className={`flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[11px] font-semibold ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 py-16 px-6 mt-4">
          <div className="mb-3">
            <DollarSign size={72} className="text-gray-200" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1.5">No bills yet</h3>
          <p className="text-sm text-gray-500">
            Create your first bill to get started
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistoryPage
