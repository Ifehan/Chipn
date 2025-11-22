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
    sessionStorage.clear();
  });

  describe('login', () => {
    it('should successfully login and store tokens', async () => {
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
      expect(sessionStorage.getItem('isAuthenticated')).toBe('true');
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
      expect(sessionStorage.getItem('isAuthenticated')).toBeNull();
    });

    it('should not store tokens if access_token is missing', async () => {
      const mockResponse = {
        access_token: '',
        token_type: 'bearer',
        expires_in: 3600,
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.login(credentials);

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(sessionStorage.getItem('isAuthenticated')).toBeNull();
    });
  });

  describe('requestPasswordReset', () => {
    it('should successfully request password reset', async () => {
      const mockResponse: PasswordResetResponse = {
        message: 'Password reset link has been sent to your email.',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const data = {
        email: 'test@example.com',
      };

      const result = await authService.requestPasswordReset(data);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/auth/password-reset/request',
        data
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle password reset request failure', async () => {
      const mockError = {
        message: 'Email not found',
        status: 404,
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      const data = {
        email: 'nonexistent@example.com',
      };

      await expect(authService.requestPasswordReset(data)).rejects.toEqual(
        mockError
      );
    });
  });

  describe('logout', () => {
    it('should clear authentication tokens', () => {
      localStorage.setItem('authToken', 'test-token');
      sessionStorage.setItem('isAuthenticated', 'true');

      authService.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(sessionStorage.getItem('isAuthenticated')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      sessionStorage.setItem('isAuthenticated', 'true');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false when isAuthenticated is not "true"', () => {
      sessionStorage.setItem('isAuthenticated', 'false');
      expect(authService.isAuthenticated()).toBe(false);
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
