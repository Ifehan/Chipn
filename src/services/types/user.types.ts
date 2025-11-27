/**
 * User-related type definitions
 * Based on API specification for /users/ endpoints
 */

/**
 * User entity returned by API
 * Used in responses from all user endpoints
 */
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_type: string;
  created_at?: string;
  updated_at?: string;
  pending_transactions_total?: number;
  completed_transactions_total?: number;
}

/**
 * Request body for POST /users/ (signup)
 * Used on: Signup page
 */
export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_type: string;
  password: string;
}

/**
 * Request body for PUT /users/{user_id}
 * Used on: Profile settings page
 */
export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  id_type?: string;
}
