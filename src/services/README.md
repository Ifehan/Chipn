# Services Layer Documentation

## Overview

The services layer provides a clean, type-safe interface for making API requests. It follows React TypeScript best practices and is designed to be scalable and maintainable.

## Architecture

```
src/services/
├── api-client.ts          # Base HTTP client with common functionality
├── users.service.ts       # User-specific API operations
├── types/
│   └── user.types.ts      # User-related TypeScript types
└── index.ts               # Barrel export for easy imports
```

## Configuration

Set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Available API Routes

### Users Service

#### POST /users/ - Create User (Signup)
**Used on:** Signup page (`/signup`)

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string",
  "id_type": "string",
  "password": "stringst"
}
```

**Response Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string",
  "id_type": "string",
  "id": "string"
}
```

#### GET /users/me - Get Current User Info
**Used on:** Profile settings page (`/profile-settings`)

**Response Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string",
  "id_type": "string",
  "id": "string"
}
```

#### GET /users/{user_id} - Get User by ID

**Response Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string",
  "id_type": "string",
  "id": "string"
}
```

#### PUT /users/{user_id} - Update User
**Used on:** Profile settings page (`/profile-settings`)

**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string",
  "id_type": "string"
}
```

**Response Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "phone_number": "string",
  "id_type": "string",
  "id": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

## Usage Examples

### 1. Direct Service Usage

```typescript
import { usersService } from '@/services';

// Create a new user (signup)
const user = await usersService.createUser({
  first_name: 'John',
  last_name: 'Doe',
  email: 'user@example.com',
  phone_number: '+1234567890',
  id_type: 'passport',
  password: 'securePassword123',
});

// Get current user
const currentUser = await usersService.getCurrentUser();

// Get user by ID
const user = await usersService.getUserById('user123');

// Update user
const updatedUser = await usersService.updateUser('user123', {
  first_name: 'Jane',
  last_name: 'Smith',
  phone_number: '+9876543210',
});
```

### 2. Using React Hook (Recommended)

```typescript
import { useCreateUser } from '@/hooks/useUsers';

function SignupPage() {
  const { createUser, loading, error } = useCreateUser();

  const handleSignup = async (formData) => {
    try {
      const user = await createUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        id_type: formData.idType,
        password: formData.password,
      });
      console.log('User created:', user);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      {/* form fields */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

### 3. In Profile Settings Page

```typescript
import { useCurrentUser, useUpdateUser } from '@/hooks/useUsers';
import { useEffect, useState } from 'react';

function ProfileSettingsPage() {
  const { getCurrentUser, loading: loadingUser, error: userError } = useCurrentUser();
  const { updateUser, loading: updating, error: updateError } = useUpdateUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };
    loadUser();
  }, [getCurrentUser]);

  const handleUpdate = async (userId, updates) => {
    try {
      const updatedUser = await updateUser(userId, updates);
      setUser(updatedUser);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const loading = loadingUser || updating;
  const error = userError || updateError;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Profile form */}</div>;
}
```

## Type Definitions

### User Types

```typescript
// User entity
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_type: string;
  created_at?: string;
  updated_at?: string;
}

// Create user request (signup)
interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_type: string;
  password: string;
}

// Update user request
interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  id_type?: string;
}
```

### ID Types

The `id_type` field accepts the following values:
- `"national_id"` - National ID
- `"passport"` - Passport
- `"drivers_license"` - Driver's License

## Adding New Services

To add a new service (e.g., bills-service):

### 1. Create type definitions

```typescript
// src/services/types/bill.types.ts
export interface Bill {
  id: string;
  title: string;
  amount: number;
  // ... other fields
}

export interface CreateBillRequest {
  title: string;
  amount: number;
  // ... other fields
}
```

### 2. Create the service

```typescript
// src/services/bills.service.ts
import { apiClient } from './api-client';
import type { Bill, CreateBillRequest } from './types/bill.types';

export class BillsService {
  private readonly basePath = '/bills';

  async createBill(data: CreateBillRequest): Promise<Bill> {
    return apiClient.post<Bill>(`${this.basePath}/`, data);
  }

  async getBills(): Promise<Bill[]> {
    return apiClient.get<Bill[]>(`${this.basePath}/`);
  }

  // ... other methods
}

export const billsService = new BillsService();
```

### 3. Export from index.ts

```typescript
// src/services/index.ts
export { billsService, BillsService } from './bills.service';
export type { Bill, CreateBillRequest } from './types/bill.types';
```

### 4. Create a custom hook (optional but recommended)

```typescript
// src/hooks/useBills.ts
import { useState, useCallback } from 'react';
import { billsService } from '../services';

export const useBills = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBill = useCallback(async (data) => {
    setLoading(true);
    try {
      return await billsService.createBill(data);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBill, loading, error };
};
```

## Features

- ✅ **Type Safety**: Full TypeScript support with proper types
- ✅ **Authentication**: Automatic token handling via localStorage
- ✅ **Error Handling**: Consistent error structure across all services
- ✅ **Extensible**: Easy to add new services following the same pattern
- ✅ **Testable**: Services can be easily mocked in tests
- ✅ **Environment Configuration**: API base URL configurable via .env
- ✅ **React Integration**: Custom hooks for seamless component integration

## Error Handling

All API errors follow this structure:

```typescript
interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}
```

Handle errors consistently:

```typescript
try {
  await usersService.createUser(data);
} catch (error) {
  const apiError = error as ApiError;
  if (apiError.status === 400) {
    // Handle validation error
  } else if (apiError.status === 401) {
    // Handle authentication error
  } else {
    // Handle other errors
  }
}
```

## Testing

Services can be easily mocked in tests:

```typescript
import { usersService } from '@/services';

jest.mock('@/services', () => ({
  usersService: {
    createUser: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

// In your test
(usersService.createUser as jest.Mock).mockResolvedValue({
  id: 'user123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'test@example.com',
  phone_number: '+1234567890',
  id_type: 'passport',
});
```

## Best Practices

1. **Always use the custom hooks** in React components for automatic loading/error state management
2. **Handle errors gracefully** with try-catch blocks
3. **Store sensitive data securely** - tokens are automatically managed in localStorage
4. **Keep services focused** - each service should handle one domain (users, bills, etc.)
5. **Use TypeScript types** - leverage the type system for compile-time safety
6. **Test your services** - write unit tests for service methods
7. **Follow API specification** - ensure request/response formats match the backend API
8. **Document page usage** - clearly indicate which pages use which endpoints
