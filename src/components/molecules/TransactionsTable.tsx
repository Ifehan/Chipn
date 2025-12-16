import React from 'react'

type Tx = {
  id: string
  vendor: string
  amount: string
  status: 'Success' | 'Pending' | 'Failed' | string
  time: string
}

export function TransactionsTable({ transactions }: { transactions: Tx[] }) {
  const statusClass = (s: string) => {
    if (s.toLowerCase() === 'success') return 'bg-green-100 text-green-700'
    if (s.toLowerCase() === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (s.toLowerCase() === 'failed') return 'bg-red-100 text-red-700'
    return 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-xs text-slate-500 text-left border-b">
            <th className="py-2 pr-4">TRANSACTION ID</th>
            <th className="py-2 pr-4">VENDOR</th>
            <th className="py-2 pr-4">AMOUNT</th>
            <th className="py-2 pr-4">STATUS</th>
            <th className="py-2 pr-4">TIME</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="text-sm text-slate-700 border-b last:border-b-0">
              <td className="py-3 pr-4 font-medium">{t.id}</td>
              <td className="py-3 pr-4">{t.vendor}</td>
              <td className="py-3 pr-4">{t.amount}</td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(t.status)}`}>{t.status}</span>
              </td>
              <td className="py-3 pr-4 text-sm text-slate-500">{t.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionsTable
