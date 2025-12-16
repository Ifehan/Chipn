# Services Layer Documentation

## Overview

The services layer provides a clean, type-safe interface for making API requests. It follows React TypeScript best practices and is designed to be scalable and maintainable.

## Architecture

```
src/services/
├── api-client.ts          # Base HTTP client with common functionality
├── users.service.ts       # User-specific API operations
├── auth.service.ts        # Authentication API operations
├── payment.service.ts     # M-Pesa payment and transaction operations
├── types/
│   ├── user.types.ts      # User-related TypeScript types
│   ├── auth.types.ts      # Authentication TypeScript types
│   └── payment.types.ts   # Payment and transaction TypeScript types
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

### Payment Service

#### POST /mpesa/stk-push - Initiate STK Push
**Used on:** Create New Bill page (`/create-bill`)

**Request Body:**
```json
{
  "payments": [
    {
      "amount": 100,
      "phone_number": "254712345678"
    }
  ],
  "account_reference": "Invoice123",
  "transaction_desc": "Payment for goods"
}
```

**Response Body:**
```json
{
  "message": "string",
  "checkout_request_id": "string",
  "merchant_request_id": "string",
  "response_code": "string",
  "response_description": "string",
  "customer_message": "string"
}
```

#### GET /mpesa/transactions - Get Transaction History
**Used on:** Transaction History page (`/transactions`)

**Query Parameters:**
- `status`: Filter by status (`pending`, `completed`, `all`)
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 50, max: 100)

**Response Body:**
```json
{
  "transactions": [
    {
      "id": "string",
      "merchant_request_id": "string",
      "checkout_request_id": "string",
      "phone_number": "string",
      "amount": 0,
      "account_reference": "string",
      "transaction_desc": "string",
      "mpesa_receipt_number": "string",
      "transaction_date": "2025-11-27T13:44:06.618Z",
      "status": "string",
      "callback_url": "string",
      "callback_received": "2025-11-27T13:44:06.619Z",
      "result_code": "string",
      "result_desc": "string",
      "error_message": "string",
      "created_at": "2025-11-27T13:44:06.619Z",
      "updated_at": "2025-11-27T13:44:06.619Z",
      "user_id": "string"
    }
  ],
  "total": 0,
  "page": 0,
  "page_size": 0,
  "status_filter": "string"
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

### 4. In Transaction History Page

```typescript
import { useTransactionHistory } from '@/hooks/useTransactionHistory';
import { useState } from 'react';

function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { transactions, total, isLoading, error } = useTransactionHistory({
    status: activeTab,
    page: currentPage,
    page_size: 20,
  });

  if (isLoading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Tab buttons */}
      <button onClick={() => setActiveTab('all')}>All ({total})</button>
      <button onClick={() => setActiveTab('pending')}>Pending</button>
      <button onClick={() => setActiveTab('completed')}>Completed</button>

      {/* Transaction list */}
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <h3>{transaction.account_reference}</h3>
          <p>{transaction.amount} KES</p>
          <p>Status: {transaction.status}</p>
          {transaction.mpesa_receipt_number && (
            <p>Receipt: {transaction.mpesa_receipt_number}</p>
          )}
        </div>
      ))}

      {/* Pagination */}
      <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <button onClick={() => setCurrentPage(p => p + 1)}>
        Next
      </button>
    </div>
  );
}
```

### 5. Initiating M-Pesa Payment

```typescript
import { usePayment } from '@/hooks/usePayment';

function CreateBillPage() {
  const { initiatePayment, loading, error } = usePayment();

  const handlePayment = async () => {
    try {
      const response = await initiatePayment({
        payments: [
          { amount: 100, phone_number: '254712345678' },
          { amount: 200, phone_number: '254798765432' }
        ],
        account_reference: 'INV001',
        transaction_desc: 'Payment for services'
      });
      console.log('Payment initiated:', response);
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with M-Pesa'}
    </button>
  );
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

### Payment Types

```typescript
// Individual payment in STK Push request
interface Payment {
  amount: number;
  phone_number: string;
}

// STK Push request
interface StkPushRequest {
  payments: Payment[];
  account_reference: string;
  transaction_desc: string;
}

// STK Push response
interface StkPushResponse {
  message: string;
  checkout_request_id?: string;
  merchant_request_id?: string;
  response_code?: string;
  response_description?: string;
  customer_message?: string;
}

// Transaction entity
interface Transaction {
  id: string;
  merchant_request_id: string;
  checkout_request_id: string;
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
  mpesa_receipt_number: string | null;
  transaction_date: string | null;
  status: string;
  callback_url: string | null;
  callback_received: string | null;
  result_code: string | null;
  result_desc: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Transaction history query parameters
interface TransactionHistoryParams {
  status?: 'pending' | 'completed' | 'all';
  page?: number;
  page_size?: number;
}

// Transaction history response
interface TransactionHistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  page_size: number;
  status_filter: string;
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
