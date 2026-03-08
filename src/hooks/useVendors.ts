import { useQuery } from '@tanstack/react-query'
import { vendorService } from '../services'
import type { Vendor } from '../services'

export const VENDORS_QUERY_KEY = ['vendors'] as const

export const useVendors = () => {
  const { data, isLoading, error, refetch } = useQuery<Vendor[]>({
    queryKey: VENDORS_QUERY_KEY,
    queryFn: () => vendorService.getVendors(),
  })

  return {
    vendors: data ?? [],
    loading: isLoading,
    error: error ?? null,
    refetch,
  }
}
