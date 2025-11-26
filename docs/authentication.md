# Authentication Flow Documentation

## Overview

The application uses a centralized authentication system with React Context API to manage user authentication state and user data efficiently. This approach eliminates redundant API calls by fetching user data once after login and sharing it across all protected pages.

## Architecture

### AuthContext (`src/contexts/AuthContext.tsx`)

The `AuthContext` provides centralized authentication state management with the following features:

- **Single `/me` API call**: User data is fetched once after successful login
- **Automatic token validation**: Checks for existing tokens on app initialization
- **Shared state**: User data is accessible throughout the app without additional API calls
- **Automatic cleanup**: Handles logout and token expiration

#### Context API

```typescript
interface AuthContextType {
  user: User | null              // Current user data
  loading: boolean               // Loading state for auth operations
  error: string | null           // Error message if any
  isAuthenticated: boolean       // Authentication status
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>  // Manually refresh user data if needed
}
```

### Usage

#### 1. Wrap App with AuthProvider

In [`App.tsx`](../src/App.tsx:14), the entire application is wrapped with `AuthProvider`:

```typescript
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* routes */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}
```

#### 2. Use the useAuth Hook

Any component can access auth state using the [`useAuth()`](../src/contexts/AuthContext.tsx:123) hook:

```typescript
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div>
      <p>Welcome, {user?.first_name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Authentication Flow

### 1. Login Process

When a user logs in via [`LoginPage`](../src/pages/LoginPage.tsx:13):

1. User submits credentials
2. [`AuthContext.login()`](../src/contexts/AuthContext.tsx:73) is called
3. Credentials are sent to `/auth/login` endpoint
4. On success, token is stored in localStorage
5. User data is fetched from `/users/me` endpoint **once**
6. User is redirected to home page
7. User data is now available throughout the app

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password)  // Handles both auth and user data fetch
    navigate('/home')
  } catch (err) {
    setError(err.message)
  }
}
```

### 2. Protected Routes

The [`ProtectedRoute`](../src/components/ProtectedRoute.tsx:14) component uses `AuthContext` to verify authentication:

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

**Key Benefits:**
- No redundant API calls on route changes
- Centralized authentication logic
- Automatic redirect on unauthorized access
- Loading state handling

### 3. App Initialization

On app load, [`AuthContext`](../src/contexts/AuthContext.tsx:54) automatically:

1. Checks for existing token in localStorage
2. If token exists, fetches user data from `/users/me`
3. Sets authentication state
4. If token is invalid (401), clears auth state

```typescript
useEffect(() => {
  const initAuth = async () => {
    const token = authService.getAccessToken()
    const isAuth = authService.isAuthenticated()

    if (token && isAuth) {
      await fetchCurrentUser()  // Single API call on app init
    } else {
      setLoading(false)
    }
  }

  initAuth()
}, [])
```

## Pages Using AuthContext

### HomePage ([`src/pages/HomePage.tsx`](../src/pages/HomePage.tsx:13))

```typescript
const { user } = useAuth()

const userName = user ? `${user.first_name} ${user.last_name}` : 'User'
const phoneNumber = user?.phone_number || ''
```

**Before:** Made `getCurrentUser()` API call on every page load
**After:** Uses cached user data from AuthContext

### ProfileSettingsPage ([`src/pages/ProfileSettingsPage.tsx`](../src/pages/ProfileSettingsPage.tsx:21))

```typescript
const { user, logout, loading } = useAuth()

const userData = user ? {
  userName: `${user.first_name} ${user.last_name}`,
  userEmail: user.email,
  phoneNumber: user.phone_number,
} : defaultUserData
```

**Before:** Made `getCurrentUser()` API call on page load
**After:** Uses cached user data from AuthContext

### CreateNewBillPage ([`src/pages/CreateNewBillPage.tsx`](../src/pages/CreateNewBillPage.tsx:12))

```typescript
const { user } = useAuth()
const currentUserPhone = user?.phone_number || ""
```

**Before:** Made `getCurrentUser()` API call on page load
**After:** Uses cached user data from AuthContext

## Performance Benefits

### API Call Reduction

**Before:**
- Login: 1 call to `/auth/login`
- HomePage: 1 call to `/users/me`
- ProfilePage: 1 call to `/users/me`
- CreateBillPage: 1 call to `/users/me`
- **Total: 4 API calls** (1 login + 3 user data fetches)

**After:**
- Login: 1 call to `/auth/login` + 1 call to `/users/me`
- HomePage: 0 calls (uses cached data)
- ProfilePage: 0 calls (uses cached data)
- CreateBillPage: 0 calls (uses cached data)
- **Total: 2 API calls** (1 login + 1 user data fetch)

**Result: 50% reduction in API calls**

### Additional Benefits

1. **Faster page loads**: No waiting for API calls on protected pages
2. **Better UX**: Instant access to user data
3. **Reduced server load**: Fewer requests to backend
4. **Consistent state**: Single source of truth for user data
5. **Easier maintenance**: Centralized auth logic

## Testing

### Mock AuthContext

For testing, use the mock in [`src/contexts/__mocks__/AuthContext.tsx`](../src/contexts/__mocks__/AuthContext.tsx:1):

```typescript
import { useAuth } from '../contexts/AuthContext'

// Jest will automatically use the mock
jest.mock('../contexts/AuthContext')

test('component uses auth context', () => {
  const { user } = useAuth()
  expect(user).toBeDefined()
})
```

### Customizing Mock Data

```typescript
import { setMockUser, setMockAuthenticated } from '../contexts/__mocks__/AuthContext'

beforeEach(() => {
  setMockUser({
    id: 1,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    phone_number: '+254712345678',
  })
  setMockAuthenticated(true)
})
```

## Security Considerations

1. **Token Storage**: Access tokens are stored in localStorage
2. **Token Validation**: Tokens are validated on app initialization
3. **Automatic Logout**: Invalid tokens trigger automatic logout
4. **Protected Routes**: All sensitive routes require authentication
5. **Error Handling**: 401 errors automatically clear auth state

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Offline Support**: Cache user data for offline access
3. **Role-Based Access**: Add role checking to ProtectedRoute
4. **Session Timeout**: Implement automatic logout after inactivity
5. **Multi-tab Sync**: Sync auth state across browser tabs

## Migration Guide

If you need to add a new protected page:

1. Import `useAuth` hook:
```typescript
import { useAuth } from '../contexts/AuthContext'
```

2. Access user data:
```typescript
const { user, isAuthenticated } = useAuth()
```

3. Wrap route with ProtectedRoute in App.tsx:
```typescript
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

That's it! No need to call `getCurrentUser()` or manage local state.
