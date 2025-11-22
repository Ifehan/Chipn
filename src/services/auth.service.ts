/**
 * Authentication Service
 * Handles all authentication-related API operations
 * Base URL: http://localhost:8000 (configurable via VITE_API_BASE_URL)
 *
 * API Endpoints:
 * - POST /auth/login - Login
 * - POST /auth/password-reset/request - Request Password Reset
 */

import { apiClient } from './api-client';
import type {
  LoginRequest,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetResponse,
} from './types/auth.types';

export class AuthService {
  private readonly basePath = '/auth';

  /**
   * Login user
   * POST /auth/login
   * Used on: Login page (/login)
   *
   * Request body:
   * {
   *   "email": "user@example.com",
   *   "password": "string"
   * }
   *
   * Response body:
   * {
   *   "access_token": "string",
   *   "token_type": "bearer",
   *   "expires_in": 0
   * }
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${this.basePath}/login`,
      credentials
    );

    // Store the access token in localStorage
    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
      sessionStorage.setItem('isAuthenticated', 'true');
    }

    return response;
  }

  /**
   * Request password reset
   * POST /auth/password-reset/request
   * Used on: Password reset page (/password-reset)
   *
   * Request body:
   * {
   *   "email": "user@example.com"
   * }
   *
   * Response body:
   * {
   *   "message": "Password reset link has been sent to your email."
   * }
   */
  async requestPasswordReset(
    data: PasswordResetRequest
  ): Promise<PasswordResetResponse> {
    return apiClient.post<PasswordResetResponse>(
      `${this.basePath}/password-reset/request`,
      data
    );
  }

  /**
   * Logout user
   * Clears authentication tokens from storage
   */
  logout(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('isAuthenticated');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

// Export singleton instance
export const authService = new AuthService();
