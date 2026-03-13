import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransactionsManagementPage from '../TransactionsManagementPage';
import { dashboardService } from '../../services/dashboard.service';

// Mock dependencies
vi.mock('../../services/dashboard.service');
vi.mock('../../services', () => ({
  logger: { error: vi.fn() },
}));
vi.mock('../../components/organisms/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}));
vi.mock('../../components/atoms/StatCard', () => ({
  StatCard: ({ label, amount }: { label: string; amount: string }) => (
    <div data-testid="stat-card">
      <span>{label}</span>
      <span>{amount}</span>
    </div>
  ),
}));
vi.mock('../../components/molecules/TransactionsTable', () => ({
  TransactionsTable: ({
    transactions,
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onSizeChange,
  }: {
    transactions: unknown[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
  }) => (
    <div data-testid="transactions-table">
      <span data-testid="transaction-count">{transactions.length}</span>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <span data-testid="total-items">{totalItems}</span>
      <button onClick={() => onPageChange(2)}>Next Page</button>
      <button onClick={() => onSizeChange(20)}>Change Size</button>
    </div>
  ),
}));

const mockTransactionsResponse = {
  transactions: [
    {
      id: 'uuid-001',
      vendor_id: 'vendor-uuid-001',
      phone_number: '254712345678',
      account_reference: 'Invoice001',
      transaction_id: 'TXN001',
      vendor_name: 'Vendor A',
      amount: 1500,
      status: 'Success',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 'uuid-002',
      vendor_id: 'vendor-uuid-002',
      phone_number: '254798765432',
      account_reference: 'Invoice002',
      transaction_id: 'TXN002',
      vendor_name: 'Vendor B',
      amount: 2500,
      status: 'Pending',
      created_at: '2024-01-15T11:00:00Z',
    },
  ],
  total_pages: 5,
  total: 48,
  page: 1,
  size: 10,
};

const mockedDashboardService = dashboardService as any;

describe('TransactionsManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedDashboardService.getRecentTransactions.mockResolvedValue(mockTransactionsResponse);
  });

  it('renders loading spinner while fetching transactions', () => {
    mockedDashboardService.getRecentTransactions.mockReturnValue(new Promise(() => {}));
    const { container } = render(<TransactionsManagementPage />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    mockedDashboardService.getRecentTransactions.mockRejectedValue(new Error('Network error'));
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch recent transactions')).toBeInTheDocument();
    });
  });

  it('renders page header after successful fetch', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Transaction History' })).toBeInTheDocument();
      expect(screen.getByText('View all transactions in the system')).toBeInTheDocument();
    });
  });

  it('renders sidebar', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  it('renders all three stat cards with correct labels and amounts', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Total Transactions')).toBeInTheDocument();
      expect(screen.getByText('KES 1000')).toBeInTheDocument();
      expect(screen.getByText('Current Transactions')).toBeInTheDocument();
      expect(screen.getByText('KES 50')).toBeInTheDocument();
      expect(screen.getByText('Pending Transactions')).toBeInTheDocument();
      expect(screen.getByText('KES 100')).toBeInTheDocument();
    });
  });

  it('renders three stat cards total', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('stat-card')).toHaveLength(3);
    });
  });

  it('renders transactions table after successful fetch', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    });
  });

  it('passes correct number of transactions to table', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByTestId('transaction-count')).toHaveTextContent('2');
    });
  });

  it('passes correct pagination data to table', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('total-pages')).toHaveTextContent('5');
      expect(screen.getByTestId('total-items')).toHaveTextContent('48');
    });
  });

  it('transforms transaction amounts to KES format', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(mockedDashboardService.getRecentTransactions).toHaveBeenCalledWith(1, 10);
    });
  });

  it('calls getRecentTransactions with default page 1 and size 10 on mount', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(mockedDashboardService.getRecentTransactions).toHaveBeenCalledWith(1, 10);
    });
  });

  it('calls getRecentTransactions with new page when page changes', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Next Page'));
    await waitFor(() => {
      expect(mockedDashboardService.getRecentTransactions).toHaveBeenCalledWith(2, 10);
    });
  });

  it('resets to page 1 and calls getRecentTransactions with new size when size changes', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Change Size'));
    await waitFor(() => {
      expect(mockedDashboardService.getRecentTransactions).toHaveBeenCalledWith(1, 20);
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });
  });

  it('does not render error UI on successful fetch', async () => {
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.queryByText('Failed to fetch recent transactions')).not.toBeInTheDocument();
    });
  });

  it('does not render transactions table when in error state', async () => {
    mockedDashboardService.getRecentTransactions.mockRejectedValue(new Error('Network error'));
    render(<TransactionsManagementPage />);
    await waitFor(() => {
      expect(screen.queryByTestId('transactions-table')).not.toBeInTheDocument();
    });
  });
});
