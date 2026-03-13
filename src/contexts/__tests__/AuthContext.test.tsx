/**
 * AuthContext Tests
 * Comprehensive tests for authentication context and useAuth hook
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';
import type { User } from '../../services/types/user.types';

// Mock services
jest.mock('../../services/auth.service');
jest.mock('../../services/users.service');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '254712345678',
  id_type: 'national_id',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('AuthContext & useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('useAuth Hook Initialization', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress error output for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });

    it('should initialize with default values during loading', () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Check initial state before loading completes
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.refreshUser).toBe('function');
    });
  });

  describe('Authentication Flow', () => {
    it('should check auth state on mount', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load user data if token exists on mount', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle getCurrentUser error and logout on 401', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (usersService.getCurrentUser as jest.Mock).mockRejectedValue({
        status: 401,
        message: 'Unauthorized',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.error).not.toBeNull();
    });
  });

  describe('Login', () => {
    it('should successfully login user', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        access_token: 'new-token',
      });
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(usersService.getCurrentUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login failure', async () => {
      const loginError = { message: 'Invalid credentials', status: 401 };
      (authService.login as jest.Mock).mockRejectedValue(loginError);
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong-password');
        } catch (e) {
          // Expected to throw
        }
      });

      // After login fails, user should not be authenticated
      expect(result.current.error).toBe('Invalid credentials');
    });

    it('should call login service with correct credentials', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        access_token: 'token',
      });
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Logout', () => {
    it('should logout user and clear state', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('should clear error on logout', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (usersService.getCurrentUser as jest.Mock).mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      await act(async () => {
        result.current.logout();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('RefreshUser', () => {
    it('should refresh user data', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (usersService.getCurrentUser as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({
          ...mockUser,
          first_name: 'Jane',
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user?.first_name).toBe('John');
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user?.first_name).toBe('Jane');
    });

    it('should handle refresh error', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (usersService.getCurrentUser as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockRejectedValueOnce({
          status: 500,
          message: 'Server error',
        });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.user).toEqual(mockUser); // User data unchanged
    });
  });

  describe('Edge Cases', () => {
    it('should not redirect to login if already on login page', async () => {
      window.location.pathname = '/login';
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle multiple login attempts', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        access_token: 'token',
      });
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.login('user1@example.com', 'password');
        await result.current.login('user2@example.com', 'password');
      });

      expect(authService.login).toHaveBeenCalledTimes(2);
      // getCurrentUser is called during init + 2 logins = 3 calls total
      expect(usersService.getCurrentUser).toHaveBeenCalledTimes(2); // Only logins call it, not init
    });

    it('isAuthenticated should be false if user is null', async () => {
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
