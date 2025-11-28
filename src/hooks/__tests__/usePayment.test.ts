/**
 * usePayment Hook Tests
 * Tests for payment-related custom hooks
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useSTKPush } from '../usePayment';
import { paymentService } from '../../services';
import type { StkPushRequest, StkPushResponse } from '../../services';

// Mock the payment service
jest.mock('../../services', () => ({
  paymentService: {
    initiateSTKPush: jest.fn(),
  },
}));

describe('useSTKPush', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRequest: StkPushRequest = {
    payments: [
      { amount: 100, phone_number: '254712345678' },
      { amount: 200, phone_number: '254798765432' },
    ],
    account_reference: 'Invoice123',
    transaction_desc: 'Payment for goods',
    vendor_id: 'vendor-123',
  };

  const mockResponse: StkPushResponse = {
    message: 'STK Push initiated successfully',
    checkout_request_id: 'ws_CO_123456789',
    merchant_request_id: 'mr_123456789',
    response_code: '0',
    response_description: 'Success',
    customer_message: 'Success. Request accepted for processing',
  };

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSTKPush());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.response).toBeNull();
    expect(typeof result.current.initiateSTKPush).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('should successfully initiate STK Push', async () => {
    (paymentService.initiateSTKPush as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSTKPush());

    let returnedResponse: StkPushResponse | undefined;

    await act(async () => {
      returnedResponse = await result.current.initiateSTKPush(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(paymentService.initiateSTKPush).toHaveBeenCalledWith(mockRequest);
    expect(result.current.response).toEqual(mockResponse);
    expect(returnedResponse).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('should set loading state during API call', async () => {
    (paymentService.initiateSTKPush as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    const { result } = renderHook(() => useSTKPush());

    act(() => {
      result.current.initiateSTKPush(mockRequest);
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle API errors', async () => {
    const mockError = {
      message: 'Invalid phone number',
      status: 400,
      details: { error: 'Phone number format is invalid' },
    };

    (paymentService.initiateSTKPush as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSTKPush());

    await act(async () => {
      try {
        await result.current.initiateSTKPush(mockRequest);
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.response).toBeNull();
  });

  it('should reset error and response states', async () => {
    (paymentService.initiateSTKPush as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSTKPush());

    // First, make a successful call
    await act(async () => {
      await result.current.initiateSTKPush(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.response).toEqual(mockResponse);
    });

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.response).toBeNull();
  });

  it('should handle multiple consecutive calls', async () => {
    (paymentService.initiateSTKPush as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSTKPush());

    // First call
    await act(async () => {
      await result.current.initiateSTKPush(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.response).toEqual(mockResponse);
    });

    // Second call
    const secondRequest: StkPushRequest = {
      ...mockRequest,
      account_reference: 'Invoice456',
    };

    await act(async () => {
      await result.current.initiateSTKPush(secondRequest);
    });

    await waitFor(() => {
      expect(paymentService.initiateSTKPush).toHaveBeenCalledTimes(2);
    });

    expect(paymentService.initiateSTKPush).toHaveBeenLastCalledWith(secondRequest);
  });

  it('should clear previous error on new request', async () => {
    const mockError = {
      message: 'Network error',
      status: 0,
      details: {},
    };

    // First call fails
    (paymentService.initiateSTKPush as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSTKPush());

    await act(async () => {
      try {
        await result.current.initiateSTKPush(mockRequest);
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    // Second call succeeds
    (paymentService.initiateSTKPush as jest.Mock).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await result.current.initiateSTKPush(mockRequest);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.response).toEqual(mockResponse);
    });
  });

  it('should handle network timeout errors', async () => {
    const timeoutError = {
      message: 'Network error occurred',
      status: 0,
      details: new Error('Request timeout'),
    };

    (paymentService.initiateSTKPush as jest.Mock).mockRejectedValue(timeoutError);

    const { result } = renderHook(() => useSTKPush());

    await act(async () => {
      try {
        await result.current.initiateSTKPush(mockRequest);
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(timeoutError);
      expect(result.current.loading).toBe(false);
    });
  });
});
