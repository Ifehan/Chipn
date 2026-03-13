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
  LogoutRequest,
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

    if (response.access_token) {
      localStorage.setItem('authToken', response.access_token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refreshToken', response.refresh_token);
    }

    return response;
  }

  /**
   * Refresh access token using stored refresh token
   * POST /auth/refresh
   * Returns new access token, or null if refresh token is invalid/missing
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.basePath}/refresh`,
        { refresh_token: refreshToken }
      );

      if (response.access_token) {
        localStorage.setItem('authToken', response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }

      return response.access_token;
    } catch {
      this.logout();
      return null;
    }
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
   * Revokes refresh token on the backend, then clears all tokens from storage
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await apiClient.post<void>(`${this.basePath}/logout`, { refresh_token: refreshToken } as LogoutRequest);
      } catch {
        // Best-effort: clear locally even if server call fails
      }
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Check if a token exists in storage.
   * The authoritative isAuthenticated state lives in AuthContext (derived from user object).
   * This is only used for the initial app load check.
   */
  hasToken(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

// Export singleton instance
export const authService = new AuthService();
