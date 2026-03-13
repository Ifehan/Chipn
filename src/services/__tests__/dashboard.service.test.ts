import { dashboardService } from '../dashboard.service';
import { apiClient } from '../../services/api-client';

// Mock the apiClient
vi.mock('../../services/api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecentTransactions', () => {
    it('should fetch recent transactions successfully', async () => {
      const mockResponse = {
        transactions: [
          {
            id: '1',
            transaction_id: 'TXN001',
            vendor_id: 'VEND001',
            vendor_name: 'Java House',
            amount: 1500,
            status: 'Success',
            created_at: '2025-11-29T10:30:00Z',
            phone_number: '254712345678',
            account_reference: 'INV001',
          },
          {
            id: '2',
            transaction_id: 'TXN002',
            vendor_id: 'VEND002',
            vendor_name: 'Kenyan Bites',
            amount: 2200,
            status: 'Pending',
            created_at: '2025-11-29T11:00:00Z',
            phone_number: '254798765432',
            account_reference: 'INV002',
          },
        ],
        total: 2,
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await dashboardService.getRecentTransactions();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/dashboard/recent-transactions?page=1&size=5');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = {
        message: 'Network error',
        status: 500,
        details: { error: 'Server timeout' },
      };

      mockedApiClient.get.mockRejectedValue(mockError);

      await expect(dashboardService.getRecentTransactions()).rejects.toEqual(
        mockError
      );
      expect(mockedApiClient.get).toHaveBeenCalledWith('/dashboard/recent-transactions?page=1&size=5');
    });

    it('should handle network failures', async () => {
      const mockError = {
        message: 'Network error occurred',
        status: 0,
        details: new Error('Network failure'),
      };

      mockedApiClient.get.mockRejectedValue(mockError);

      await expect(dashboardService.getRecentTransactions()).rejects.toEqual(
        mockError
      );
    });

    it('should handle empty transactions array', async () => {
      const mockResponse = {
        transactions: [],
        total: 0,
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await dashboardService.getRecentTransactions();

      expect(result).toEqual(mockResponse);
    });

    it('should handle single transaction', async () => {
      const mockResponse = {
        transactions: [
          {
            id: '3',
            transaction_id: 'TXN003',
            vendor_id: 'VEND003',
            vendor_name: 'Mama Deli',
            amount: 750,
            status: 'Failed',
            created_at: '2025-11-29T12:15:00Z',
            phone_number: '254755555555',
            account_reference: 'INV003',
          },
        ],
        total: 1,
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await dashboardService.getRecentTransactions();

      expect(result).toEqual(mockResponse);
    });

    it('should handle various transaction statuses', async () => {
      const mockResponse = {
        transactions: [
          {
            id: '4',
            transaction_id: 'TXN004',
            vendor_id: 'VEND004',
            vendor_name: 'Test Vendor',
            amount: 1000,
            status: 'Success',
            created_at: '2025-11-29T13:00:00Z',
            phone_number: '254711111111',
            account_reference: 'INV004',
          },
          {
            id: '5',
            transaction_id: 'TXN005',
            vendor_id: 'VEND005',
            vendor_name: 'Another Vendor',
            amount: 2500,
            status: 'Pending',
            created_at: '2025-11-29T14:00:00Z',
            phone_number: '254722222222',
            account_reference: 'INV005',
          },
        ],
        total: 2,
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await dashboardService.getRecentTransactions();

      expect(result).toEqual(mockResponse);
    });
  });
});
