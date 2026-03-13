import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { EmptyBillsState } from '../EmptyBillsState';

// Mock the Button component
vi.mock('../../atoms/Button', () => ({
  Button: ({ children, variant, fullWidth, className, onClick }: any) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-fullwidth={fullWidth?.toString()}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe('EmptyBillsState', () => {
  describe('Rendering', () => {
    it('renders the empty state message', () => {
      render(<EmptyBillsState />);
      expect(screen.getByText('No bills yet')).toBeInTheDocument();
    });

    it('renders the create bill button', () => {
      render(<EmptyBillsState />);
      expect(screen.getByText('Create Your First Bill')).toBeInTheDocument();
    });

    it('renders the dollar sign icon', () => {
      const { container } = render(<EmptyBillsState />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders button with correct variant', () => {
      render(<EmptyBillsState />);
      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    it('renders button with fullWidth prop', () => {
      render(<EmptyBillsState />);
      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-fullwidth', 'true');
    });

    it('renders button with custom className', () => {
      render(<EmptyBillsState />);
      const button = screen.getByTestId('button');
      expect(button).toHaveClass('empty-primary-btn');
    });
  });

  describe('Layout', () => {
    it('applies correct container classes', () => {
      const { container } = render(<EmptyBillsState />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'py-12');
    });

    it('centers content vertically and horizontally', () => {
      const { container } = render(<EmptyBillsState />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('items-center', 'justify-center');
    });
  });

  describe('Styling', () => {
    it('applies correct text color to message', () => {
      render(<EmptyBillsState />);
      const message = screen.getByText('No bills yet');
      expect(message).toHaveClass('text-gray-600');
    });

    it('applies correct icon size and color', () => {
      const { container } = render(<EmptyBillsState />);
      const icon = container.querySelector('svg');
      expect(icon).toHaveClass('text-gray-300');
    });
  });
});
