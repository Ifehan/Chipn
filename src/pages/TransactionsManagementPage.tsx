import React, { useState, useEffect } from 'react';
import { TransactionsTable } from '../components/molecules/TransactionsTable';
import { Sidebar } from '../components/organisms/Sidebar'
import { StatCard } from '../components/atoms/StatCard'
import { DollarSign  } from 'lucide-react'


type Transaction = {
  id: string;
  vendor: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed' | string;
  time: string;
};

export function TransactionsManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching transactions
    const fetchTransactions = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/transactions');
        // const data = await response.json();

        // Mock data for demonstration
        const mockTransactions: Transaction[] = [
          {
            id: 'TXN001',
            vendor: 'Brian',
            amount: 'KES 29.99',
            status: 'Success',
            time: '2023-05-15 14:30'
          },
          {
            id: 'TXN002',
            vendor: 'Kevin',
            amount: 'KES 19.99',
            status: 'Pending',
            time: '2023-05-16 09:15'
          },
          {
            id: 'TXN003',
            vendor: 'Philip',
            amount: 'KES 49.99',
            status: 'Failed',
            time: '2023-05-14 16:45'
          },
          {
            id: 'TXN004',
            vendor: 'Stephen',
            amount: 'KES 15.99',
            status: 'Success',
            time: '2023-05-17 18:20'
          }
        ];

        setTransactions(mockTransactions);
        setLoading(false);
      } catch (_err) {
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  const stats = [
    { label: 'Total Transactions', amount: 'KES 1000', icon: <DollarSign size={18} className="text-slate-500" /> },
    { label: 'Current Transactions', amount: 'KES 50', icon: <DollarSign size={18} className="text-slate-500" /> },
    { label: 'Pending Transactions', amount: 'KES 100', icon: <DollarSign size={18} className="text-red-500" /> }
  ]


  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-full">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Transaction History</h1>
            <p className="text-sm text-slate-500">View all transactions in the system</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} amount={s.amount} icon={s.icon} />
            ))}
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-4">Transaction History</h2>
              <div className="overflow-x-auto">
                <TransactionsTable transactions={transactions} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TransactionsManagementPage;
