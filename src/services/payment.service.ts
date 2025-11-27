/**
 * Payment Service
 * Handles M-Pesa STK Push operations and transaction history
 */

import { apiClient } from './api-client';
import type {
  StkPushRequest,
  StkPushResponse,
  TransactionHistoryParams,
  TransactionHistoryResponse
} from './types/payment.types';

/**
 * Initiate STK Push for multiple payments
 * POST /mpesa/stk-push
 *
 * @param request - STK Push request containing payments array, account reference, and description
 * @returns Promise with STK Push response
 *
 * Example usage:
 * ```typescript
 * const response = await paymentService.initiateSTKPush({
 *   payments: [
 *     { amount: 100, phone_number: "254712345678" },
 *     { amount: 200, phone_number: "254798765432" }
 *   ],
 *   account_reference: "Invoice123",
 *   transaction_desc: "Payment for goods"
 * });
 * ```
 */
export const initiateSTKPush = async (
  request: StkPushRequest
): Promise<StkPushResponse> => {
  return apiClient.post<StkPushResponse>('/mpesa/stk-push', request);
};

/**
 * Get transaction history for the authenticated user
 * GET /mpesa/transactions
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with transaction history response
 *
 * Example usage:
 * ```typescript
 * // Get all transactions
 * const response = await paymentService.getTransactionHistory({ status: 'all' });
 *
 * // Get pending transactions with pagination
 * const response = await paymentService.getTransactionHistory({
 *   status: 'pending',
 *   page: 1,
 *   page_size: 20
 * });
 *
 * // Get completed transactions
 * const response = await paymentService.getTransactionHistory({ status: 'completed' });
 * ```
 */
export const getTransactionHistory = async (
  params?: TransactionHistoryParams
): Promise<TransactionHistoryResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.status) {
    queryParams.append('status', params.status);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.page_size) {
    queryParams.append('page_size', params.page_size.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/mpesa/transactions?${queryString}` : '/mpesa/transactions';

  return apiClient.get<TransactionHistoryResponse>(url);
};

export const paymentService = {
  initiateSTKPush,
  getTransactionHistory,
};
