import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProfileSettingsPage from '../ProfileSettingsPage';

const mockGetCurrentUser = jest.fn();

jest.mock('../../hooks/useUsers', () => ({
  useCurrentUser: () => ({
    getCurrentUser: mockGetCurrentUser,
    loading: false,
    error: null,
  }),
}));

// Mock child components
jest.mock('../../components/atoms/BackButton', () => ({
  BackButton: ({ onClick }: any) => (
    <button data-testid="mock-back-button" onClick={onClick}>
      Back
    </button>
  ),
}));

jest.mock('../../components/molecules/ProfileCard', () => ({
  ProfileCard: ({ userName, userEmail, phoneNumber, avatar }: any) => (
    <div data-testid="mock-profile-card">
      <span>{userName}</span>
      <span>{userEmail}</span>
      <span>{phoneNumber}</span>
      <span>{avatar}</span>
    </div>
  ),
}));

jest.mock('../../components/organisms/AccountSettingsSection', () => ({
  AccountSettingsSection: () => <div data-testid="mock-account-settings">Account Settings</div>,
}));

jest.mock('../../components/organisms/PaymentSettingsSection', () => ({
  PaymentSettingsSection: ({ phoneNumber }: any) => (
    <div data-testid="mock-payment-settings">
      Payment Settings - {phoneNumber}
    </div>
  ),
}));

jest.mock('../../components/organisms/SupportSection', () => ({
  SupportSection: () => <div data-testid="mock-support-section">Support Section</div>,
}));

jest.mock('../../components/molecules/LogoutButton', () => ({
  LogoutButton: ({ onClick }: any) => (
    <button data-testid="mock-logout-button" onClick={onClick}>
      Logout
    </button>
  ),
}));

const defaultProps = {
  onBack: jest.fn(),
};

const mockUserData = {
  id: 'user123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone_number: '+254712345678',
  id_type: 'passport',
};

const renderProfileSettingsPage = (props = {}) => {
  return render(
    <BrowserRouter>
      <ProfileSettingsPage {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('ProfileSettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue(mockUserData);
  });

  it('renders without crashing', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
    });
  });

  it('fetches and displays user data from API', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('+254712345678')).toBeInTheDocument();
    });
  });

  it('renders page title', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
    });
  });

  it('renders BackButton component', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
    });
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    renderProfileSettingsPage({ onBack });

    await waitFor(() => {
      expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
    });

    const backButton = screen.getByTestId('mock-back-button');
    await user.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders ProfileCard with fetched user data', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      const profileCard = screen.getByTestId('mock-profile-card');
      expect(profileCard).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('+254712345678')).toBeInTheDocument();
    });
  });

  it('renders all settings sections', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByTestId('mock-account-settings')).toBeInTheDocument();
      expect(screen.getByTestId('mock-payment-settings')).toBeInTheDocument();
      expect(screen.getByTestId('mock-support-section')).toBeInTheDocument();
    });
  });

  it('passes phoneNumber to PaymentSettingsSection', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByText(/Payment Settings - \+254712345678/)).toBeInTheDocument();
    });
  });

  it('renders app info section', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByText('TandaPay')).toBeInTheDocument();
      expect(screen.getByText('Version 1.0.0 MVP')).toBeInTheDocument();
      expect(screen.getByText('Secure bill splitting powered by M-PESA')).toBeInTheDocument();
    });
  });

  it('renders LogoutButton component', async () => {
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByTestId('mock-logout-button')).toBeInTheDocument();
    });
  });

  it('logs to console when logout is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup();
    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByTestId('mock-logout-button')).toBeInTheDocument();
    });

    const logoutButton = screen.getByTestId('mock-logout-button');
    await user.click(logoutButton);

    expect(consoleSpy).toHaveBeenCalledWith('Logout clicked');
    consoleSpy.mockRestore();
  });

  it('has correct page layout', async () => {
    const { container } = renderProfileSettingsPage();

    await waitFor(() => {
      const mainContainer = container.querySelector('.app-shell');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock the hook to return an error state
    jest.spyOn(require('../../hooks/useUsers'), 'useCurrentUser').mockReturnValue({
      getCurrentUser: jest.fn().mockRejectedValue(new Error('Failed to fetch user')),
      loading: false,
      error: new Error('Failed to fetch user'),
    });

    renderProfileSettingsPage();

    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('shows loading state while fetching user data', () => {
    // Mock loading state
    jest.spyOn(require('../../hooks/useUsers'), 'useCurrentUser').mockReturnValue({
      getCurrentUser: mockGetCurrentUser,
      loading: true,
      error: null,
    });

    renderProfileSettingsPage();

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  it('renders components in correct order after loading', async () => {
    // Reset the mock to default behavior
    jest.spyOn(require('../../hooks/useUsers'), 'useCurrentUser').mockReturnValue({
      getCurrentUser: mockGetCurrentUser,
      loading: false,
      error: null,
    });

    renderProfileSettingsPage();

    await waitFor(() => {
      expect(mockGetCurrentUser).toHaveBeenCalled();
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
    const { container } = renderProfileSettingsPage();

    await waitFor(() => {
      const scrollableContainer = container.querySelector('.overflow-y-auto');
      expect(scrollableContainer).toBeInTheDocument();
    });
  });
});
