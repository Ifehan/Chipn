import React, { useState, useEffect } from 'react';
import { TransactionsTable } from '../components/molecules/TransactionsTable';
import { Sidebar } from '../components/organisms/Sidebar'
import { StatCard } from '../components/atoms/StatCard'
import { DollarSign } from 'lucide-react'
import { dashboardService } from '../services/dashboard.service';
import { logger } from '../services'
import type { DashboardTransaction, RecentTransactionsResponse } from '../services/types/dashboard.types';

type Transaction = {
  id: string;
  vendor: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed' | string;
  time: string;
};

export function TransactionsManagementPage() {
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const stats = [
    { label: 'Total Transactions', amount: 'KES 1000', icon: <DollarSign size={18} className="text-slate-500" /> },
    { label: 'Current Transactions', amount: 'KES 50', icon: <DollarSign size={18} className="text-slate-500" /> },
    { label: 'Pending Transactions', amount: 'KES 100', icon: <DollarSign size={18} className="text-red-500" /> }
  ];

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setLoading(true);
        const response: RecentTransactionsResponse = await dashboardService.getRecentTransactions(page, size);
        setTransactions(response.transactions);
        setTotalPages(response.total_pages);
        setTotalItems(response.total);
      } catch (err) {
        logger.error('Error fetching recent transactions:', err, 'TransactionsManagementPage');
        setError('Failed to fetch recent transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTransactions();
  }, [page, size]);

  // Transform the API response to match the expected format for TransactionsTable
  const transformedTransactions = transactions.map(tx => {
    // Format the date to match the expected format in TransactionsTable
    const formattedDate = new Date(tx.created_at).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return {
      id: tx.transaction_id,
      vendor: tx.vendor_name,
      amount: `KES ${tx.amount.toLocaleString()}`,
      status: tx.status,
      time: formattedDate
    };
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1); // Reset to first page when size changes
  };

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
                <TransactionsTable
                  transactions={transformedTransactions}
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  onSizeChange={handleSizeChange}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TransactionsManagementPage;
