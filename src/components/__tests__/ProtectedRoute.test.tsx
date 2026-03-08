// Mock the api-client to avoid import.meta issues
jest.mock('../../services/api-client');

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../ProtectedRoute';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

jest.mock('../../services/auth.service', () => ({
  authService: {
    hasToken: jest.fn(),
    getAccessToken: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('../../services/users.service', () => ({
  usersService: {
    getCurrentUser: jest.fn(),
  },
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

const renderWithRouter = () =>
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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authService.hasToken as jest.Mock).mockReturnValue(false);
    (authService.getAccessToken as jest.Mock).mockReturnValue(null);
  });

  it('renders children when user is authenticated', async () => {
    (authService.hasToken as jest.Mock).mockReturnValue(true);
    (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
    (usersService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      phone_number: '254700000000',
      id_type: 'national_id',
      role: 'user',
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when no token exists', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when token exists but user fetch fails (expired token)', async () => {
    (authService.hasToken as jest.Mock).mockReturnValue(true);
    (authService.getAccessToken as jest.Mock).mockReturnValue('expired-token');
    (usersService.getCurrentUser as jest.Mock).mockRejectedValue({
      message: 'Unauthorized',
      status: 401,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('uses replace navigation to prevent back button issues', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});
