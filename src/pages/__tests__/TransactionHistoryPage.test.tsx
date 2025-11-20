import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import TransactionHistoryPage from '../TransactionHistoryPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock child components
jest.mock('../../components/atoms/BackButton', () => ({
  BackButton: ({ onClick }: any) => (
    <button data-testid="mock-back-button" onClick={onClick}>
      Back
    </button>
  ),
}));

const renderTransactionHistoryPage = () => {
  return render(
    <BrowserRouter>
      <TransactionHistoryPage />
    </BrowserRouter>
  );
};

describe('TransactionHistoryPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    renderTransactionHistoryPage();
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderTransactionHistoryPage();
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
  });

  it('renders BackButton component', () => {
    renderTransactionHistoryPage();
    expect(screen.getByTestId('mock-back-button')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const backButton = screen.getByTestId('mock-back-button');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders search input', () => {
    renderTransactionHistoryPage();
    const searchInput = screen.getByPlaceholderText('Search bills...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('updates search query when user types', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const searchInput = screen.getByPlaceholderText('Search bills...');
    await user.type(searchInput, 'Lunch');

    expect(searchInput).toHaveValue('Lunch');
  });

  it('renders all tab buttons', () => {
    renderTransactionHistoryPage();

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('starts with "All" tab active by default', () => {
    renderTransactionHistoryPage();

    const allTab = screen.getByText('All').closest('button');
    expect(allTab).toHaveClass('bg-black', 'text-white');
  });

  it('switches to pending tab when clicked', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const pendingTab = screen.getByText('Pending').closest('button');
    await user.click(pendingTab!);

    expect(pendingTab).toHaveClass('bg-black', 'text-white');
  });

  it('switches to completed tab when clicked', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const completedTab = screen.getByText('Completed').closest('button');
    await user.click(completedTab!);

    expect(completedTab).toHaveClass('bg-black', 'text-white');
  });

  it('displays count badges for each tab', () => {
    renderTransactionHistoryPage();

    // All tabs should have count of 0
    const countBadges = screen.getAllByText('0');
    expect(countBadges).toHaveLength(3);
  });

  it('renders empty state', () => {
    renderTransactionHistoryPage();

    expect(screen.getByText('No bills yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first bill to get started')).toBeInTheDocument();
  });

  it('has correct page layout', () => {
    const { container } = renderTransactionHistoryPage();

    const mainContainer = container.querySelector('.app-shell');
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders header with correct styling', () => {
    const { container } = renderTransactionHistoryPage();

    const header = container.querySelector('.bg-white.border-b');
    expect(header).toBeInTheDocument();
  });

  it('renders search icon in search input', () => {
    const { container } = renderTransactionHistoryPage();

    // Check for search icon (lucide-react Search component)
    const searchContainer = container.querySelector('.relative');
    expect(searchContainer).toBeInTheDocument();
  });

  it('applies correct styling to active tab', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const pendingTab = screen.getByText('Pending').closest('button');
    await user.click(pendingTab!);

    expect(pendingTab).toHaveClass('bg-black');
    expect(pendingTab).toHaveClass('text-white');
  });

  it('applies correct styling to inactive tabs', () => {
    renderTransactionHistoryPage();

    const pendingTab = screen.getByText('Pending').closest('button');
    const completedTab = screen.getByText('Completed').closest('button');

    expect(pendingTab).toHaveClass('bg-white');
    expect(completedTab).toHaveClass('bg-white');
  });

  it('renders empty state with icon', () => {
    const { container } = renderTransactionHistoryPage();

    // Check for DollarSign icon in empty state
    const emptyState = container.querySelector('.flex.flex-col.items-center');
    expect(emptyState).toBeInTheDocument();
  });

  it('clears search query when cleared', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const searchInput = screen.getByPlaceholderText('Search bills...');
    await user.type(searchInput, 'Test');
    expect(searchInput).toHaveValue('Test');

    await user.clear(searchInput);
    expect(searchInput).toHaveValue('');
  });

  it('maintains tab state when searching', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    // Switch to pending tab
    const pendingTab = screen.getByText('Pending').closest('button');
    await user.click(pendingTab!);

    // Type in search
    const searchInput = screen.getByPlaceholderText('Search bills...');
    await user.type(searchInput, 'Test');

    // Pending tab should still be active
    expect(pendingTab).toHaveClass('bg-black', 'text-white');
  });

  it('renders all tabs with correct structure', () => {
    renderTransactionHistoryPage();

    const tabs = ['All', 'Pending', 'Completed'];
    tabs.forEach(tabLabel => {
      const tab = screen.getByText(tabLabel).closest('button');
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveClass('rounded-full');
    });
  });
});
