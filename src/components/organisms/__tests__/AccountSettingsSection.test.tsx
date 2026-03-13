import React from 'react';
import { render, screen } from '@/test-utils';
import { AccountSettingsSection } from '../AccountSettingsSection';

// Mock the child components
vi.mock('../../molecules/SectionCard', () => ({
  SectionCard: ({ title, icon, children }: any) => (
    <div data-testid="section-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock('../../atoms/SettingItem', () => ({
  SettingItem: ({ icon, label }: any) => (
    <div data-testid="setting-item">
      <span>{label}</span>
    </div>
  ),
}));

describe('AccountSettingsSection', () => {
  it('renders the section with correct title', () => {
    render(<AccountSettingsSection />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('renders all setting items', () => {
    render(<AccountSettingsSection />);
    const settingItems = screen.getAllByTestId('setting-item');
    expect(settingItems).toHaveLength(3);
  });

  it('renders Edit Profile setting', () => {
    render(<AccountSettingsSection />);
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('renders Notification Settings setting', () => {
    render(<AccountSettingsSection />);
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  it('renders Privacy & Security setting', () => {
    render(<AccountSettingsSection />);
    expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
  });

  it('renders section card component', () => {
    render(<AccountSettingsSection />);
    expect(screen.getByTestId('section-card')).toBeInTheDocument();
  });
});
