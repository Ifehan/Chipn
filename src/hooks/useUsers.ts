/**
 * Custom hooks for user operations
 * Provides easy-to-use interface for components
 *
 * Hooks:
 * - useCreateUser: Create new user (signup page - /signup)
 * - useCurrentUser: Get current authenticated user (profile settings page - /profile-settings)
 * - useGetUser: Get user by ID
 * - useUpdateUser: Update user information (profile settings page - /profile-settings)
 * - useUsers: Combined hook for all user operations
 */

import { useState, useCallback } from 'react';
import { usersService } from '../services';
import type { ApiError } from '../services/api-client';
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from '../services';

/**
 * Hook for creating a new user (signup)
 * Used on: Signup page (/signup)
 *
 * Request body:
 * {
 *   "first_name": "string",
 *   "last_name": "string",
 *   "email": "user@example.com",
 *   "phone_number": "string",
 *   "id_type": "string",
 *   "password": "string"
 * }
 */
export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createUser = useCallback(async (data: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const user = await usersService.createUser(data);
      return user;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser,
    loading,
    error,
  };
};

/**
 * Hook for getting current authenticated user
 * Used on: Profile settings page (/profile-settings)
 *
 * Response body:
 * {
 *   "first_name": "string",
 *   "last_name": "string",
 *   "email": "user@example.com",
 *   "phone_number": "string",
 *   "id_type": "string",
 *   "id": "string"
 * }
 */
export const useCurrentUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await usersService.getCurrentUser();
      return user;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCurrentUser,
    loading,
    error,
  };
};

/**
 * Hook for getting a user by ID
 *
 * Response body:
 * {
 *   "first_name": "string",
 *   "last_name": "string",
 *   "email": "user@example.com",
 *   "phone_number": "string",
 *   "id_type": "string",
 *   "id": "string"
 * }
 */
export const useGetUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getUserById = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await usersService.getUserById(userId);
      return user;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getUserById,
    loading,
    error,
  };
};

/**
 * Hook for updating user information
 * Used on: Profile settings page (/profile-settings)
 *
 * Request body:
 * {
 *   "first_name": "string",
 *   "last_name": "string",
 *   "email": "user@example.com",
 *   "phone_number": "string",
 *   "id_type": "string"
 * }
 *
 * Response body:
 * {
 *   "first_name": "string",
 *   "last_name": "string",
 *   "email": "user@example.com",
 *   "phone_number": "string",
 *   "id_type": "string",
 *   "id": "string",
 *   "created_at": "string",
 *   "updated_at": "string"
 * }
 */
export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const updateUser = useCallback(
    async (userId: string, data: UpdateUserRequest) => {
      setLoading(true);
      setError(null);
      try {
        const user = await usersService.updateUser(userId, data);
        return user;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    updateUser,
    loading,
    error,
  };
};

/**
 * Combined hook for all user operations
 * Use individual hooks above for better code splitting
 */
export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createUser = useCallback(async (data: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const user = await usersService.createUser(data);
      return user;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await usersService.getCurrentUser();
      return user;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await usersService.getUserById(userId);
      return user;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (userId: string, data: UpdateUserRequest) => {
      setLoading(true);
      setError(null);
      try {
        const user = await usersService.updateUser(userId, data);
        return user;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createUser,
    getCurrentUser,
    getUserById,
    updateUser,
  };
};
