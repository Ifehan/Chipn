/**
 * Custom hook for vendor operations
 * Provides easy-to-use interface for fetching vendors
 */

import { useState, useEffect, useCallback } from 'react';
import { vendorService } from '../services';
import type { ApiError } from '../services/api-client';
import type { Vendor } from '../services';

/**
 * Hook for fetching vendors list
 * Used on: Create New Bill page
 *
 * Automatically fetches vendors on mount
 */
export const useVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await vendorService.getVendors();
      setVendors(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      // Don't throw the error, just set it in state
      console.error('Failed to fetch vendors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
  };
};
