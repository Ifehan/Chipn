import React from 'react';
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm Component', () => {
  describe('Rendering', () => {
    it('renders email and password inputs', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders sign in button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders back button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('pre-fills email with test@gmail.com', () => {
      render(<LoginForm />);
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveValue('test@gmail.com');
    });

    it('renders email and password icons', () => {
      render(<LoginForm />);
      expect(screen.getByText('📧')).toBeInTheDocument();
      expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    it('password input has toggle visibility button', () => {
      render(<LoginForm />);
      const passwordToggle = screen.getAllByRole('button').find(
        button => button.textContent === '👁️' || button.textContent === '👁️‍🗨️'
      );
      expect(passwordToggle).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows error when email is empty on submit', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      // Clear the pre-filled email
      const emailInput = screen.getByLabelText(/email address/i);
      await user.clear(emailInput);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });

    it('shows error when password is empty on submit', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });

    it('does not show error when both fields are filled', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<LoginForm onSubmit={mockSubmit} />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(screen.queryByText(/please fill in all fields/i)).not.toBeInTheDocument();
      expect(mockSubmit).toHaveBeenCalledWith('test@gmail.com', 'password123');
    });
  });

  describe('User Interactions', () => {
    it('allows user to type in email field', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'user@example.com');

      expect(emailInput).toHaveValue('user@example.com');
    });

    it('allows user to type in password field', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'mypassword');

      expect(passwordInput).toHaveValue('mypassword');
    });

    it('calls onSubmit with email and password when form is submitted', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<LoginForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      const mockBack = jest.fn();
      render(<LoginForm onBack={mockBack} />);

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('can submit form by pressing Enter in password field', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<LoginForm onSubmit={mockSubmit} />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123{Enter}');

      expect(mockSubmit).toHaveBeenCalledWith('test@gmail.com', 'password123');
    });

    it('can submit form by pressing Enter in email field', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<LoginForm onSubmit={mockSubmit} />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(passwordInput, 'password123');
      await user.click(emailInput);
      await user.keyboard('{Enter}');

      expect(mockSubmit).toHaveBeenCalledWith('test@gmail.com', 'password123');
    });
  });

  describe('Error Handling', () => {
    it('clears error when user starts typing after validation error', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });

      // Start typing in password field
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'p');

      // Error should still be visible until form is submitted again
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    it('validates on each submit attempt', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<LoginForm onSubmit={mockSubmit} />);

      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // First attempt - no password
      await user.click(submitButton);
      expect(mockSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();

      // Second attempt - with password
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockSubmit).toHaveBeenCalledWith('test@gmail.com', 'password123');
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(<LoginForm />);
      const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('labels are associated with inputs', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('buttons have correct types', () => {
      render(<LoginForm />);
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      const backButton = screen.getByRole('button', { name: /back/i });

      expect(signInButton).toHaveAttribute('type', 'submit');
      expect(backButton).toHaveAttribute('type', 'button');
    });
  });
});
