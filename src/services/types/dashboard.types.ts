/**
 * Dashboard-related type definitions
 * Based on API specification for /dashboard/ endpoints
 */

/**
 * Individual transaction in recent transactions response
 */
export interface DashboardTransaction {
  id: string;
  transaction_id: string;
  vendor_id: string;
  vendor_name: string;
  amount: number;
  status: string;
  created_at: string;
  phone_number: string;
  account_reference: string;
}

/**
 * Response body for GET /dashboard/recent-transactions
 */
export interface RecentTransactionsResponse {
  transactions: DashboardTransaction[];
  page: number;
  size: number;
  total: number;
  total_pages: number;
}
