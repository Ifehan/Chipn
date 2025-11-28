/**
 * useVendors Hook Tests
 * Tests for vendor-related custom hooks
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useVendors } from '../useVendors';
import { vendorService } from '../../services';
import type { Vendor } from '../../services';

// Mock the vendor service
jest.mock('../../services', () => ({
  vendorService: {
    getVendors: jest.fn(),
  },
}));

describe('useVendors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockVendors: Vendor[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Safaricom',
      paybill_number: '123456',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Kenya Power',
      paybill_number: '888880',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  it('should initialize with correct default values', async () => {
    (vendorService.getVendors as jest.Mock).mockResolvedValue(mockVendors);

    const { result } = renderHook(() => useVendors());

    expect(result.current.vendors).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refetch).toBe('function');

    // Wait for the effect to complete to avoid act warnings
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should fetch vendors on mount', async () => {
    (vendorService.getVendors as jest.Mock).mockResolvedValue(mockVendors);

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(vendorService.getVendors).toHaveBeenCalledTimes(1);
    expect(result.current.vendors).toEqual(mockVendors);
    expect(result.current.error).toBeNull();
  });

  it('should set loading state during API call', async () => {
    (vendorService.getVendors as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockVendors), 100))
    );

    const { result } = renderHook(() => useVendors());

    // Check initial loading state
    expect(result.current.loading).toBe(true);

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify final state
    expect(result.current.vendors).toEqual(mockVendors);
  });

  it('should handle API errors', async () => {
    const mockError = {
      message: 'Failed to fetch vendors',
      status: 500,
      details: { error: 'Internal server error' },
    };

    (vendorService.getVendors as jest.Mock).mockRejectedValue(mockError);

    // Suppress console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.vendors).toEqual([]);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should handle empty vendors list', async () => {
    (vendorService.getVendors as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vendors).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should refetch vendors when refetch is called', async () => {
    (vendorService.getVendors as jest.Mock).mockResolvedValue(mockVendors);

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(vendorService.getVendors).toHaveBeenCalledTimes(1);

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(vendorService.getVendors).toHaveBeenCalledTimes(2);
    });

    expect(result.current.vendors).toEqual(mockVendors);
  });

  it('should clear previous error on refetch', async () => {
    const mockError = {
      message: 'Network error',
      status: 0,
      details: {},
    };

    // Suppress console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // First call fails
    (vendorService.getVendors as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    // Second call succeeds
    (vendorService.getVendors as jest.Mock).mockResolvedValueOnce(mockVendors);

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.vendors).toEqual(mockVendors);
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should handle network timeout errors', async () => {
    const timeoutError = {
      message: 'Network error occurred',
      status: 0,
      details: new Error('Request timeout'),
    };

    (vendorService.getVendors as jest.Mock).mockRejectedValue(timeoutError);

    // Suppress console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.error).toEqual(timeoutError);
      expect(result.current.loading).toBe(false);
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should handle unauthorized errors', async () => {
    const unauthorizedError = {
      message: 'Unauthorized',
      status: 401,
      details: { error: 'Invalid or expired token' },
    };

    (vendorService.getVendors as jest.Mock).mockRejectedValue(unauthorizedError);

    // Suppress console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.error).toEqual(unauthorizedError);
      expect(result.current.loading).toBe(false);
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should return vendors with correct structure', async () => {
    (vendorService.getVendors as jest.Mock).mockResolvedValue(mockVendors);

    const { result } = renderHook(() => useVendors());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.vendors.forEach((vendor) => {
      expect(vendor).toHaveProperty('id');
      expect(vendor).toHaveProperty('name');
      expect(vendor).toHaveProperty('paybill_number');
      expect(vendor).toHaveProperty('created_at');
      expect(vendor).toHaveProperty('updated_at');
    });
  });
});
