/**
 * Payment Service
 * Handles M-Pesa STK Push operations
 */

import { apiClient } from './api-client';
import type { StkPushRequest, StkPushResponse } from './types/payment.types';

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

export const paymentService = {
  initiateSTKPush,
};
