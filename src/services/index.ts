/**
 * Services barrel export
 * Central export point for all services
 */

export { apiClient, ApiClient } from './api-client';
export { usersService, UsersService } from './users.service';
export { paymentService } from './payment.service';
export { vendorService } from './vendor.service';
export { logger } from './logger';
export { performanceMonitor } from './performance-monitor';
export { requestDeduplicator } from './request-deduplicator';
export { webVitalsMonitor } from './web-vitals-monitor';
export { dashboardService } from './dashboard.service';

// Export types
export type { ApiError } from './api-client';
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from './types/user.types';
export type {
  Payment,
  StkPushRequest,
  StkPushResponse,
} from './types/payment.types';
export type {
  Vendor,
  VendorsListResponse,
} from './types/vendor.types';
