import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../SignupForm';

describe('SignupForm', () => {
  it('renders all form fields', () => {
    render(<SignupForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/m-pesa phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<SignupForm />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(<SignupForm />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    render(<SignupForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/m-pesa phone number/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '+254712345678' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('+254712345678');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows error when submitting empty form', async () => {
    render(<SignupForm />);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  it('shows error when password is too short', async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/m-pesa phone number/i), { target: { value: '+254712345678' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data when valid', async () => {
    const mockOnSubmit = jest.fn();
    render(<SignupForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/m-pesa phone number/i), { target: { value: '+254712345678' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+254712345678',
        password: 'password123',
      });
    });
  });

  it('calls onBack when back button is clicked', () => {
    const mockOnBack = jest.fn();
    render(<SignupForm onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('renders help text for inputs', () => {
    render(<SignupForm />);

    expect(screen.getByText(/used for account login and notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/must be registered with m-pesa for payments/i)).toBeInTheDocument();
    expect(screen.getByText(/must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('renders password toggle', () => {
    render(<SignupForm />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
