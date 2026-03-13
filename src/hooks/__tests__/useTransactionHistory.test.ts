import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransactionHistory } from '../useTransactionHistory';
import type { TransactionHistoryResponse } from '../../services/types/payment.types';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

// Mock the api-client to avoid import.meta issues
vi.mock('../../services/api-client');

// Mock the payment service
vi.mock('../../services/payment.service', () => ({
  paymentService: {
    initiateSTKPush: vi.fn(),
    getTransactionHistory: vi.fn(),
  },
}));

import { paymentService } from '../../services/payment.service';

const mockPaymentService = vi.mocked(paymentService);

describe('useTransactionHistory', () => {
  const mockTransactionResponse: TransactionHistoryResponse = {
    transactions: [
      {
        id: '1',
        merchant_request_id: 'merchant_123',
        checkout_request_id: 'checkout_123',
        phone_number: '254712345678',
        amount: 1000,
        account_reference: 'INV001',
        transaction_desc: 'Payment for goods',
        mpesa_receipt_number: 'ABC123XYZ',
        transaction_date: '2025-11-27T10:00:00Z',
        status: 'completed',
        callback_url: null,
        callback_received: '2025-11-27T10:01:00Z',
        result_code: '0',
        result_desc: 'Success',
        error_message: null,
        created_at: '2025-11-27T09:59:00Z',
        updated_at: '2025-11-27T10:01:00Z',
        user_id: 'user_123',
      },
      {
        id: '2',
        merchant_request_id: 'merchant_456',
        checkout_request_id: 'checkout_456',
        phone_number: '254798765432',
        amount: 500,
        account_reference: 'INV002',
        transaction_desc: 'Service payment',
        mpesa_receipt_number: null,
        transaction_date: null,
        status: 'pending',
        callback_url: null,
        callback_received: null,
        result_code: null,
        result_desc: null,
        error_message: null,
        created_at: '2025-11-27T11:00:00Z',
        updated_at: '2025-11-27T11:00:00Z',
        user_id: 'user_123',
      },
    ],
    total: 2,
    page: 1,
    page_size: 50,
    status_filter: 'all',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch transactions successfully', async () => {
    mockPaymentService.getTransactionHistory.mockResolvedValue(mockTransactionResponse);

    const { result } = renderHook(() => useTransactionHistory(), { wrapper: createWrapper() });

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions).toEqual(mockTransactionResponse.transactions);
    expect(result.current.total).toBe(2);
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(50);
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.error).toBeNull();
  });

  it('should fetch transactions with custom parameters', async () => {
    const pendingResponse = {
      transactions: [mockTransactionResponse.transactions[1]],
      total: 1,
      page: 1,
      page_size: 20,
      status_filter: 'pending',
    };

    mockPaymentService.getTransactionHistory.mockResolvedValue(pendingResponse);

    const params = {
      status: 'pending' as const,
      page: 1,
      page_size: 20,
    };

    const { result } = renderHook(() => useTransactionHistory(params), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockPaymentService.getTransactionHistory).toHaveBeenCalledWith(params);
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe('2');
    expect(result.current.statusFilter).toBe('pending');
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Network error';
    mockPaymentService.getTransactionHistory.mockRejectedValue(new Error(errorMessage));

    // Suppress console.error for this test since we're intentionally testing error handling
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useTransactionHistory(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.transactions).toEqual([]);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should refetch transactions when refetch is called', async () => {
    mockPaymentService.getTransactionHistory.mockResolvedValue(mockTransactionResponse);

    const { result } = renderHook(() => useTransactionHistory(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockPaymentService.getTransactionHistory).toHaveBeenCalledTimes(1);

    // Call refetch wrapped in act
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(mockPaymentService.getTransactionHistory).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle empty transaction list', async () => {
    mockPaymentService.getTransactionHistory.mockResolvedValue({
      transactions: [],
      total: 0,
      page: 1,
      page_size: 50,
      status_filter: 'all',
    });

    const { result } = renderHook(() => useTransactionHistory(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.error).toBeNull();
  });
});
