import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { TabButton } from '../TabButton';
import { Home, User, Settings } from 'lucide-react';

describe('TabButton Component', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<TabButton label="Home" active={false} onClick={() => {}} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('renders as a button element', () => {
      render(<TabButton label="Profile" active={false} onClick={() => {}} />);
      expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(
        <TabButton
          label="Settings"
          icon={<Home data-testid="home-icon" />}
          active={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('renders without icon', () => {
      const { container } = render(
        <TabButton label="Account" active={false} onClick={() => {}} />
      );
      expect(screen.getByText('Account')).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('applies base styles', () => {
      render(<TabButton label="Tab" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'flex-1',
        'text-center',
        'py-2',
        'rounded-full',
        'font-medium',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'transform',
        'flex',
        'items-center',
        'justify-center',
        'gap-2'
      );
    });

    it('applies text color for all states', () => {
      render(<TabButton label="Tab" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-black');
    });
  });

  describe('Active State', () => {
    it('applies active z-index when active is true', () => {
      render(<TabButton label="Active Tab" active={true} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('z-10');
    });

    it('applies inactive z-index when active is false', () => {
      render(<TabButton label="Inactive Tab" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('z-0');
    });

    it('changes appearance when toggled from active to inactive', () => {
      const { rerender } = render(
        <TabButton label="Toggle Tab" active={true} onClick={() => {}} />
      );
      let button = screen.getByRole('button');
      expect(button).toHaveClass('z-10');

      rerender(<TabButton label="Toggle Tab" active={false} onClick={() => {}} />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('z-0');
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TabButton label="Clickable" active={false} onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when active', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TabButton label="Active Tab" active={true} onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TabButton label="Multi Click" active={false} onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('is keyboard accessible with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TabButton label="Keyboard Tab" active={false} onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is keyboard accessible with Space key', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<TabButton label="Space Tab" active={false} onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon and Label Combinations', () => {
    it('renders label and icon together', () => {
      render(
        <TabButton
          label="Home"
          icon={<Home data-testid="icon" />}
          active={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies correct text size to label', () => {
      render(<TabButton label="Profile" active={false} onClick={() => {}} />);
      const label = screen.getByText('Profile');
      expect(label).toHaveClass('text-sm');
    });

    it('applies correct size to icon wrapper', () => {
      const { container } = render(
        <TabButton
          label="Settings"
          icon={<Settings size={16} />}
          active={false}
          onClick={() => {}}
        />
      );
      // Check that icon is wrapped in span with text-sm
      const iconSpans = container.querySelectorAll('span.text-sm');
      expect(iconSpans.length).toBeGreaterThan(0);
    });

    it('renders multiple tabs with different icons', () => {
      const { rerender } = render(
        <TabButton
          label="Home"
          icon={<Home data-testid="home" />}
          active={true}
          onClick={() => {}}
        />
      );
      expect(screen.getByTestId('home')).toBeInTheDocument();

      rerender(
        <TabButton
          label="User"
          icon={<User data-testid="user" />}
          active={false}
          onClick={() => {}}
        />
      );
      expect(screen.getByTestId('user')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('centers content with flex', () => {
      render(<TabButton label="Centered" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('items-center', 'justify-center');
    });

    it('applies gap between label and icon', () => {
      render(
        <TabButton
          label="Gap Test"
          icon={<Home />}
          active={false}
          onClick={() => {}}
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('gap-2');
    });

    it('has flex-1 for equal width distribution', () => {
      render(<TabButton label="Flex" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('flex-1');
    });
  });

  describe('Accessibility', () => {
    it('is focusable', () => {
      render(<TabButton label="Focus Test" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('has proper button role', () => {
      render(<TabButton label="Role Test" active={false} onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('label is accessible to screen readers', () => {
      render(<TabButton label="Screen Reader Test" active={false} onClick={() => {}} />);
      expect(screen.getByText('Screen Reader Test')).toBeInTheDocument();
    });
  });
});
