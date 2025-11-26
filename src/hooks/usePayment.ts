/**
 * Custom hooks for payment operations
 * Provides easy-to-use interface for components
 *
 * Hooks:
 * - useSTKPush: Initiate STK Push for bill payments
 */

import { useState, useCallback } from 'react';
import { paymentService } from '../services';
import type { ApiError } from '../services/api-client';
import type { StkPushRequest, StkPushResponse } from '../services';

/**
 * Hook for initiating STK Push
 * Used on: Create New Bill page
 *
 * Request body:
 * {
 *   "payments": [
 *     {
 *       "amount": 100,
 *       "phone_number": "254712345678"
 *     }
 *   ],
 *   "account_reference": "Invoice123",
 *   "transaction_desc": "Payment for goods"
 * }
 */
export const useSTKPush = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [response, setResponse] = useState<StkPushResponse | null>(null);

  const initiateSTKPush = useCallback(async (request: StkPushRequest) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await paymentService.initiateSTKPush(request);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResponse(null);
  }, []);

  return {
    initiateSTKPush,
    loading,
    error,
    response,
    reset,
  };
};
