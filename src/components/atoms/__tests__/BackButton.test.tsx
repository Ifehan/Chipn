import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { BackButton } from '../BackButton';

describe('BackButton Component', () => {
  describe('Rendering', () => {
    it('renders with default aria-label', () => {
      render(<BackButton onClick={() => {}} />);
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      render(<BackButton onClick={() => {}} label="Return to home" />);
      expect(screen.getByRole('button', { name: /return to home/i })).toBeInTheDocument();
    });

    it('renders the ArrowLeft icon', () => {
      const { container } = render(<BackButton onClick={() => {}} />);
      // Check for the svg element with the class text-slate-900
      const svg = container.querySelector('svg.text-slate-900');
      expect(svg).toBeInTheDocument();
    });

    it('applies base button styles', () => {
      render(<BackButton onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'w-8',
        'h-8',
        'flex',
        'items-center',
        'justify-center',
        'rounded',
        'hover:bg-gray-100',
        'transition-colors'
      );
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<BackButton onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick multiple times when clicked multiple times', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<BackButton onClick={handleClick} />);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<BackButton onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers onClick on Space key press', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<BackButton onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for screen readers', () => {
      render(<BackButton onClick={() => {}} label="Navigate back" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Navigate back');
    });

    it('is focusable by default', () => {
      render(<BackButton onClick={() => {}} />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('tabindex', '-1');
    });
  });
});
