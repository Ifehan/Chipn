/**
 * Users Service
 * Handles all user-related API operations
 * Base URL: http://localhost:8000 (configurable via VITE_API_BASE_URL)
 *
 * API Endpoints:
 * - POST /users/ - Create User (signup page)
 * - GET /users/me - Get Current User Info (profile settings page)
 * - GET /users/{user_id} - Get User by ID
 * - PUT /users/{user_id} - Update User (profile settings page)
 */

import { apiClient } from './api-client';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from './types/user.types';

export class UsersService {
  private readonly basePath = '/users';

  /**
   * Create a new user (signup)
   * POST /users/
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
  async createUser(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(`${this.basePath}/`, data);
  }

  /**
   * Get current authenticated user info
   * GET /users/me
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
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/me`);
  }

  /**
   * Get user by ID
   * GET /users/{user_id}
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
  async getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${userId}`);
  }

  /**
   * Update user by ID
   * PUT /users/{user_id}
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
  async updateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<User> {
    return apiClient.put<User>(`${this.basePath}/${userId}`, data);
  }
}

// Export singleton instance
export const usersService = new UsersService();
