import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies primary variant styles by default', () => {
      render(<Button>Primary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-green-600', 'text-white');
    });

    it('applies secondary variant styles when specified', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100', 'text-gray-900');
    });

    it('applies outline variant styles when specified', () => {
      render(<Button variant="outline">Outline Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-gray-300');
    });

    it('applies full width styles when fullWidth is true', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not apply full width styles by default', () => {
      render(<Button>Normal Button</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('applies base styles to all buttons', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-3', 'rounded-lg', 'font-medium', 'transition-colors');
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Click Me</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('HTML Button Attributes', () => {
    it('passes through type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('defaults to button type', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('passes through aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toBeInTheDocument();
    });

    it('passes through data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });
  });
});
