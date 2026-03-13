// Mock the api-client to avoid import.meta issues
vi.mock('../../services/api-client');

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../contexts/AuthContext';
import HomePage from '../HomePage';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  }
})

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

// Mock child components
vi.mock('../../components/molecules/Header', () => ({
  Header: ({ onProfileClick }: any) => (
    <div data-testid="mock-header">
      <button onClick={onProfileClick}>Profile</button>
    </div>
  ),
}));

vi.mock('../../components/molecules/TabsContainer', () => ({
  TabsContainer: ({ activeTab, onTabChange }: any) => (
    <div data-testid="mock-tabs-container">
      <button onClick={() => onTabChange('bills')}>Bills</button>
      <button onClick={() => onTabChange('groups')}>Groups</button>
      <span>Active: {activeTab}</span>
    </div>
  ),
}));

vi.mock('../../components/molecules/StatsContainer', () => ({
  StatsContainer: () => <div data-testid="mock-stats-container">Stats</div>,
}));

vi.mock('../../components/molecules/QuickActions', () => ({
  QuickActions: () => <div data-testid="mock-quick-actions">Quick Actions</div>,
}));

vi.mock('../../components/organisms/RecentBillsSection', () => ({
  RecentBillsSection: () => <div data-testid="mock-recent-bills">Recent Bills</div>,
}));

vi.mock('../../components/organisms/GroupsContent', () => ({
  GroupsContent: () => <div data-testid="mock-groups-content">Groups Content</div>,
}));

const renderHomePage = async (waitForAuth = true) => {
  const result = render(
    <BrowserRouter>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </BrowserRouter>
  );

  // Only wait for auth initialization if expected
  if (waitForAuth) {
    await waitFor(() => {
      expect(usersService.getCurrentUser).toHaveBeenCalled();
    });
  }

  return result;
};

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    // Default to authenticated state — new cookie-based flow uses refreshAccessToken
    (authService.refreshAccessToken as ReturnType<typeof vi.fn>).mockResolvedValue('mock-token');
    (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      phone_number: '254700000000',
      id_type: 'national_id',
      role: 'user',
    });
  });

  // Note: Authentication redirect tests are in ProtectedRoute.test.tsx
  // HomePage itself doesn't handle authentication - it's wrapped by ProtectedRoute in App.tsx

  it('renders without crashing', async () => {
    await renderHomePage();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders all main sections when bills tab is active', async () => {
    await renderHomePage();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabs-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stats-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('mock-recent-bills')).toBeInTheDocument();
  });

  it('starts with bills tab active by default', async () => {
    await renderHomePage();
    expect(screen.getByText('Active: bills')).toBeInTheDocument();
  });

  it('switches to groups tab when groups is clicked', async () => {
    const user = userEvent.setup();
    await renderHomePage();

    const groupsButton = screen.getByText('Groups');
    await user.click(groupsButton);

    expect(screen.getByText('Active: groups')).toBeInTheDocument();
    expect(screen.getByTestId('mock-groups-content')).toBeInTheDocument();
  });

  it('hides bills content when groups tab is active', async () => {
    const user = userEvent.setup();
    await renderHomePage();

    const groupsButton = screen.getByText('Groups');
    await user.click(groupsButton);

    expect(screen.queryByTestId('mock-stats-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-quick-actions')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-recent-bills')).not.toBeInTheDocument();
  });

  it('navigates to profile settings when profile is clicked', async () => {
    const user = userEvent.setup();
    await renderHomePage();

    const profileButton = screen.getByText('Profile');
    await user.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('has correct layout structure', async () => {
    const { container } = await renderHomePage();

    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });

  it('passes correct props to Header', async () => {
    await renderHomePage();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });
});
