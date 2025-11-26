import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';
import { authService } from '../../services/auth.service';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../services/auth.service', () => ({
  authService: {
    isAuthenticated: jest.fn(),
    getAccessToken: jest.fn(),
  },
}));

// Mock child components
jest.mock('../../components/molecules/Header', () => ({
  Header: ({ onProfileClick }: any) => (
    <div data-testid="mock-header">
      <button onClick={onProfileClick}>Profile</button>
    </div>
  ),
}));

jest.mock('../../components/molecules/TabsContainer', () => ({
  TabsContainer: ({ activeTab, onTabChange }: any) => (
    <div data-testid="mock-tabs-container">
      <button onClick={() => onTabChange('bills')}>Bills</button>
      <button onClick={() => onTabChange('groups')}>Groups</button>
      <span>Active: {activeTab}</span>
    </div>
  ),
}));

jest.mock('../../components/molecules/StatsContainer', () => ({
  StatsContainer: () => <div data-testid="mock-stats-container">Stats</div>,
}));

jest.mock('../../components/molecules/QuickActions', () => ({
  QuickActions: () => <div data-testid="mock-quick-actions">Quick Actions</div>,
}));

jest.mock('../../components/organisms/RecentBillsSection', () => ({
  RecentBillsSection: () => <div data-testid="mock-recent-bills">Recent Bills</div>,
}));

jest.mock('../../components/organisms/GroupsContent', () => ({
  GroupsContent: () => <div data-testid="mock-groups-content">Groups Content</div>,
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
    // Default to authenticated state
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');
  });

  describe('Authentication', () => {
    it('redirects to login when user is not authenticated', () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');

      renderHomePage();

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('redirects to login when no token is present', () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);

      renderHomePage();

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('redirects to login when both authentication and token are missing', () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
      (authService.getAccessToken as jest.Mock).mockReturnValue(null);

      renderHomePage();

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('does not redirect when user is authenticated with valid token', () => {
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getAccessToken as jest.Mock).mockReturnValue('mock-token');

      renderHomePage();

      expect(mockNavigate).not.toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('renders without crashing', () => {
    renderHomePage();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders all main sections when bills tab is active', () => {
    renderHomePage();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabs-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stats-container')).toBeInTheDocument();
    expect(screen.getByTestId('mock-quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('mock-recent-bills')).toBeInTheDocument();
  });

  it('starts with bills tab active by default', () => {
    renderHomePage();
    expect(screen.getByText('Active: bills')).toBeInTheDocument();
  });

  it('switches to groups tab when groups is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const groupsButton = screen.getByText('Groups');
    await user.click(groupsButton);

    expect(screen.getByText('Active: groups')).toBeInTheDocument();
    expect(screen.getByTestId('mock-groups-content')).toBeInTheDocument();
  });

  it('hides bills content when groups tab is active', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const groupsButton = screen.getByText('Groups');
    await user.click(groupsButton);

    expect(screen.queryByTestId('mock-stats-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-quick-actions')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-recent-bills')).not.toBeInTheDocument();
  });

  it('navigates to profile settings when profile is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const profileButton = screen.getByText('Profile');
    await user.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('has correct layout structure', () => {
    const { container } = renderHomePage();

    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });

  it('passes correct props to Header', () => {
    renderHomePage();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });
});
