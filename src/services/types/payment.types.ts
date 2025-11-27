/**
 * Payment-related type definitions
 * Based on API specification for /mpesa/ endpoints
 */

/**
 * Individual payment in STK Push request
 */
export interface Payment {
  amount: number;
  phone_number: string;
}

/**
 * Request body for POST /mpesa/stk-push
 * Used on: Create New Bill page
 */
export interface StkPushRequest {
  payments: Payment[];
  account_reference: string;
  transaction_desc: string;
}

/**
 * Response body for POST /mpesa/stk-push
 */
export interface StkPushResponse {
  message: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  response_code?: string;
  response_description?: string;
  customer_message?: string;
}

/**
 * Transaction status type
 */
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Individual transaction in transaction history
 */
export interface Transaction {
  id: string;
  merchant_request_id: string;
  checkout_request_id: string;
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
  mpesa_receipt_number: string | null;
  transaction_date: string | null;
  status: string;
  callback_url: string | null;
  callback_received: string | null;
  result_code: string | null;
  result_desc: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Query parameters for GET /mpesa/transactions
 */
export interface TransactionHistoryParams {
  status?: 'pending' | 'completed' | 'all';
  page?: number;
  page_size?: number;
}

/**
 * Response body for GET /mpesa/transactions
 */
export interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  page_size: number;
  status_filter: string;
}
