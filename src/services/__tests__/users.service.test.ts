/**
 * Users Service Tests
 * Tests for all /users/ API endpoints
 */

import { usersService } from '../users.service';
import { apiClient } from '../api-client';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

// Mock the apiClient
jest.mock('../api-client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe('UsersService', () => {
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
  };

  describe('createUser - POST /users/', () => {
    it('should create a new user with valid data', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      const mockResponse: User = {
        id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await usersService.createUser(mockRequest);

      expect(apiClient.post).toHaveBeenCalledWith('/users/', mockRequest);
      expect(result).toEqual(mockResponse);
      expect(result.id).toBeDefined();
      expect(result.first_name).toBe('John');
      expect(result.last_name).toBe('Doe');
      expect(result.email).toBe('john.doe@example.com');
    });

    it('should handle email already exists error', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'existing@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'securePassword123',
      };

      const mockError = {
        message: 'Email already exists',
        status: 400,
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.createUser(mockRequest)).rejects.toEqual(mockError);
    });

    it('should handle validation errors for invalid password', async () => {
      const mockRequest: CreateUserRequest = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '+1234567890',
        id_type: 'passport',
        password: 'short',
      };

      const mockError = {
        message: 'Password must be at least 8 characters',
        status: 400,
      };

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.createUser(mockRequest)).rejects.toEqual(mockError);
    });
  });

  describe('getCurrentUser - GET /users/me', () => {
    it('should get current authenticated user info', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersService.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
      expect(result.id).toBeDefined();
      expect(result.first_name).toBe('John');
      expect(result.email).toBe('john.doe@example.com');
    });

    it('should handle unauthorized errors', async () => {
      const mockError = {
        message: 'Unauthorized',
        status: 401,
      };

      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.getCurrentUser()).rejects.toEqual(mockError);
    });

    it('should handle token expired errors', async () => {
      const mockError = {
        message: 'Token expired',
        status: 401,
      };

      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.getCurrentUser()).rejects.toEqual(mockError);
    });
  });

  describe('getUserById - GET /users/{user_id}', () => {
    it('should get user by ID', async () => {
      const userId = 'user123';

      (apiClient.get as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersService.getUserById(userId);

      expect(apiClient.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUser);
      expect(result.id).toBe(userId);
    });

    it('should handle user not found errors', async () => {
      const userId = 'nonexistent';
      const mockError = {
        message: 'User not found',
        status: 404,
      };

      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.getUserById(userId)).rejects.toEqual(mockError);
    });

    it('should handle invalid user ID format', async () => {
      const userId = 'invalid-id';
      const mockError = {
        message: 'Invalid user ID format',
        status: 400,
      };

      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.getUserById(userId)).rejects.toEqual(mockError);
    });
  });

  describe('updateUser - PUT /users/{user_id}', () => {
    it('should update user with all fields', async () => {
      const userId = 'user123';
      const mockRequest: UpdateUserRequest = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone_number: '+9876543210',
        id_type: 'national_id',
      };

      const updatedUser: User = {
        id: userId,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone_number: '+9876543210',
        id_type: 'national_id',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      };

      (apiClient.put as jest.Mock).mockResolvedValue(updatedUser);

      const result = await usersService.updateUser(userId, mockRequest);

      expect(apiClient.put).toHaveBeenCalledWith(`/users/${userId}`, mockRequest);
      expect(result).toEqual(updatedUser);
      expect(result.first_name).toBe('Jane');
      expect(result.last_name).toBe('Smith');
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
    });

    it('should update user with partial fields', async () => {
      const userId = 'user123';
      const mockRequest: UpdateUserRequest = {
        first_name: 'Jane',
        phone_number: '+9876543210',
      };

      const updatedUser: User = {
        ...mockUser,
        first_name: 'Jane',
        phone_number: '+9876543210',
        updated_at: '2024-01-02T00:00:00Z',
      };

      (apiClient.put as jest.Mock).mockResolvedValue(updatedUser);

      const result = await usersService.updateUser(userId, mockRequest);

      expect(apiClient.put).toHaveBeenCalledWith(`/users/${userId}`, mockRequest);
      expect(result.first_name).toBe('Jane');
      expect(result.phone_number).toBe('+9876543210');
      expect(result.email).toBe(mockUser.email); // unchanged
    });

    it('should handle validation errors for invalid email', async () => {
      const userId = 'user123';
      const mockRequest: UpdateUserRequest = {
        email: 'invalid-email',
      };

      const mockError = {
        message: 'Invalid email format',
        status: 400,
      };

      (apiClient.put as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.updateUser(userId, mockRequest)).rejects.toEqual(
        mockError
      );
    });

    it('should handle user not found errors', async () => {
      const userId = 'nonexistent';
      const mockRequest: UpdateUserRequest = {
        first_name: 'Jane',
      };

      const mockError = {
        message: 'User not found',
        status: 404,
      };

      (apiClient.put as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.updateUser(userId, mockRequest)).rejects.toEqual(
        mockError
      );
    });

    it('should handle unauthorized update attempts', async () => {
      const userId = 'user123';
      const mockRequest: UpdateUserRequest = {
        first_name: 'Jane',
      };

      const mockError = {
        message: 'Unauthorized to update this user',
        status: 403,
      };

      (apiClient.put as jest.Mock).mockRejectedValue(mockError);

      await expect(usersService.updateUser(userId, mockRequest)).rejects.toEqual(
        mockError
      );
    });
  });
});
