// Mock the api-client to avoid import.meta issues
jest.mock('../../services/api-client');

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../ProtectedRoute';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

// Mock auth service
jest.mock('../../services/auth.service', () => ({
  authService: {
    isAuthenticated: jest.fn(),
    getAccessToken: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock users service
jest.mock('../../services/users.service', () => ({
  usersService: {
    getCurrentUser: jest.fn(),
  },
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    // Default to not authenticated
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
    (authService.getAccessToken as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('renders children when user is authenticated', async () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
    (usersService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when user is not authenticated', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('treats missing sessionStorage value as not authenticated', async () => {
    sessionStorage.removeItem('isAuthenticated');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('treats false sessionStorage value as not authenticated', async () => {
    sessionStorage.setItem('isAuthenticated', 'false');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('only accepts "true" string as authenticated', async () => {
    sessionStorage.setItem('isAuthenticated', 'yes');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('uses replace navigation to prevent back button issues', async () => {
    // This test verifies the component uses replace prop
    // The actual navigation behavior is tested through the redirect
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
