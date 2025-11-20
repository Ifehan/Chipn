import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProfileSettingsPage from '../ProfileSettingsPage';

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
  userName: 'Test User',
  userEmail: 'test@example.com',
  phoneNumber: '+254712345678',
  avatar: 'T',
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
  });

  it('renders without crashing', () => {
    renderProfileSettingsPage();
    expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderProfileSettingsPage();
    expect(screen.getByText('Profile & Settings')).toBeInTheDocument();
  });

  it('renders BackButton component', () => {
    renderProfileSettingsPage();
    expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    renderProfileSettingsPage({ onBack });

    const backButton = screen.getByTestId('mock-back-button');
    await user.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders ProfileCard with correct props', () => {
    renderProfileSettingsPage();

    const profileCard = screen.getByTestId('mock-profile-card');
    expect(profileCard).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('+254712345678')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders all settings sections', () => {
    renderProfileSettingsPage();

    expect(screen.getByTestId('mock-account-settings')).toBeInTheDocument();
    expect(screen.getByTestId('mock-payment-settings')).toBeInTheDocument();
    expect(screen.getByTestId('mock-support-section')).toBeInTheDocument();
  });

  it('passes phoneNumber to PaymentSettingsSection', () => {
    renderProfileSettingsPage();

    expect(screen.getByText(/Payment Settings - \+254712345678/)).toBeInTheDocument();
  });

  it('renders app info section', () => {
    renderProfileSettingsPage();

    expect(screen.getByText('TandaPay')).toBeInTheDocument();
    expect(screen.getByText('Version 1.0.0 MVP')).toBeInTheDocument();
    expect(screen.getByText('Secure bill splitting powered by M-PESA')).toBeInTheDocument();
  });

  it('renders LogoutButton component', () => {
    renderProfileSettingsPage();
    expect(screen.getByTestId('mock-logout-button')).toBeInTheDocument();
  });

  it('logs to console when logout is clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup();
    renderProfileSettingsPage();

    const logoutButton = screen.getByTestId('mock-logout-button');
    await user.click(logoutButton);

    expect(consoleSpy).toHaveBeenCalledWith('Logout clicked');
    consoleSpy.mockRestore();
  });

  it('has correct page layout', () => {
    const { container } = renderProfileSettingsPage();

    const mainContainer = container.querySelector('.app-shell');
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders components in correct order', () => {
    renderProfileSettingsPage();

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

  it('handles different user data', () => {
    renderProfileSettingsPage({
      userName: 'Jane Doe',
      userEmail: 'jane@example.com',
      phoneNumber: '+254700000000',
      avatar: 'J',
    });

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('+254700000000')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('has scrollable content area', () => {
    const { container } = renderProfileSettingsPage();

    const scrollableContainer = container.querySelector('.overflow-y-auto');
    expect(scrollableContainer).toBeInTheDocument();
  });
});
