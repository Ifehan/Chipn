import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders without label', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" placeholder="Enter email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(<Input icon="📧" placeholder="Enter email" />);
      const input = screen.getByPlaceholderText(/enter email/i);
      expect(input).toHaveClass('pl-10');
    });

    it('renders without icon padding when no icon provided', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).not.toHaveClass('pl-10');
    });

    it('renders error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
      expect(screen.getByText(/this field is required/i)).toHaveClass('text-red-500');
    });

    it('renders help text', () => {
      render(<Input helpText="Enter at least 8 characters" />);
      expect(screen.getByText(/enter at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/enter at least 8 characters/i)).toHaveClass('text-gray-500');
    });

    it('applies custom className', () => {
      render(<Input className="custom-class" data-testid="custom-input" />);
      const input = screen.getByTestId('custom-input');
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Password Toggle', () => {
    it('renders password toggle button when showPasswordToggle is true', () => {
      render(<Input type="password" showPasswordToggle placeholder="Enter password" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not render password toggle button when showPasswordToggle is false', () => {
      render(<Input type="password" placeholder="Enter password" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('toggles password visibility when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<Input type="password" showPasswordToggle placeholder="Enter password" />);

      const input = screen.getByPlaceholderText(/enter password/i);
      const toggleButton = screen.getByRole('button');

      // Initially should be password type
      expect(input).toHaveAttribute('type', 'password');

      // Click to show password
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');

      // Click again to hide password
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('does not render toggle for non-password type inputs', () => {
      render(<Input type="text" showPasswordToggle placeholder="Enter text" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('accepts user input', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText(/enter text/i);
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input placeholder="Enter text" onChange={handleChange} />);

      const input = screen.getByPlaceholderText(/enter text/i);
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus handler', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      render(<Input placeholder="Enter text" onFocus={handleFocus} />);

      const input = screen.getByPlaceholderText(/enter text/i);
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur handler', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<Input placeholder="Enter text" onBlur={handleBlur} />);

      const input = screen.getByPlaceholderText(/enter text/i);
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
      render(<Input placeholder="Enter text" disabled />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toBeDisabled();
    });

    it('respects value prop for controlled input', () => {
      render(<Input placeholder="Enter text" value="controlled value" onChange={() => {}} />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toHaveValue('controlled value');
    });
  });

  describe('Input Types', () => {
    it('defaults to text type', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toHaveAttribute('type', 'text');
    });

    it('accepts email type', () => {
      render(<Input type="email" placeholder="Enter email" />);
      const input = screen.getByPlaceholderText(/enter email/i);
      expect(input).toHaveAttribute('type', 'email');
    });

    it('accepts number type', () => {
      render(<Input type="number" placeholder="Enter number" />);
      const input = screen.getByPlaceholderText(/enter number/i);
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<Input label="Email Address" />);
      const input = screen.getByLabelText(/email address/i);
      expect(input).toBeInTheDocument();
    });

    it('supports aria-label', () => {
      render(<Input aria-label="Search field" />);
      const input = screen.getByLabelText(/search field/i);
      expect(input).toBeInTheDocument();
    });

    it('supports aria-describedby for error messages', () => {
      render(<Input error="Error message" aria-describedby="error-msg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'error-msg');
    });
  });
});
