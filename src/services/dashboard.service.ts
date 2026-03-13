import { apiClient } from './api-client';
import type { RecentTransactionsResponse } from './types/dashboard.types';

// Function to get recent transactions with pagination
export const getRecentTransactions = async (page: number = 1, size: number = 5): Promise<RecentTransactionsResponse> => {
  // Build the URL with query parameters explicitly
  const url = `/dashboard/recent-transactions?page=${page}&size=${size}`;
  return apiClient.get<RecentTransactionsResponse>(url);
};

export const dashboardService = {
  getRecentTransactions,
};
