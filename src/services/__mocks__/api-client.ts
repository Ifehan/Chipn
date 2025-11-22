/**
 * Mock API Client for Jest tests
 */

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

export class ApiClient {
  get = jest.fn();
  post = jest.fn();
  put = jest.fn();
  patch = jest.fn();
  delete = jest.fn();
}

// Export singleton instance
export const apiClient = new ApiClient();
