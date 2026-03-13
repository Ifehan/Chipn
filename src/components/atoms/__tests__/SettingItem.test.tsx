import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { SettingItem } from '../SettingItem';
import { Settings, Bell, Shield } from 'lucide-react';

describe('SettingItem Component', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<SettingItem icon={Settings} label="Account Settings" />);
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
    });

    it('renders the provided icon', () => {
      const { container } = render(<SettingItem icon={Bell} label="Notifications" />);
      const svg = container.querySelector('svg.text-slate-700');
      expect(svg).toBeInTheDocument();
    });

    it('renders as a button element', () => {
      render(<SettingItem icon={Settings} label="Settings" />);
      expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });

    it('applies base styles', () => {
      render(<SettingItem icon={Settings} label="Settings" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'w-full',
        'py-3.5',
        'flex',
        'items-center',
        'gap-3',
        'hover:bg-gray-50',
        'transition-colors',
        'text-left'
      );
    });

    it('applies text styles to label', () => {
      render(<SettingItem icon={Settings} label="Privacy Settings" />);
      const label = screen.getByText('Privacy Settings');
      expect(label).toHaveClass('text-sm', 'text-slate-900', 'font-normal');
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<SettingItem icon={Settings} label="Settings" onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times when clicked multiple times', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<SettingItem icon={Bell} label="Notifications" onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('does not call onClick when onClick is not provided', async () => {
      const user = userEvent.setup();
      const { container } = render(<SettingItem icon={Settings} label="Settings" />);
      const button = screen.getByRole('button');

      // Should not throw error
      await user.click(button);
      expect(container).toBeInTheDocument();
    });

    it('is keyboard accessible with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<SettingItem icon={Settings} label="Settings" onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is keyboard accessible with Space key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<SettingItem icon={Shield} label="Security" onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Different Icons', () => {
    it('renders with Settings icon', () => {
      const { container } = render(<SettingItem icon={Settings} label="Settings" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with Bell icon', () => {
      const { container } = render(<SettingItem icon={Bell} label="Notifications" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with Shield icon', () => {
      const { container } = render(<SettingItem icon={Shield} label="Security" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('button is focusable', () => {
      render(<SettingItem icon={Settings} label="Settings" />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('has proper text alignment for screen readers', () => {
      render(<SettingItem icon={Settings} label="Account Settings" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-left');
    });

    it('label is accessible to screen readers', () => {
      render(<SettingItem icon={Settings} label="Privacy & Security" />);
      expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
    });
  });
});
