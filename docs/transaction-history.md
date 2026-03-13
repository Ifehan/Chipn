# Transaction History Feature

## Overview

The Transaction History feature provides users with a comprehensive view of all their M-Pesatransaction-history, including filtering, search, and pagination capabilities. It integrates with the `/mpesa/transactions` API endpoint to fetch and display transaction data in real-time.

## Features

- ✅ **Real-time Data Fetching** - Automatically fetchestransaction-history from the API
- ✅ **Status Filtering** - Filter by All, Pending, or Completedtransaction-history
- ✅ **Pagination** - Navigate through large transaction lists with Previous/Next controls
- ✅ **Client-side Search** - Search across account reference, phone number, receipt number, and description
- ✅ **Status Badges** - Visual indicators for transaction status (Completed, Pending, Failed)
- ✅ **Currency Formatting** - Amounts displayed in KES currency format
- ✅ **Date Formatting** - Transaction dates formatted for readability
- ✅ **Loading States** - Visual feedback during data fetching
- ✅ **Error Handling** - Graceful error display with user-friendly messages
- ✅ **Empty States** - Appropriate messaging when notransaction-history exist

## Architecture

### Components

```
src/
├── pages/
│   └── TransactionHistoryPage.tsx    # Main page component
├── hooks/
│   └── useTransactionHistory.ts      # Custom hook for data fetching
├── services/
│   ├── payment.service.ts            # API service methods
│   └── types/
│       └── payment.types.ts          # TypeScript type definitions
└── __tests__/
    ├── pages/
    │   └── TransactionHistoryPage.test.tsx
    └── hooks/
        └── useTransactionHistory.test.ts
```

### Data Flow

```
TransactionHistoryPage
    ↓
useTransactionHistory Hook
    ↓
paymentService.getTransactionHistory()
    ↓
API Client (GET /mpesa/transactions)
    ↓
Backend API
```

## API Integration

### Endpoint

```
GET /mpesa/transactions
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | `all` | Filter by status: `pending`, `completed`, or `all` |
| `page` | number | `1` | Page number for pagination |
| `page_size` | number | `50` | Number of items per page (max: 100) |

### Response Structure

```typescript
{
 transaction-history: Transaction[];
  total: number;
  page: number;
  page_size: number;
  status_filter: string;
}
```

### Transaction Object

```typescript
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
```

## Usage

### Basic Usage

```typescript
import { useTransactionHistory } from '@/hooks/useTransactionHistory';

function TransactionHistoryPage() {
  const {transaction-history, total, isLoading, error } = useTransactionHistory();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          <h3>{transaction.account_reference}</h3>
          <p>{transaction.amount} KES</p>
          <p>Status: {transaction.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### With Filtering

```typescript
const {transaction-history, total, isLoading, error } = useTransactionHistory({
  status: 'pending',
  page: 1,
  page_size: 20
});
```

### With Pagination

```typescript
const [currentPage, setCurrentPage] = useState(1);

const {transaction-history, total, page, pageSize, isLoading } = useTransactionHistory({
  status: 'all',
  page: currentPage,
  page_size: 20
});

const totalPages = Math.ceil(total / pageSize);

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};
```

### With Search

```typescript
const [searchQuery, setSearchQuery] = useState('');

const {transaction-history } = useTransactionHistory();

const filteredTransactions =transaction-history.filter(transaction => {
  const query = searchQuery.toLowerCase();
  return (
    transaction.account_reference.toLowerCase().includes(query) ||
    transaction.phone_number.includes(query) ||
    transaction.mpesa_receipt_number?.toLowerCase().includes(query) ||
    transaction.transaction_desc.toLowerCase().includes(query)
  );
});
```

## UI Components

### Status Badges

The page displays color-coded status badges:

- **Completed** (Green) - Transaction successfully completed
- **Pending** (Yellow) - Transaction is pending or processing
- **Failed** (Red) - Transaction failed

```typescript
const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();

  if (statusLower === 'completed' || statusLower === 'success') {
    return (
      <span className="bg-green-100 text-green-700">
        <CheckCircle size={12} />
        Completed
      </span>
    );
  }

  if (statusLower === 'pending' || statusLower === 'processing') {
    return (
      <span className="bg-yellow-100 text-yellow-700">
        <Clock size={12} />
        Pending
      </span>
    );
  }

  if (statusLower === 'failed') {
    return (
      <span className="bg-red-100 text-red-700">
        <XCircle size={12} />
        Failed
      </span>
    );
  }
};
```

### Transaction Card

Each transaction is displayed in a card with:
- Account reference and description
- Amount in KES currency
- Phone number and transaction date
- Status badge
- M-Pesa receipt number (if available)
- Error message (if transaction failed)

## Custom Hook: useTransactionHistory

### API

```typescript
interface UseTransactionHistoryResult {
 transaction-history: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  statusFilter: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useTransactionHistory(
  params?: TransactionHistoryParams
): UseTransactionHistoryResult
```

### Parameters

```typescript
interface TransactionHistoryParams {
  status?: 'pending' | 'completed' | 'all';
  page?: number;
  page_size?: number;
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `transactions` | `Transaction[]` | Array of transaction objects |
| `total` | `number` | Total number oftransaction-history |
| `page` | `number` | Current page number |
| `pageSize` | `number` | Number of items per page |
| `statusFilter` | `string` | Current status filter |
| `isLoading` | `boolean` | Loading state indicator |
| `error` | `string \| null` | Error message if request failed |
| `refetch` | `() => Promise<void>` | Function to manually refetch data |

### Features

- **Automatic Fetching** - Fetches data on mount and when parameters change
- **Stable Dependencies** - Uses JSON.stringify to prevent unnecessary re-renders
- **Error Handling** - Catches and exposes errors for UI handling
- **Loading States** - Tracks loading state for UI feedback
- **Manual Refetch** - Provides refetch function for manual updates

## Testing

### Unit Tests

The feature includes comprehensive test coverage:

#### Hook Tests (`src/hooks/__tests__/useTransactionHistory.test.ts`)
- ✅ Fetchestransaction-history successfully
- ✅ Handles custom parameters
- ✅ Handles errors gracefully
- ✅ Supports manual refetch
- ✅ Handles empty transaction lists

#### Page Tests (`src/pages/__tests__/TransactionHistoryPage.test.tsx`)
- ✅ Renders without crashing
- ✅ Displays loading state
- ✅ Displays error state
- ✅ Displaystransaction-history
- ✅ Filterstransaction-history by search query
- ✅ Displays status badges correctly
- ✅ Shows M-Pesa receipt numbers
- ✅ Formats amounts correctly
- ✅ Handles tab switching
- ✅ Maintains state during search

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test files
pnpm test useTransactionHistory.test.ts
pnpm test TransactionHistoryPage.test.tsx

# Run with coverage
pnpm test -- --coverage
```

## Performance Considerations

### Optimization Strategies

1. **Stable Dependencies** - Uses `JSON.stringify(params)` to prevent unnecessary re-renders
2. **Client-side Search** - Filterstransaction-history in memory for instant results
3. **Pagination** - Limits data fetched per request (default: 50 items)
4. **Memoization** - Uses `useCallback` for stable function references

### Best Practices

- Keep `page_size` reasonable (20-50 items) for optimal performance
- Use status filtering to reduce data transfer
- Implement debouncing for search input if needed
- Consider virtual scrolling for very large lists

## Troubleshooting

### Common Issues

#### Notransaction-history Displayed

**Possible Causes:**
- Notransaction-history exist for the user
- API endpoint not configured correctly
- Authentication token missing or invalid

**Solutions:**
1. Check if user has anytransaction-history in the database
2. Verify `VITE_API_BASE_URL` in `.env` file
3. Ensure user is authenticated (check localStorage for token)

#### Loading State Never Completes

**Possible Causes:**
- API endpoint unreachable
- Network error
- CORS issues

**Solutions:**
1. Check browser console for network errors
2. Verify API server is running
3. Check CORS configuration on backend

#### Search Not Working

**Possible Causes:**
- Search query not matching any fields
- Case sensitivity issues

**Solutions:**
1. Ensure search is case-insensitive (`.toLowerCase()`)
2. Check which fields are being searched
3. Verify transaction data contains searchable content

## Future Enhancements

Potential improvements for the transaction history feature:

- [ ] Export transactions to CSV/PDF
- [ ] Advanced filtering (date range, amount range)
- [ ] Transaction details modal
- [ ] Bulk operations (mark as reviewed, etc.)
- [ ] Real-time updates via WebSocket
- [ ] Transaction analytics and charts
- [ ] Receipt download functionality
- [ ] Email transaction receipts

## Related Documentation

- [Services Layer Documentation](../src/services/README.md)
- [Unit Testing Guide](unit-testing.md)
- [API Documentation](https://api.chipn.com/docs)

---

**Last Updated**: 2025-11-27
