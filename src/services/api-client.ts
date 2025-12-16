/**
 * Base API Client
 * Handles common HTTP operations and configuration
 */

// Use a function to safely access environment variables in both Vite and Jest
const getApiBaseUrl = (): string => {
  // Check if we're in a Node environment (Jest)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  // Try to access import.meta.env (Vite) using eval to avoid Jest parsing issues
  try {
    // This approach prevents Jest from trying to parse import.meta at compile time
    const importMeta = (0, eval)('import.meta');
    if (importMeta && importMeta.env && importMeta.env.VITE_API_BASE_URL) {
      return importMeta.env.VITE_API_BASE_URL;
    }
  } catch (e) {
    // import.meta not available, continue to fallback
  }

  // Default fallback
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle 401 Unauthorized - clear auth and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('isAuthenticated');

          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/login') {
            // Use assign for better compatibility, fallback to href
            if (typeof window.location.assign === 'function') {
              window.location.assign('/login');
            } else {
              window.location.href = '/login';
            }
          }
        }

        const error: ApiError = {
          message: errorData.message || errorData.detail || `HTTP error! status: ${response.status}`,
          status: response.status,
          details: errorData,
        };
        throw error;
      }

      // Handle 204 No Content
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
