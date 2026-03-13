/**
 * Auth Service Tests
 */

import { authService } from '../auth.service';
import { apiClient } from '../api-client';
import type { LoginResponse, PasswordResetResponse } from '../types/auth.types';

vi.mock('../api-client');

describe('AuthService', () => {
  beforeEach(() => {
    vi.resetAllMocks();   // Reset implementations between tests, not just call counts
  });

  describe('login', () => {
    it('should successfully login and store token in memory', async () => {
      const mockResponse: LoginResponse = {
        access_token: 'test-token-123',
        token_type: 'bearer',
        expires_in: 900,
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password1',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password1',
      });
      expect(result).toEqual(mockResponse);
      // Token is in memory, not localStorage
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(authService.getAccessToken()).toBe('test-token-123');
    });

    it('should handle login failure', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue({
        message: 'Invalid credentials',
        status: 401,
      });

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toMatchObject({ status: 401 });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh and return new access token', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        access_token: 'refreshed-token',
        token_type: 'bearer',
        expires_in: 900,
      });

      const token = await authService.refreshAccessToken();

      expect(token).toBe('refreshed-token');
      expect(authService.getAccessToken()).toBe('refreshed-token');
    });

    it('should return null and clear token if refresh fails', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue({ status: 401 });

      const token = await authService.refreshAccessToken();

      expect(token).toBeNull();
      expect(authService.getAccessToken()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call /auth/logout and clear in-memory token', async () => {
      // First login to set token
      (apiClient.post as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ access_token: 'tok', token_type: 'bearer', expires_in: 900 })
        .mockResolvedValueOnce({});

      await authService.login({ email: 'a@b.com', password: 'Password1' });
      expect(authService.getAccessToken()).toBe('tok');

      await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', undefined, { credentials: 'include' });
      expect(authService.getAccessToken()).toBeNull();
    });

    it('should clear token even if server call fails', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({ access_token: 'tok', token_type: 'bearer', expires_in: 900 })
        .mockRejectedValueOnce({ status: 500 });

      await authService.login({ email: 'a@b.com', password: 'Password1' });
      await authService.logout();

      expect(authService.getAccessToken()).toBeNull();
    });
  });

  describe('hasToken', () => {
    it('should return true when an in-memory token exists', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        access_token: 'tok',
        token_type: 'bearer',
        expires_in: 900,
      });
      await authService.login({ email: 'a@b.com', password: 'Password1' });
      expect(authService.hasToken()).toBe(true);
    });

    it('should return false when no token is in memory', async () => {
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({}).mockResolvedValueOnce({});
      await authService.logout(); // clear
      expect(authService.hasToken()).toBe(false);
    });
  });

  describe('requestPasswordReset', () => {
    it('should call password reset endpoint', async () => {
      const mockResponse: PasswordResetResponse = {
        message: 'If an account with that email exists, a reset link has been sent.',
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await authService.requestPasswordReset({ email: 'user@example.com' });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/password-reset/request',
        { email: 'user@example.com' }
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
