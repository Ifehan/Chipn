/**
 * Base API Client
 *
 * Security notes:
 * - Access token read from authService memory (never localStorage)
 * - Refresh token is an httpOnly cookie — handled by the browser automatically
 * - On 401: attempts silent token refresh once, then redirects to /login
 * - L-5: Error `details` never surfaced to the UI
 */

import { API_BASE_URL } from '../lib/env';

export interface ApiError {
  message: string;
  status: number;
}

export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshQueue: Array<(token: string | null) => void> = [];

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAccessToken(): string | null {
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./auth.service').authService.getAccessToken();
  }

  private buildConfig(options: RequestInit = {}, tokenOverride?: string | null): RequestInit {
    const token = tokenOverride !== undefined ? tokenOverride : this.getAccessToken();
    return {
      ...options,
      credentials: 'include',        // Always send cookies (for refresh token)
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  }

  private redirectToLogin(): void {
    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
  }

  private async attemptTokenRefresh(): Promise<string | null> {
    try {
      // Direct fetch to avoid recursion — httpOnly cookie sent automatically
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data.access_token) {
        // Update in-memory token via authService
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('./auth.service')._accessToken = data.access_token;
        return data.access_token as string;
      }
      return null;
    } catch {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isAuthEndpoint = endpoint.startsWith('/auth/');
    const url = `${this.baseUrl}${endpoint}`;
    const config = this.buildConfig(options);

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !isAuthEndpoint) {
        if (this.isRefreshing) {
          const newToken = await new Promise<string | null>((resolve) => {
            this.refreshQueue.push(resolve);
          });
          if (!newToken) {
            this.redirectToLogin();
            throw { message: 'Session expired. Please log in again.', status: 401 } as ApiError;
          }
          const retryResponse = await fetch(url, this.buildConfig(options, newToken));
          if (!retryResponse.ok) {
            const errData = await retryResponse.json().catch(() => ({}));
            throw {
              message: errData.detail || `Request failed (${retryResponse.status})`,
              status: retryResponse.status,
            } as ApiError;
          }
          if (retryResponse.status === 204) return {} as T;
          return retryResponse.json();
        }

        this.isRefreshing = true;
        const newToken = await this.attemptTokenRefresh();
        this.isRefreshing = false;
        this.refreshQueue.forEach((resolve) => resolve(newToken));
        this.refreshQueue = [];

        if (!newToken) {
          this.redirectToLogin();
          throw { message: 'Session expired. Please log in again.', status: 401 } as ApiError;
        }

        const retryResponse = await fetch(url, this.buildConfig(options, newToken));
        if (!retryResponse.ok) {
          const errData = await retryResponse.json().catch(() => ({}));
          throw {
            message: errData.detail || `Request failed (${retryResponse.status})`,
            status: retryResponse.status,
          } as ApiError;
        }
        if (retryResponse.status === 204) return {} as T;
        return retryResponse.json();
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // L-5: Only expose a user-safe message — never raw details
        throw {
          message: errorData.detail || errorData.message || `Request failed (${response.status})`,
          status: response.status,
        } as ApiError;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
