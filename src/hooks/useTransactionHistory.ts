/**
 * Custom hook for fetching and managing transaction history
 */

import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/payment.service';
import type {
  Transaction,
  TransactionHistoryParams,
  TransactionHistoryResponse
} from '../services/types/payment.types';

interface UseTransactionHistoryResult {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  statusFilter: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage transaction history
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Transaction history data and loading state
 *
 * Example usage:
 * ```typescript
 * const { transactions, isLoading, error, refetch } = useTransactionHistory({
 *   status: 'pending',
 *   page: 1,
 *   page_size: 20
 * });
 * ```
 */
export const useTransactionHistory = (
  params?: TransactionHistoryParams
): UseTransactionHistoryResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stringify params for stable dependency
  const paramsKey = JSON.stringify(params);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response: TransactionHistoryResponse = await paymentService.getTransactionHistory(params);

      setTransactions(response.transactions);
      setTotal(response.total);
      setPage(response.page);
      setPageSize(response.page_size);
      setStatusFilter(response.status_filter);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transaction history';
      setError(errorMessage);
      console.error('Error fetching transaction history:', err);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    total,
    page,
    pageSize,
    statusFilter,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
};
