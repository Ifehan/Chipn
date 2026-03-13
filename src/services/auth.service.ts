/**
 * Authentication Service
 *
 * Security model:
 * - Access token: stored in MODULE MEMORY ONLY (never localStorage / sessionStorage)
 *   → Invisible to XSS. Lost on page refresh — recovered via /auth/refresh on app boot.
 * - Refresh token: stored in httpOnly cookie set by the server
 *   → JavaScript cannot read it. Sent automatically by the browser to /auth/* routes.
 */

import { apiClient } from './api-client';
import { getAccessToken, setAccessToken } from './token-store';
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
   * Server sets refresh_token as httpOnly cookie.
   * We store the access_token in memory only.
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${this.basePath}/login`,
      credentials
    );

    if (response.access_token) {
      setAccessToken(response.access_token);
    }

    return response;
  }

  /**
   * Silently refresh the access token using the httpOnly refresh token cookie.
   * Called on app startup and by the API client on 401.
   * Returns the new access token, or null if the session has expired.
   */
  async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<LoginResponse>(
        `${this.basePath}/refresh`,
        undefined,
        { credentials: 'include' }   // Browser sends the httpOnly cookie automatically
      );

      if (response.access_token) {
        setAccessToken(response.access_token);
        return response.access_token;
      }
      return null;
    } catch {
      setAccessToken(null);
      return null;
    }
  }

  /**
   * Logout user
   * POST /auth/logout — server revokes the refresh token cookie server-side.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(
        `${this.basePath}/logout`,
        undefined,
        { credentials: 'include' }
      );
    } catch {
      // Best-effort — clear locally even if server call fails
    } finally {
      setAccessToken(null);
    }
  }

  /**
   * Request password reset
   * POST /auth/password-reset/request
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<PasswordResetResponse> {
    return apiClient.post<PasswordResetResponse>(
      `${this.basePath}/password-reset/request`,
      data
    );
  }

  /**
   * Returns true if an in-memory access token exists.
   * The app should call refreshAccessToken() on startup to restore a session.
   */
  hasToken(): boolean {
    return getAccessToken() !== null;
  }

  /**
   * Returns the in-memory access token (never touches localStorage).
   */
  getAccessToken(): string | null {
    return getAccessToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
