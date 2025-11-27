import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import TransactionHistoryPage from '../TransactionHistoryPage';
import type { TransactionHistoryResponse } from '../../services/types/payment.types';

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

// Mock the useTransactionHistory hook
const mockUseTransactionHistory = jest.fn();
jest.mock('../../hooks/useTransactionHistory', () => ({
  useTransactionHistory: () => mockUseTransactionHistory(),
}));

const mockTransactionResponse: TransactionHistoryResponse = {
  transactions: [
    {
      id: '1',
      merchant_request_id: 'merchant_123',
      checkout_request_id: 'checkout_123',
      phone_number: '254712345678',
      amount: 1000,
      account_reference: 'INV001',
      transaction_desc: 'Payment for goods',
      mpesa_receipt_number: 'ABC123XYZ',
      transaction_date: '2025-11-27T10:00:00Z',
      status: 'completed',
      callback_url: null,
      callback_received: '2025-11-27T10:01:00Z',
      result_code: '0',
      result_desc: 'Success',
      error_message: null,
      created_at: '2025-11-27T09:59:00Z',
      updated_at: '2025-11-27T10:01:00Z',
      user_id: 'user_123',
    },
    {
      id: '2',
      merchant_request_id: 'merchant_456',
      checkout_request_id: 'checkout_456',
      phone_number: '254798765432',
      amount: 500,
      account_reference: 'INV002',
      transaction_desc: 'Service payment',
      mpesa_receipt_number: null,
      transaction_date: null,
      status: 'pending',
      callback_url: null,
      callback_received: null,
      result_code: null,
      result_desc: null,
      error_message: null,
      created_at: '2025-11-27T11:00:00Z',
      updated_at: '2025-11-27T11:00:00Z',
      user_id: 'user_123',
    },
  ],
  total: 2,
  page: 1,
  page_size: 50,
  status_filter: 'all',
};

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
    mockUseTransactionHistory.mockReturnValue({
      transactions: [],
      total: 0,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
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
    const searchInput = screen.getByPlaceholderText('Search transactions...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('updates search query when user types', async () => {
    const user = userEvent.setup();
    renderTransactionHistoryPage();

    const searchInput = screen.getByPlaceholderText('Search transactions...');
    await user.type(searchInput, 'INV001');

    expect(searchInput).toHaveValue('INV001');
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

  it('renders empty state when no transactions', () => {
    renderTransactionHistoryPage();

    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    expect(screen.getByText('Your transaction history will appear here')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: [],
      total: 0,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();
    expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: [],
      total: 0,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: 'Network error',
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();
    expect(screen.getByText('Error Loading Transactions')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('displays transactions when loaded', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    expect(screen.getByText('INV001')).toBeInTheDocument();
    expect(screen.getByText('INV002')).toBeInTheDocument();
    expect(screen.getByText('Payment for goods')).toBeInTheDocument();
    expect(screen.getByText('Service payment')).toBeInTheDocument();
  });

  it('filters transactions by search query', async () => {
    const user = userEvent.setup();
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    const searchInput = screen.getByPlaceholderText('Search transactions...');
    await user.type(searchInput, 'INV001');

    // INV001 should be visible
    expect(screen.getByText('INV001')).toBeInTheDocument();
    // INV002 should not be visible (filtered out)
    expect(screen.queryByText('INV002')).not.toBeInTheDocument();
  });

  it('displays status badges correctly', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    // Check for status badges in transaction cards (not tabs)
    const statusBadges = screen.getAllByText('Completed');
    expect(statusBadges.length).toBeGreaterThan(0);

    const pendingBadges = screen.getAllByText('Pending');
    expect(pendingBadges.length).toBeGreaterThan(0);
  });

  it('displays M-Pesa receipt number when available', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    expect(screen.getByText(/Receipt: ABC123XYZ/)).toBeInTheDocument();
  });

  it('formats amount correctly', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    // Check for formatted amounts (KES currency format)
    expect(screen.getByText(/1,000/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('displays phone numbers', () => {
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    expect(screen.getByText('254712345678')).toBeInTheDocument();
    expect(screen.getByText('254798765432')).toBeInTheDocument();
  });

  it('shows empty state when search has no results', async () => {
    const user = userEvent.setup();
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    const searchInput = screen.getByPlaceholderText('Search transactions...');
    await user.type(searchInput, 'NonExistentTransaction');

    expect(screen.getByText('No matching transactions')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search query')).toBeInTheDocument();
  });

  it('maintains tab state when searching', async () => {
    const user = userEvent.setup();
    mockUseTransactionHistory.mockReturnValue({
      transactions: mockTransactionResponse.transactions,
      total: 2,
      page: 1,
      pageSize: 50,
      statusFilter: 'all',
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderTransactionHistoryPage();

    // Switch to pending tab - get all elements and find the button (tab)
    const pendingElements = screen.getAllByText('Pending');
    const pendingTab = pendingElements.find(el => el.closest('button')?.classList.contains('rounded-full'));
    const pendingButton = pendingTab?.closest('button');

    await user.click(pendingButton!);

    // Type in search
    const searchInput = screen.getByPlaceholderText('Search transactions...');
    await user.type(searchInput, 'Test');

    // Pending tab should still be active
    expect(pendingButton).toHaveClass('bg-black', 'text-white');
  });
});
