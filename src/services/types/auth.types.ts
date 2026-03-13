/**
 * Authentication-related type definitions
 *
 * Note: refresh_token is no longer in the JSON response.
 * It is set as an httpOnly cookie by the server on login/refresh.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}
