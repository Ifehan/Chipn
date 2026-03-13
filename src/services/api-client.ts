/**
 * Base API Client
 * Handles common HTTP operations and configuration
 */

import { API_BASE_URL } from '../lib/env';

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshQueue: Array<(token: string | null) => void> = [];

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildConfig(options: RequestInit = {}, token?: string | null): RequestInit {
    const authToken = token ?? localStorage.getItem('authToken');
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    };
    return config;
  }

  private redirectToLogin(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('isAuthenticated');
    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
  }

  private async attemptTokenRefresh(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('authToken', data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem('refreshToken', data.refresh_token);
      }
      return data.access_token ?? null;
    } catch {
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Skip auto-refresh for auth endpoints to avoid loops
    const isAuthEndpoint = endpoint.startsWith('/auth/');

    const url = `${this.baseUrl}${endpoint}`;
    const config = this.buildConfig(options);

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !isAuthEndpoint) {
        // Queue concurrent 401s behind a single refresh call
        if (this.isRefreshing) {
          const newToken = await new Promise<string | null>((resolve) => {
            this.refreshQueue.push(resolve);
          });
          if (!newToken) throw { message: 'Session expired', status: 401 } as ApiError;
          const retryResponse = await fetch(url, this.buildConfig(options, newToken));
          if (!retryResponse.ok) {
            const errData = await retryResponse.json().catch(() => ({}));
            throw { message: errData.detail || `HTTP error! status: ${retryResponse.status}`, status: retryResponse.status } as ApiError;
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
          throw { message: errData.detail || `HTTP error! status: ${retryResponse.status}`, status: retryResponse.status } as ApiError;
        }
        if (retryResponse.status === 204) return {} as T;
        return retryResponse.json();
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || errorData.detail || `HTTP error! status: ${response.status}`,
          status: response.status,
          details: errorData,
        };
        throw error;
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
        message: 'Network error occurred',
        status: 0,
        details: error,
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

// Export singleton instance
export const apiClient = new ApiClient();
