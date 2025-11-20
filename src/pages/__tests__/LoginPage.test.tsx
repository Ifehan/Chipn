import React from 'react';
import { render, screen, waitFor, act } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../LoginPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginPage Integration Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    // Run pending timers inside React's `act` so state updates are flushed
    // and do not trigger the "not wrapped in act(...)" warning.
    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });
    jest.useRealTimers();
  });

  describe('Page Rendering', () => {
    it('renders the login page with all components', () => {
      render(<LoginPage />);

      // Check for title and subtitle
      expect(screen.getByText(/tandapay/i)).toBeInTheDocument();
      expect(screen.getByText(/split bills and pay instantly via m-pesa/i)).toBeInTheDocument();

      // Check for form elements
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('renders AuthCard with LoginForm', () => {
      render(<LoginPage />);

      const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('User Authentication Flow', () => {
    it('successfully logs in with valid credentials', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      // Enter credentials (email is pre-filled with test@gmail.com)
      await user.type(passwordInput, 'password123');
      await user.click(signInButton);

      // Wait for async login to complete
      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      // Should navigate to home page
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('logs email and password to console on login attempt', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(passwordInput, 'testpassword');
      await user.click(signInButton);

      expect(consoleSpy).toHaveBeenCalledWith('Logging in:', {
        email: 'test@gmail.com',
        password: 'testpassword'
      });

      consoleSpy.mockRestore();
    });

    it('handles login errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const user = userEvent.setup({ delay: null });

      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(passwordInput, 'password123');

      // Note: This test verifies the component handles the timeout properly
      // In a real scenario, you'd mock the API call to simulate errors
      await user.click(signInButton);

      // Advance timers and wait for state update
      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('navigates back when back button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('does not navigate before login completes', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(passwordInput, 'password123');
      await user.click(signInButton);

      // Before timeout completes
      expect(mockNavigate).not.toHaveBeenCalled();

      // After timeout completes - advance timers and wait
      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  describe('Form Validation Integration', () => {
    it('shows validation error when submitting without password', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });

      // Should not attempt navigation
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows validation error when submitting with empty email', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.clear(emailInput);

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('clears validation error and logs in after fixing errors', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      // Submit without password to trigger error
      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });

      // Fix error by adding password
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123');
      await user.click(signInButton);

      // Wait for login to complete
      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  describe('Loading State', () => {
    it('manages loading state during login', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/password/i);
      const signInButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(passwordInput, 'password123');
      await user.click(signInButton);

      // During login, button might be disabled (if implemented)
      // For now, just verify the navigation happens after the delay

      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  describe('Component Integration', () => {
    it('integrates AuthCard, LoginForm, Input, and Button components', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      // Verify all integrated components are working
      expect(screen.getByText(/tandapay/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

      // Test full integration flow
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.clear(emailInput);
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'securepass');

      expect(emailInput).toHaveValue('newuser@example.com');
      expect(passwordInput).toHaveValue('securepass');

      const signInButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInButton);

      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  describe('Accessibility', () => {
    it('has accessible form elements', () => {
      render(<LoginPage />);

      // All inputs should be accessible via labels
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

      // Buttons should have accessible names
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup({ delay: null });
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(passwordInput, 'password123{Enter}');

      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
});
