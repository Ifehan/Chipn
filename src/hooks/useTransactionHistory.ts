import { useQuery } from '@tanstack/react-query'
import { paymentService } from '../services/payment.service'
import type { TransactionHistoryParams, TransactionHistoryResponse } from '../services/types/payment.types'

export const TRANSACTIONS_QUERY_KEY = (params?: TransactionHistoryParams) =>
  ['transactions', params ?? {}] as const

export const useTransactionHistory = (params?: TransactionHistoryParams) => {
  const { data, isLoading, error, refetch } = useQuery<TransactionHistoryResponse>({
    queryKey: TRANSACTIONS_QUERY_KEY(params),
    queryFn: () => paymentService.getTransactionHistory(params),
  })

  return {
    transactions: data?.transactions ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    pageSize: data?.page_size ?? 50,
    statusFilter: data?.status_filter ?? 'all',
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch transactions') : null,
    refetch,
  }
}
