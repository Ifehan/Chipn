/**
 * AuthContext Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';
import type { User } from '../../services/types/user.types';

vi.mock('../../services/auth.service', () => ({
  authService: {
    refreshAccessToken: vi.fn(),
    login: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
  },
}));
vi.mock('../../services/users.service', () => ({
  usersService: {
    getCurrentUser: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '254712345678',
  id_type: 'national_id',
  role: 'user',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('AuthContext & useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no valid session
    (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue(null);
  });

  describe('useAuth Hook Initialization', () => {
    it('should throw error when used outside AuthProvider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });

    it('should initialize with default values during loading', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

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
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load user data if session cookie valid on mount', async () => {
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('new-access-token');
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle getCurrentUser error and logout on 401', async () => {
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('token');
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockRejectedValue({
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
      (authService.login as ReturnType<typeof vi.fn>).mockResolvedValue({
        access_token: 'new-token',
        token_type: 'bearer',
        expires_in: 900,
      });
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

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
      (authService.login as ReturnType<typeof vi.fn>).mockRejectedValue(loginError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong-password');
        } catch (_e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('Logout', () => {
    it('should logout user and clear state', async () => {
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('token');
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('should clear error on logout', async () => {
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('token');
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockRejectedValue({
        status: 500,
        message: 'Server error',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('RefreshUser', () => {
    it('should refresh user data', async () => {
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('token');
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ ...mockUser, first_name: 'Jane' });

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
      (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('token');
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(mockUser)
        .mockRejectedValueOnce({ status: 500, message: 'Server error' });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.error).not.toBeNull();
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('Edge Cases', () => {
    it('isAuthenticated should be false if user is null', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
