/**
 * Auth Service Tests
 * Tests for authentication-related API operations
 */

import { authService } from '../auth.service';
import { apiClient } from '../api-client';
import type { LoginResponse, PasswordResetResponse } from '../types/auth.types';

// Mock the api-client
jest.mock('../api-client');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should successfully login and store token', async () => {
      const mockResponse: LoginResponse = {
        access_token: 'test-token-123',
        token_type: 'bearer',
        expires_in: 3600,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('authToken')).toBe('test-token-123');
    });

    it('should handle login failure', async () => {
      const mockError = {
        message: 'Invalid credentials',
        status: 401,
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toEqual(mockError);
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should not store token if access_token is missing', async () => {
      const mockResponse = {
        access_token: '',
        token_type: 'bearer',
        expires_in: 3600,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      await authService.login({ email: 'test@example.com', password: 'password123' });

      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('requestPasswordReset', () => {
    it('should successfully request password reset', async () => {
      const mockResponse: PasswordResetResponse = {
        message: 'Password reset link has been sent to your email.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const data = { email: 'test@example.com' };
      const result = await authService.requestPasswordReset(data);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/password-reset/request', data);
      expect(result).toEqual(mockResponse);
    });

    it('should handle password reset request failure', async () => {
      const mockError = { message: 'Email not found', status: 404 };
      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authService.requestPasswordReset({ email: 'nonexistent@example.com' })
      ).rejects.toEqual(mockError);
    });
  });

  describe('logout', () => {
    it('should clear the auth token from localStorage', () => {
      localStorage.setItem('authToken', 'test-token');

      authService.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('hasToken', () => {
    it('should return true when a token is stored', () => {
      localStorage.setItem('authToken', 'test-token-123');
      expect(authService.hasToken()).toBe(true);
    });

    it('should return false when no token is stored', () => {
      expect(authService.hasToken()).toBe(false);
    });
  });

  describe('getAccessToken', () => {
    it('should return the stored access token', () => {
      localStorage.setItem('authToken', 'test-token-123');
      expect(authService.getAccessToken()).toBe('test-token-123');
    });

    it('should return null when no token is stored', () => {
      expect(authService.getAccessToken()).toBeNull();
    });
  });
});
