import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';

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

jest.mock('../ProfileSettingsPage', () => ({
  ProfileSettingsPage: ({ onBack }: any) => (
    <div data-testid="mock-profile-settings">
      <button onClick={onBack}>Back from Profile</button>
    </div>
  ),
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
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

  it('shows profile settings page when profile is clicked', async () => {
    const user = userEvent.setup();
    renderHomePage();

    const profileButton = screen.getByText('Profile');
    await user.click(profileButton);

    expect(screen.getByTestId('mock-profile-settings')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
  });

  it('returns to home page from profile settings', async () => {
    const user = userEvent.setup();
    renderHomePage();

    // Navigate to profile
    const profileButton = screen.getByText('Profile');
    await user.click(profileButton);

    // Navigate back
    const backButton = screen.getByText('Back from Profile');
    await user.click(backButton);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-profile-settings')).not.toBeInTheDocument();
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
