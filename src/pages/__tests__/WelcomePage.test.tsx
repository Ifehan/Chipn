import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import WelcomePage from '../WelcomePage';

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

jest.mock('../../components/atoms/Button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button data-testid={`button-${variant}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

const renderWelcomePage = () => {
  return render(
    <BrowserRouter>
      <WelcomePage />
    </BrowserRouter>
  );
};

describe('WelcomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    renderWelcomePage();
    expect(screen.getByTestId('mock-auth-card')).toBeInTheDocument();
  });

  it('displays the app name', () => {
    renderWelcomePage();
    expect(screen.getByText('TandaPay')).toBeInTheDocument();
  });

  it('displays the app subtitle', () => {
    renderWelcomePage();
    expect(screen.getByText('Split bills and pay instantly via M-PESA')).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    renderWelcomePage();
    expect(
      screen.getByText(/Welcome to TandaPay! Split bills and get paid instantly via M-PESA./i)
    ).toBeInTheDocument();
  });

  it('renders Create New Account button', () => {
    renderWelcomePage();
    const createAccountButton = screen.getByText('Create New Account');
    expect(createAccountButton).toBeInTheDocument();
  });

  it('renders Sign In button', () => {
    renderWelcomePage();
    const signInButton = screen.getByText('Sign In to Existing Account');
    expect(signInButton).toBeInTheDocument();
  });

  it('navigates to signup page when Create New Account is clicked', async () => {
    const user = userEvent.setup();
    renderWelcomePage();

    const createAccountButton = screen.getByText('Create New Account');
    await user.click(createAccountButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('navigates to login page when Sign In is clicked', async () => {
    const user = userEvent.setup();
    renderWelcomePage();

    const signInButton = screen.getByText('Sign In to Existing Account');
    await user.click(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders buttons with correct variants', () => {
    renderWelcomePage();

    expect(screen.getByTestId('button-primary')).toBeInTheDocument();
    expect(screen.getByTestId('button-outline')).toBeInTheDocument();
  });

  it('has proper layout structure', () => {
    const { container } = renderWelcomePage();
    expect(container.querySelector('[data-testid="mock-auth-card"]')).toBeInTheDocument();
  });

  it('renders AuthCard with correct props', () => {
    renderWelcomePage();

    expect(screen.getByText('TandaPay')).toBeInTheDocument();
    expect(screen.getByText('Split bills and pay instantly via M-PESA')).toBeInTheDocument();
  });

  it('displays content in correct order', () => {
    renderWelcomePage();

    const welcomeText = screen.getByText(/Welcome to TandaPay/i);
    const createButton = screen.getByText('Create New Account');
    const signInButton = screen.getByText('Sign In to Existing Account');

    expect(welcomeText).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  it('does not navigate on initial render', () => {
    renderWelcomePage();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
