import React from 'react';
import { render, screen } from '@/test-utils';
import { SupportSection } from '../SupportSection';

// Mock the child components
jest.mock('../../molecules/SectionCard', () => ({
  SectionCard: ({ title, icon, children }: any) => (
    <div data-testid="section-card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

jest.mock('../../atoms/SettingItem', () => ({
  SettingItem: ({ icon, label }: any) => (
    <div data-testid="setting-item">
      <span>{label}</span>
    </div>
  ),
}));

describe('SupportSection', () => {
  describe('Rendering', () => {
    it('renders the section with correct title', () => {
      render(<SupportSection />);
      expect(screen.getByText('Support & Help')).toBeInTheDocument();
    });

    it('renders all setting items', () => {
      render(<SupportSection />);
      const settingItems = screen.getAllByTestId('setting-item');
      expect(settingItems).toHaveLength(3);
    });

    it('renders Help Center setting', () => {
      render(<SupportSection />);
      expect(screen.getByText('Help Center')).toBeInTheDocument();
    });

    it('renders Contact Support setting', () => {
      render(<SupportSection />);
      expect(screen.getByText('Contact Support')).toBeInTheDocument();
    });

    it('renders Terms & Conditions setting', () => {
      render(<SupportSection />);
      expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    });

    it('renders section card component', () => {
      render(<SupportSection />);
      expect(screen.getByTestId('section-card')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('renders settings in correct order', () => {
      render(<SupportSection />);
      const settingItems = screen.getAllByTestId('setting-item');

      expect(settingItems[0]).toHaveTextContent('Help Center');
      expect(settingItems[1]).toHaveTextContent('Contact Support');
      expect(settingItems[2]).toHaveTextContent('Terms & Conditions');
    });

    it('wraps settings in a container with correct spacing', () => {
      const { container } = render(<SupportSection />);
      const settingsContainer = container.querySelector('.space-y-0');
      expect(settingsContainer).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('passes correct props to SectionCard', () => {
      render(<SupportSection />);
      const sectionCard = screen.getByTestId('section-card');
      expect(sectionCard).toBeInTheDocument();
      expect(screen.getByText('Support & Help')).toBeInTheDocument();
    });

    it('renders all child components without errors', () => {
      const { container } = render(<SupportSection />);
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getAllByTestId('setting-item')).toHaveLength(3);
    });
  });
});
