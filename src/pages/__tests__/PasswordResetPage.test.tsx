// Mock the api-client to avoid import.meta issues
vi.mock('../../services/api-client');

// Mock the auth service
vi.mock('../../services/auth.service');

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PasswordResetPage } from '../PasswordResetPage';
import { authService } from '../../services/auth.service';
import type { PasswordResetResponse } from '../../services/types/auth.types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  }
})

describe('PasswordResetPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPasswordResetPage = () => {
    return render(
      <BrowserRouter>
        <PasswordResetPage />
      </BrowserRouter>
    );
  };

  it('renders password reset page with title and subtitle', () => {
    renderPasswordResetPage();

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    // Check that the subtitle text appears (it appears in both AuthCard and PasswordResetForm)
    const subtitleElements = screen.queryAllByText(/we'll send you a link to reset your password/i);
    expect(subtitleElements.length).toBeGreaterThan(0);
  });

  it('renders password reset form', () => {
    renderPasswordResetPage();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });

  it('successfully sends password reset request', async () => {
    const mockResponse: PasswordResetResponse = {
      message: 'Password reset link has been sent to your email.',
    };

    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.requestPasswordReset).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    // Check for success message
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByText(/password reset link has been sent/i)).toBeInTheDocument();
  });

  it('displays loading state during password reset request', async () => {
    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/sending/i)).not.toBeInTheDocument();
    });
  });

  it('displays error message on password reset failure', async () => {
    const errorMessage = 'Email not found';
    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockRejectedValue({
      message: errorMessage,
      status: 404,
    });

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Should not show success message
    expect(screen.queryByText(/check your email/i)).not.toBeInTheDocument();
  });

  it('displays generic error message when error has no message', async () => {
    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockRejectedValue({
      status: 500,
    });

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send reset link. please try again/i)).toBeInTheDocument();
    });
  });

  it('navigates to login when back button is clicked', () => {
    renderPasswordResetPage();

    const backButton = screen.getByRole('button', { name: /back to login/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to login when back button is clicked in success state', async () => {
    const mockResponse: PasswordResetResponse = {
      message: 'Password reset link has been sent to your email.',
    };

    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back to login/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('clears error message on new password reset attempt', async () => {
    const errorMessage = 'Email not found';
    (authService.requestPasswordReset as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce({
        message: errorMessage,
        status: 404,
      })
      .mockResolvedValueOnce({
        message: 'Password reset link has been sent to your email.',
      });

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    // First attempt - should fail
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Second attempt - should succeed
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
  });

  it('disables form inputs during password reset request', async () => {
    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    });
  });

  it('shows success state after successful password reset', async () => {
    const mockResponse: PasswordResetResponse = {
      message: 'Password reset link has been sent to your email.',
    };

    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    renderPasswordResetPage();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });

    // Form should be hidden in success state
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send reset link/i })).not.toBeInTheDocument();

    // Only back button should be visible
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });

  it('shows error message on password reset failure', async () => {
    const errorMessage = 'Network error';
    const error = { message: errorMessage, status: 0 };

    (authService.requestPasswordReset as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    renderPasswordResetPage();

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
