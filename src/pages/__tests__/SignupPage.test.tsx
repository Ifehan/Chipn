import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SignupPage from '../SignupPage';

const mockNavigate = jest.fn();
const mockCreateUser = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useUsers', () => ({
  useCreateUser: () => ({
    createUser: mockCreateUser,
    loading: false,
    error: null,
  }),
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
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: '+254712345678',
          idType: 'passport',
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
    mockCreateUser.mockClear();
    mockCreateUser.mockResolvedValue({
      id: 'user123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '+254712345678',
      id_type: 'passport',
    });
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

  it('handles signup submission with correct API format', async () => {
    const user = userEvent.setup({ delay: null });
    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '+254712345678',
        id_type: 'passport',
        password: 'password123',
      });
    });
  });

  it('handles signup errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const user = userEvent.setup({ delay: null });

    mockCreateUser.mockRejectedValueOnce({
      message: 'Email already exists',
      status: 400,
    });

    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Signup failed:',
        expect.objectContaining({
          message: 'Email already exists',
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('displays generic error message when error has no message', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const user = userEvent.setup({ delay: null });

    mockCreateUser.mockRejectedValueOnce(new Error());

    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create account/i)).toBeInTheDocument();
    });

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

  it('logs successful user creation', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup({ delay: null });
    renderSignupPage();

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'User created successfully:',
        expect.objectContaining({
          id: 'user123',
          first_name: 'John',
          last_name: 'Doe',
        })
      );
    });

    consoleSpy.mockRestore();
  });
});
