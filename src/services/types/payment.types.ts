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
