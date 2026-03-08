/**
 * useUsers Hook Tests
 * Tests for all user-related custom hooks
 */

import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import {
  useCreateUser,
  useCurrentUser,
  useGetUser,
  useUpdateUser,
  useUsers,
} from '../useUsers';
import { usersService } from '../../services';
import type { ApiError } from '../../services/api-client';
import type { User, CreateUserRequest, UpdateUserRequest } from '../../services';

// Mock the usersService
jest.mock('../../services', () => ({
  usersService: {
    createUser: jest.fn(),
    getCurrentUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  },
}));

describe('useUsers Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: User = {
    id: 'user123',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone_number: '+1234567890',
    id_type: 'passport',
    role: 'user',
  };

  const mockApiError: ApiError = {
    message: 'API Error',
    status: 400,
    details: { field: 'error details' },
  };

  describe('useCreateUser', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useCreateUser());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.createUser).toBe('function');
    });

    it('should successfully create a user', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      (usersService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useCreateUser());

      let returnedUser: User | undefined;

      await act(async () => {
        returnedUser = await result.current.createUser(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.createUser).toHaveBeenCalledWith(mockRequest);
      expect(returnedUser).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state during user creation', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      (usersService.createUser as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      const { result } = renderHook(() => useCreateUser());

      act(() => {
        result.current.createUser(mockRequest);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle errors during user creation', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      (usersService.createUser as jest.Mock).mockRejectedValue(mockApiError);

      const { result } = renderHook(() => useCreateUser());

      await act(async () => {
        try {
          await result.current.createUser(mockRequest);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(mockApiError);
      });
    });

    it('should clear error on subsequent successful call', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      (usersService.createUser as jest.Mock)
        .mockRejectedValueOnce(mockApiError)
        .mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useCreateUser());

      // First call - should fail
      await act(async () => {
        try {
          await result.current.createUser(mockRequest);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(mockApiError);
      });

      // Second call - should succeed
      await act(async () => {
        await result.current.createUser(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('useCurrentUser', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useCurrentUser());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.getCurrentUser).toBe('function');
    });

    it('should successfully get current user', async () => {
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useCurrentUser());

      let returnedUser: User | undefined;

      await act(async () => {
        returnedUser = await result.current.getCurrentUser();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.getCurrentUser).toHaveBeenCalled();
      expect(returnedUser).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it('should handle unauthorized errors', async () => {
      const unauthorizedError: ApiError = {
        message: 'Unauthorized',
        status: 401,
      };

      (usersService.getCurrentUser as jest.Mock).mockRejectedValue(unauthorizedError);

      const { result } = renderHook(() => useCurrentUser());

      await act(async () => {
        try {
          await result.current.getCurrentUser();
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(unauthorizedError);
      });
    });
  });

  describe('useGetUser', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useGetUser());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.getUserById).toBe('function');
    });

    it('should successfully get user by ID', async () => {
      const userId = 'user123';
      (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useGetUser());

      let returnedUser: User | undefined;

      await act(async () => {
        returnedUser = await result.current.getUserById(userId);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.getUserById).toHaveBeenCalledWith(userId);
      expect(returnedUser).toEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it('should handle user not found errors', async () => {
      const userId = 'nonexistent';
      const notFoundError: ApiError = {
        message: 'User not found',
        status: 404,
      };

      (usersService.getUserById as jest.Mock).mockRejectedValue(notFoundError);

      const { result } = renderHook(() => useGetUser());

      await act(async () => {
        try {
          await result.current.getUserById(userId);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(notFoundError);
      });
    });
  });

  describe('useUpdateUser', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useUpdateUser());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.updateUser).toBe('function');
    });

    it('should successfully update user', async () => {
      const userId = 'user123';
      const updateRequest: UpdateUserRequest = {
        first_name: 'Jane',
        last_name: 'Smith',
      };

      const updatedUser: User = {
        ...mockUser,
        first_name: 'Jane',
        last_name: 'Smith',
      };

      (usersService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUpdateUser());

      let returnedUser: User | undefined;

      await act(async () => {
        returnedUser = await result.current.updateUser(userId, updateRequest);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateRequest);
      expect(returnedUser).toEqual(updatedUser);
      expect(result.current.error).toBeNull();
    });

    it('should handle validation errors', async () => {
      const userId = 'user123';
      const updateRequest: UpdateUserRequest = {
        email: 'invalid-email',
      };

      const validationError: ApiError = {
        message: 'Invalid email format',
        status: 400,
      };

      (usersService.updateUser as jest.Mock).mockRejectedValue(validationError);

      const { result } = renderHook(() => useUpdateUser());

      await act(async () => {
        try {
          await result.current.updateUser(userId, updateRequest);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(validationError);
      });
    });
  });

  describe('useUsers (combined hook)', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useUsers());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.createUser).toBe('function');
      expect(typeof result.current.getCurrentUser).toBe('function');
      expect(typeof result.current.getUserById).toBe('function');
      expect(typeof result.current.updateUser).toBe('function');
    });

    it('should successfully create user using combined hook', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      (usersService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.createUser(mockRequest);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.createUser).toHaveBeenCalledWith(mockRequest);
      expect(result.current.error).toBeNull();
    });

    it('should successfully get current user using combined hook', async () => {
      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.getCurrentUser).toHaveBeenCalled();
      expect(result.current.error).toBeNull();
    });

    it('should successfully get user by ID using combined hook', async () => {
      const userId = 'user123';
      (usersService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.getUserById(userId);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.getUserById).toHaveBeenCalledWith(userId);
      expect(result.current.error).toBeNull();
    });

    it('should successfully update user using combined hook', async () => {
      const userId = 'user123';
      const updateRequest: UpdateUserRequest = {
        first_name: 'Jane',
      };

      const updatedUser: User = {
        ...mockUser,
        first_name: 'Jane',
      };

      (usersService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.updateUser(userId, updateRequest);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateRequest);
      expect(result.current.error).toBeNull();
    });

    it('should share loading state across all operations', async () => {
      (usersService.getCurrentUser as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );

      const { result } = renderHook(() => useUsers());

      act(() => {
        result.current.getCurrentUser();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should share error state across all operations', async () => {
      (usersService.createUser as jest.Mock).mockRejectedValue(mockApiError);

      const { result } = renderHook(() => useUsers());

      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      await act(async () => {
        try {
          await result.current.createUser(mockRequest);
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.error).toEqual(mockApiError);
      });
    });

    it('should handle multiple sequential operations', async () => {
      const userId = 'user123';
      const updateRequest: UpdateUserRequest = {
        first_name: 'Jane',
      };

      (usersService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (usersService.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        first_name: 'Jane',
      });

      const { result } = renderHook(() => useUsers());

      // First operation
      await act(async () => {
        await result.current.getCurrentUser();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Second operation
      await act(async () => {
        await result.current.updateUser(userId, updateRequest);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(usersService.getCurrentUser).toHaveBeenCalled();
      expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateRequest);
      expect(result.current.error).toBeNull();
    });
  });
});
