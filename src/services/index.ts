/**
 * Services barrel export
 * Central export point for all services
 */

export { apiClient, ApiClient } from './api-client';
export { usersService, UsersService } from './users.service';

// Export types
export type { ApiError } from './api-client';
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from './types/user.types';
