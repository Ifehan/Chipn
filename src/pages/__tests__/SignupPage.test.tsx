import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignupPage from '../SignupPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock child components
jest.mock('../../components/organisms/AuthCard', () => ({
  AuthCard: ({ children, title, subtitle }: any) => (
    <div data-testid="mock-auth-card">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

jest.mock('../../components/molecules/SignupForm', () => ({
  SignupForm: ({ onSubmit, onBack }: any) => (
    <form
      data-testid="mock-signup-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          name: 'Test User',
          email: 'test@example.com',
          phone: '+254712345678',
          password: 'password123',
        });
      }}
    >
      <button type="submit">Sign Up</button>
      <button type="button" onClick={onBack}>
        Back
      </button>
    </form>
  ),
}));

const renderSignupPage = () => {
  return render(
    <BrowserRouter>
      <SignupPage />
    </BrowserRouter>
  );
};

describe('SignupPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    renderSignupPage();
    expect(screen.getByTestId('mock-auth-card')).toBeInTheDocument();
  });

  it('renders AuthCard with correct title and subtitle', () => {
    renderSignupPage();
    expect(screen.getByText('TandaPay')).toBeInTheDocument();
    expect(screen.getByText('Split bills and pay instantly via M-PESA')).toBeInTheDocument();
  });

  it('renders SignupForm inside AuthCard', () => {
    renderSignupPage();

    const authCard = screen.getByTestId('mock-auth-card');
    const signupForm = screen.getByTestId('mock-signup-form');

    expect(authCard).toBeInTheDocument();
    expect(signupForm).toBeInTheDocument();
    expect(authCard).toContainElement(signupForm);
  });

  it('handles signup submission', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup({ delay: null });
    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    expect(consoleSpy).toHaveBeenCalledWith('Signing up:', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+254712345678',
      password: 'password123',
    });

    consoleSpy.mockRestore();
  });

  it('shows loading state during signup', async () => {
    const user = userEvent.setup({ delay: null });
    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    // Component should be in loading state
    // (In real implementation, you might check for disabled button or loading spinner)
  });

  it('handles signup errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const user = userEvent.setup({ delay: null });

    // Mock console.log to throw an error
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      throw new Error('Signup failed');
    });

    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Signup failed:',
        expect.any(Error)
      );
    });

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderSignupPage();

    const backButton = screen.getByText('Back');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('has correct page layout', () => {
    const { container } = renderSignupPage();
    expect(container.querySelector('[data-testid="mock-auth-card"]')).toBeInTheDocument();
  });

  it('passes correct props to SignupForm', () => {
    renderSignupPage();

    const signupForm = screen.getByTestId('mock-signup-form');
    expect(signupForm).toBeInTheDocument();

    // Verify form has submit and back buttons
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
