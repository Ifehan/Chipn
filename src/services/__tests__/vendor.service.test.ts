/**
 * Vendor Service Tests
 * Tests for vendor-related operations
 */

import { vendorService } from '../vendor.service';
import { apiClient } from '../api-client';
import type { Vendor } from '../types/vendor.types';

// Mock the API client
vi.mock('../api-client');

describe('VendorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getVendors', () => {
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

    it('should successfully fetch vendors list', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockVendors);

      const result = await vendorService.getVendors();

      expect(apiClient.get).toHaveBeenCalledWith('/vendors/');
      expect(result).toEqual(mockVendors);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no vendors exist', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const result = await vendorService.getVendors();

      expect(apiClient.get).toHaveBeenCalledWith('/vendors/');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      const mockError = {
        message: 'Failed to fetch vendors',
        status: 500,
        details: { error: 'Internal server error' },
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(vendorService.getVendors()).rejects.toEqual(mockError);
      expect(apiClient.get).toHaveBeenCalledWith('/vendors/');
    });

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network error occurred',
        status: 0,
        details: new Error('Network failure'),
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(vendorService.getVendors()).rejects.toEqual(mockError);
    });

    it('should handle unauthorized errors', async () => {
      const mockError = {
        message: 'Unauthorized',
        status: 401,
        details: { error: 'Invalid or expired token' },
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(vendorService.getVendors()).rejects.toEqual(mockError);
    });

    it('should return vendors with correct structure', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockVendors);

      const result = await vendorService.getVendors();

      result.forEach((vendor) => {
        expect(vendor).toHaveProperty('id');
        expect(vendor).toHaveProperty('name');
        expect(vendor).toHaveProperty('paybill_number');
        expect(vendor).toHaveProperty('created_at');
        expect(vendor).toHaveProperty('updated_at');
        expect(typeof vendor.id).toBe('string');
        expect(typeof vendor.name).toBe('string');
        expect(typeof vendor.paybill_number).toBe('string');
      });
    });
  });
});
