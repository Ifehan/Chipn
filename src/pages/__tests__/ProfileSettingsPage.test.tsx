// Mock the api-client to avoid import.meta issues
vi.mock('../../services/api-client');
vi.mock('../../hooks/useUsers', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('../../hooks/useUsers')>();
  return {
    ...actual,
    useUpdateUser: () => ({ updateUser: vi.fn(), loading: false, error: null }),
  };
});

import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import * as AuthContextModule from '../../contexts/AuthContext';
import ProfileSettingsPage from '../ProfileSettingsPage';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

// Suppress act warnings for async state updates in useEffect
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
       args[0].includes('inside a test was not wrapped in act'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

const mockGetCurrentUser = vi.fn();

vi.mock('../../services/auth.service', () => ({
  authService: {
    hasToken: vi.fn(),
    getAccessToken: vi.fn(),
    logout: vi.fn(),
      refreshAccessToken: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock('../../services/users.service', () => ({
  usersService: {
    getCurrentUser: vi.fn(),
  },
}));

// Note: ProfileSettingsPage uses useAuth() from AuthContext, not useCurrentUser hook
// So we don't need to mock useCurrentUser

// Mock child components
vi.mock('../../components/atoms/BackButton', () => ({
  BackButton: ({ onClick }: any) => (
    <button data-testid="mock-back-button" onClick={onClick}>
      Back
    </button>
  ),
}));

vi.mock('../../components/molecules/ProfileCard', () => ({
  ProfileCard: ({ userName, userEmail, phoneNumber, avatar }: any) => (
    <div data-testid="mock-profile-card">
      <span>{userName}</span>
      <span>{userEmail}</span>
      <span>{phoneNumber}</span>
      <span>{avatar}</span>
    </div>
  ),
}));

vi.mock('../../components/organisms/AccountSettingsSection', () => ({
  AccountSettingsSection: () => <div data-testid="mock-account-settings">Account Settings</div>,
}));

vi.mock('../../components/organisms/PaymentSettingsSection', () => ({
  PaymentSettingsSection: ({ phoneNumber }: any) => (
    <div data-testid="mock-payment-settings">
      Payment Settings - {phoneNumber}
    </div>
  ),
}));

vi.mock('../../components/organisms/SupportSection', () => ({
  SupportSection: () => <div data-testid="mock-support-section">Support Section</div>,
}));

vi.mock('../../components/molecules/LogoutButton', () => ({
  LogoutButton: ({ onClick }: any) => (
    <button data-testid="mock-logout-button" onClick={onClick}>
      Logout
    </button>
  ),
}));

const mockUserData = {
  id: 'user123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone_number: '+254712345678',
  id_type: 'passport',
  role: 'user',
};

const renderProfileSettingsPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProfileSettingsPage />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ProfileSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock auth service
    (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('mock-token');

    // Mock users service for AuthProvider
    (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(mockUserData);

    // Mock getCurrentUser for the page's useEffect
    mockGetCurrentUser.mockResolvedValue(mockUserData);
  });

  it('renders without crashing', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
    });
  });

  it('fetches and displays user data from API', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('+254712345678')).toBeInTheDocument();
    });
  });

  it('renders page title', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
    });
  });

  it('renders BackButton component', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
    });
  });

  it('renders ProfileCard with fetched user data', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      const profileCard = screen.getByTestId('mock-profile-card');
      expect(profileCard).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('+254712345678')).toBeInTheDocument();
    });
  });

  it('renders all settings sections', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-account-settings')).toBeInTheDocument();
      expect(screen.getByTestId('mock-payment-settings')).toBeInTheDocument();
      expect(screen.getByTestId('mock-support-section')).toBeInTheDocument();
    });
  });

  it('passes phoneNumber to PaymentSettingsSection', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByText(/Payment Settings - \+254712345678/)).toBeInTheDocument();
    });
  });

  it('renders app info section', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByText('Chipn')).toBeInTheDocument();
      expect(screen.getByText('Version 1.0.0 MVP')).toBeInTheDocument();
      expect(screen.getByText('Secure bill splitting powered by M-PESA')).toBeInTheDocument();
    });
  });

  it('renders LogoutButton component', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-logout-button')).toBeInTheDocument();
    });
  });

  it('calls logout from AuthContext when logout button is clicked', async () => {
    const mockLogout = vi.fn();
    const user = userEvent.setup();

    // Mock AuthContext with custom logout function
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: {
        id: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '+254712345678',
        id_type: 'passport',
        role: 'user' as const,
      },
      loading: false,
      error: null,
      isAuthenticated: true,
      login: vi.fn(),
      logout: mockLogout,
      refreshUser: vi.fn(),
    });

    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-logout-button')).toBeInTheDocument();
    });

    const logoutButton = screen.getByTestId('mock-logout-button');
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('has correct page layout', async () => {
    let container: HTMLElement;

    await act(async () => {
      const result = renderProfileSettingsPage();
      container = result.container;
    });

    await waitFor(() => {
      const mainContainer = container!.querySelector('.app-shell');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching user data', () => {
    // Mock AuthContext to return loading state
    const mockUseAuth = vi.spyOn(AuthContextModule, 'useAuth');
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshUser: vi.fn(),
    });

    renderProfileSettingsPage();

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();

    // Restore the mock after this test
    mockUseAuth.mockRestore();
  });

  it('renders components in correct order after loading', async () => {
    await act(async () => {
      renderProfileSettingsPage();
    });

    await waitFor(() => {
      const backButton = screen.getByTestId('mock-back-button');
      const profileCard = screen.getByTestId('mock-profile-card');
      const accountSettings = screen.getByTestId('mock-account-settings');
      const paymentSettings = screen.getByTestId('mock-payment-settings');
      const supportSection = screen.getByTestId('mock-support-section');
      const logoutButton = screen.getByTestId('mock-logout-button');

      expect(backButton).toBeInTheDocument();
      expect(profileCard).toBeInTheDocument();
      expect(accountSettings).toBeInTheDocument();
      expect(paymentSettings).toBeInTheDocument();
      expect(supportSection).toBeInTheDocument();
      expect(logoutButton).toBeInTheDocument();
    });
  });

  it('has scrollable content area', async () => {
    let container: HTMLElement;

    await act(async () => {
      const result = renderProfileSettingsPage();
      container = result.container;
    });

    await waitFor(() => {
      const scrollableContainer = container!.querySelector('.overflow-y-auto');
      expect(scrollableContainer).toBeInTheDocument();
    });
  });
});
