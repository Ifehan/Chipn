/**
 * Payment Service Tests
 * Tests for M-Pesa STK Push operations
 */

import { paymentService } from '../payment.service';
import { apiClient } from '../api-client';
import type { StkPushRequest, StkPushResponse } from '../types/payment.types';

// Mock the API client
jest.mock('../api-client');

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initiateSTKPush', () => {
    const mockRequest: StkPushRequest = {
      payments: [
        { amount: 100, phone_number: '254712345678' },
        { amount: 200, phone_number: '254798765432' },
      ],
      account_reference: 'Invoice123',
      transaction_desc: 'Payment for goods',
    };

    const mockResponse: StkPushResponse = {
      message: 'STK Push initiated successfully',
      checkout_request_id: 'ws_CO_123456789',
      merchant_request_id: 'mr_123456789',
      response_code: '0',
      response_description: 'Success',
      customer_message: 'Success. Request accepted for processing',
    };

    it('should successfully initiate STK Push', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await paymentService.initiateSTKPush(mockRequest);

      expect(apiClient.post).toHaveBeenCalledWith('/mpesa/stk-push', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockError = {
        message: 'Invalid phone number',
        status: 400,
        details: { error: 'Phone number format is invalid' },
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(paymentService.initiateSTKPush(mockRequest)).rejects.toEqual(
        mockError
      );
      expect(apiClient.post).toHaveBeenCalledWith('/mpesa/stk-push', mockRequest);
    });

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network error occurred',
        status: 0,
        details: new Error('Network failure'),
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(paymentService.initiateSTKPush(mockRequest)).rejects.toEqual(
        mockError
      );
    });

    it('should send correct payload with multiple payments', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await paymentService.initiateSTKPush(mockRequest);

      expect(apiClient.post).toHaveBeenCalledWith('/mpesa/stk-push', {
        payments: expect.arrayContaining([
          expect.objectContaining({
            amount: expect.any(Number),
            phone_number: expect.any(String),
          }),
        ]),
        account_reference: expect.any(String),
        transaction_desc: expect.any(String),
      });
    });

    it('should handle single payment', async () => {
      const singlePaymentRequest: StkPushRequest = {
        payments: [{ amount: 500, phone_number: '254712345678' }],
        account_reference: 'Bill-001',
        transaction_desc: 'Dinner payment',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await paymentService.initiateSTKPush(singlePaymentRequest);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/mpesa/stk-push',
        singlePaymentRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty transaction description', async () => {
      const requestWithEmptyDesc: StkPushRequest = {
        payments: [{ amount: 100, phone_number: '254712345678' }],
        account_reference: 'Invoice123',
        transaction_desc: '',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await paymentService.initiateSTKPush(requestWithEmptyDesc);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/mpesa/stk-push',
        requestWithEmptyDesc
      );
    });

    it('should handle large payment amounts', async () => {
      const largeAmountRequest: StkPushRequest = {
        payments: [{ amount: 999999.99, phone_number: '254712345678' }],
        account_reference: 'Large-Payment',
        transaction_desc: 'Large transaction',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await paymentService.initiateSTKPush(largeAmountRequest);

      expect(result).toEqual(mockResponse);
    });
  });
});
