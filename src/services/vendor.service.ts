/**
 * Vendor Service
 * Handles vendor-related operations
 */

import { apiClient } from './api-client';
import type { VendorsListResponse } from './types/vendor.types';

/**
 * Get list of all vendors
 * GET /vendors/
 *
 * @returns Promise with list of vendors
 *
 * Example usage:
 * ```typescript
 * const vendors = await vendorService.getVendors();
 * ```
 */
export const getVendors = async (): Promise<VendorsListResponse> => {
  return apiClient.get<VendorsListResponse>('/vendors/');
};

export const vendorService = {
  getVendors,
};
