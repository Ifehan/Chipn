/**
 * Authentication-related type definitions
 * Based on API specification for /auth/ endpoints
 */

/**
 * Request body for POST /auth/login
 * Used on: Login page
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response body for POST /auth/login and POST /auth/refresh
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

/**
 * Request body for POST /auth/logout
 */
export interface LogoutRequest {
  refresh_token: string;
}

/**
 * Request body for POST /auth/password-reset/request
 * Used on: Password reset page
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Response body for POST /auth/password-reset/request
 */
export interface PasswordResetResponse {
  message: string;
}
