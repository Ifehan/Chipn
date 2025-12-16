import React from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { StatCard } from '../components/atoms/StatCard'
import { TransactionsTable } from '../components/molecules/TransactionsTable'
import { Users, BarChart2, DollarSign } from 'lucide-react'

export function AdminDashboard() {
  const stats = [
    { label: 'Total Vendors', amount: '4', icon: <Users size={18} className="text-slate-500" /> },
    { label: 'Transactions Today', amount: '0', icon: <BarChart2 size={18} className="text-slate-500" /> },
    { label: 'Total Revenue', amount: 'KES 835,100', icon: <DollarSign size={18} className="text-slate-500" /> },
  ]

  const transactions = [
    { id: 'TXN001', vendor: 'Java House', amount: 'KES 1,500', status: 'Success', time: '29/11/2025, 10:30:00' },
    { id: 'TXN002', vendor: 'Kenyan Bites', amount: 'KES 2,200', status: 'Pending', time: '29/11/2025, 11:00:00' },
    { id: 'TXN003', vendor: 'Mama Deli', amount: 'KES 750', status: 'Failed', time: '29/11/2025, 12:15:00' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-full">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
            <p className="text-sm text-slate-500">Welcome back, Admin User!</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} amount={s.amount} icon={s.icon} />
            ))}
          </section>

          <section className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-sm font-medium text-slate-800 mb-4">Transaction Volume (Last 7 Days)</h2>
              <div className="h-52 rounded border border-dashed border-slate-200 bg-gradient-to-b from-white to-slate-50 flex items-center justify-center text-slate-400">
                {/* Placeholder chart area - replace with chart library if available */}
                <div>No chart library configured. Placeholder.</div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-800">Recent Transactions</h3>
                <a className="text-sm text-indigo-600 hover:underline" href="#">View All →</a>
              </div>
              <TransactionsTable transactions={transactions} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
