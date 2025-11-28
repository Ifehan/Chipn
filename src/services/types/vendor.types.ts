/**
 * Vendor-related type definitions
 * Based on API specification for /vendors/ endpoints
 */

/**
 * Vendor entity
 * Response from GET /vendors/
 */
export interface Vendor {
  id: string;
  name: string;
  paybill_number: string;
  created_at: string;
  updated_at: string;
}

/**
 * Response body for GET /vendors/
 */
export type VendorsListResponse = Vendor[];
