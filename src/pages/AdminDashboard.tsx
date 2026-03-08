import React, { useMemo } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { StatCard } from '../components/atoms/StatCard'
import { TransactionsTable } from '../components/molecules/TransactionsTable'
import { Users, BarChart2, DollarSign } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useVendors } from '../hooks/useVendors'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import type { Transaction } from '../services/types/payment.types'

function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`
}

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
  })
}

function buildChartData(transactions: Transaction[]) {
  const days = getLast7Days()
  const counts: Record<string, number> = Object.fromEntries(days.map((d) => [d, 0]))

  transactions.forEach((tx) => {
    const dateStr = tx.transaction_date ?? tx.created_at
    const d = new Date(dateStr)
    const label = d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
    if (label in counts) counts[label]++
  })

  return days.map((day) => ({ day, count: counts[day] }))
}

function toTableRow(tx: Transaction) {
  return {
    id: tx.id.slice(0, 8).toUpperCase(),
    vendor: tx.account_reference,
    amount: formatKES(tx.amount),
    status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
    time: new Date(tx.created_at).toLocaleString('en-KE'),
  }
}

export function AdminDashboard() {
  const { vendors, loading: vendorsLoading } = useVendors()
  const { transactions, isLoading: txLoading } = useTransactionHistory()

  const totalRevenue = useMemo(
    () => transactions.filter((tx) => tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0),
    [transactions]
  )

  const transactionsToday = useMemo(
    () => transactions.filter((tx) => isToday(tx.transaction_date ?? tx.created_at)).length,
    [transactions]
  )

  const chartData = useMemo(() => buildChartData(transactions), [transactions])

  const recentRows = useMemo(
    () => transactions.slice(0, 5).map(toTableRow),
    [transactions]
  )

  const stats = [
    {
      label: 'Total Vendors',
      amount: vendorsLoading ? '…' : String(vendors.length),
      icon: <Users size={18} className="text-slate-500" />,
    },
    {
      label: 'Transactions Today',
      amount: txLoading ? '…' : String(transactionsToday),
      icon: <BarChart2 size={18} className="text-slate-500" />,
    },
    {
      label: 'Total Revenue',
      amount: txLoading ? '…' : formatKES(totalRevenue),
      icon: <DollarSign size={18} className="text-slate-500" />,
    },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-full">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
            <p className="text-sm text-slate-500">Welcome back, Admin!</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} amount={s.amount} icon={s.icon} />
            ))}
          </section>

          <section className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-sm font-medium text-slate-800 mb-4">
                Transaction Volume (Last 7 Days)
              </h2>
              {txLoading ? (
                <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
                  Loading chart…
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={208}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                      formatter={(v: number) => [v, 'Transactions']}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#txGradient)"
                      dot={{ r: 3, fill: '#6366f1' }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-800">Recent Transactions</h3>
                <a className="text-sm text-indigo-600 hover:underline" href="/admin/transactions">
                  View All →
                </a>
              </div>
              {txLoading ? (
                <p className="text-sm text-slate-400 py-4 text-center">Loading transactions…</p>
              ) : (
                <TransactionsTable transactions={recentRows} />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
