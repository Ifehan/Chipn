export interface ApiError {
  message: string;
  status: number;
}

export class ApiClient {
  get = vi.fn();
  post = vi.fn();
  put = vi.fn();
  patch = vi.fn();
  delete = vi.fn();
}

export const apiClient = new ApiClient();
