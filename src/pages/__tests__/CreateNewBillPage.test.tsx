// Mock the api-client to avoid import.meta issues
vi.mock('../../services/api-client');

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import userEvent from '@testing-library/user-event';
import CreateNewBillPage from '../CreateNewBillPage';
import { authService } from '../../services/auth.service';
import { usersService } from '../../services/users.service';

const mockNavigate = vi.fn();
const mockInitiateSTKPush = vi.fn();
const mockGetCurrentUser = vi.fn();

const mockVendors = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Safaricom',
    paybill_number: '123456',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Kenya Power',
    paybill_number: '888880',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as any),
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../services/auth.service', () => ({
  authService: {
    hasToken: vi.fn(),
    getAccessToken: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('../../services/users.service', () => ({
  usersService: {
    getCurrentUser: vi.fn(),
  },
}));

// Mock payment hook
vi.mock('../../hooks/usePayment', () => ({
  useSTKPush: () => ({
    initiateSTKPush: mockInitiateSTKPush,
    loading: false,
    error: null,
  }),
}));

// Mock vendors hook
vi.mock('../../hooks/useVendors', () => ({
  useVendors: () => ({
    vendors: mockVendors,
    loading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Note: CreateNewBillPage uses useAuth() from AuthContext, not useCurrentUser hook
// So we don't need to mock useCurrentUser

// Mock child components
vi.mock('../../components/molecules/SplitMethodSelector', () => ({
  SplitMethodSelector: ({ selectedMethod, onMethodChange }: any) => (
    <div data-testid="mock-split-method-selector">
      <button onClick={() => onMethodChange('equal')}>Equal</button>
      <button onClick={() => onMethodChange('custom')}>Custom</button>
      <span>Selected: {selectedMethod}</span>
    </div>
  ),
}));

const renderCreateNewBillPage = async () => {
  const result = render(
    <BrowserRouter>
      <AuthProvider>
        <CreateNewBillPage />
      </AuthProvider>
    </BrowserRouter>
  );

  // Wait for AuthProvider to initialize
  await waitFor(() => {
    expect(usersService.getCurrentUser).toHaveBeenCalled();
  });

  return result;
};

describe('CreateNewBillPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockInitiateSTKPush.mockClear();
    mockGetCurrentUser.mockClear();
    vi.clearAllMocks();

    // Mock auth service
    (authService.hasToken as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (authService.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue('mock-token');

    // Mock users service for AuthProvider
    (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '254700000000',
      id_type: 'national_id',
      role: 'user',
    });

  });

  it('renders without crashing', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Create New Bill')).toBeInTheDocument();
  });

  it('renders page title', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Create New Bill')).toBeInTheDocument();
  });

  it('renders back button', async () => {
    await renderCreateNewBillPage();
    const backButton = screen.getByRole('button', { name: '' });
    expect(backButton).toBeInTheDocument();
  });

  it('navigates back to home when back button is clicked', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

    // Find the back button (ArrowLeft icon button)
    const buttons = screen.getAllByRole('button');
    const backButton = buttons[0]; // First button should be the back button
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('renders bill details section', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Bill Details')).toBeInTheDocument();
  });

  it('renders informational message', async () => {
    await renderCreateNewBillPage();
    expect(
      screen.getByText(/You've already paid this bill/i)
    ).toBeInTheDocument();
  });

  it('renders total amount input', async () => {
    await renderCreateNewBillPage();
    const amountInput = screen.getByPlaceholderText('0');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('type', 'number');
  });

  it('renders description input', async () => {
    await renderCreateNewBillPage();
    const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveAttribute('type', 'text');
  });

  it('updates total amount when user types', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    const amountInput = screen.getByPlaceholderText('0');
    await user.type(amountInput, '1000');

    expect(amountInput).toHaveValue(1000);
  });

  it('updates description when user types', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
    await user.type(descriptionInput, 'Lunch at Java House');

    expect(descriptionInput).toHaveValue('Lunch at Java House');
  });

  it('renders split method section', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Split Method')).toBeInTheDocument();
  });

  it('renders SplitMethodSelector component', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByTestId('mock-split-method-selector')).toBeInTheDocument();
  });

  it('starts with equal split method by default', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Selected: equal')).toBeInTheDocument();
  });

  it('changes split method when selector is used', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    const customButton = screen.getByText('Custom');
    await user.click(customButton);

    expect(screen.getByText('Selected: custom')).toBeInTheDocument();
  });

  it('renders participants section', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText(/Participants \(0\)/i)).toBeInTheDocument();
  });

  it('renders add from contacts button', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Add from Contacts')).toBeInTheDocument();
  });

  it('renders phone input for manual entry', async () => {
    await renderCreateNewBillPage();
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveAttribute('type', 'tel');
  });

  it('renders add participant button', async () => {
    await renderCreateNewBillPage();
    const addButton = screen.getByText('+');
    expect(addButton).toBeInTheDocument();
  });

  it('adds participant when phone number is entered and add button is clicked', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    expect(screen.getByText('+254712345678')).toBeInTheDocument();
    expect(screen.getByText(/Participants \(1\)/i)).toBeInTheDocument();
  });

  it('clears phone input after adding participant', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    expect(phoneInput).toHaveValue('');
  });

  it('shows empty state when no participants added', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('No participants added yet')).toBeInTheDocument();
    expect(screen.getByText(/Add from contacts or enter phone numbers manually/i)).toBeInTheDocument();
  });

  it('removes participant when remove button is clicked', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    // Add a participant
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');
    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    // Remove the participant
    const removeButton = screen.getByText('Remove');
    await user.click(removeButton);

    expect(screen.queryByText('+254712345678')).not.toBeInTheDocument();
    expect(screen.getByText(/Participants \(0\)/i)).toBeInTheDocument();
  });

  it('renders send payment requests button', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByText('Send Payment Requests')).toBeInTheDocument();
  });

  it('disables send button when form is invalid', async () => {
    await renderCreateNewBillPage();
    const sendButton = screen.getByText('Send Payment Requests');
    expect(sendButton).toBeDisabled();
  });

  it('renders vendor dropdown', async () => {
    await renderCreateNewBillPage();
    expect(screen.getByLabelText(/select vendor/i)).toBeInTheDocument();
  });

  it('displays vendors in dropdown', async () => {
    await renderCreateNewBillPage();
    const vendorSelect = screen.getByLabelText(/select vendor/i);
    expect(vendorSelect).toBeInTheDocument();

    // Check if vendors are in the dropdown
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(1); // At least "Select a vendor" + vendors
  });

  it('enables send button when form is valid', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    // Fill in all required fields including vendor
    const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
    const vendorSelect = screen.getByLabelText(/select vendor/i);
    const amountInput = screen.getByPlaceholderText('0');
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(billNameInput, 'Lunch');
    await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
    await user.type(amountInput, '1000');
    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    const sendButton = screen.getByText('Send Payment Requests');
    expect(sendButton).not.toBeDisabled();
  });

  it('sends payment requests and navigates to home', async () => {
    mockInitiateSTKPush.mockResolvedValue({
      message: 'STK Push initiated successfully',
      checkout_request_id: 'ws_CO_123456789',
    });

    const user = userEvent.setup();
    await renderCreateNewBillPage();

    // Fill in all required fields including vendor
    const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
    const vendorSelect = screen.getByLabelText(/select vendor/i);
    const amountInput = screen.getByPlaceholderText('0');
    const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(billNameInput, 'Lunch Bill');
    await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
    await user.type(amountInput, '1000');
    await user.type(descriptionInput, 'Lunch');
    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    const sendButton = screen.getByText('Send Payment Requests');
    await user.click(sendButton);

    await waitFor(() => {
      expect(mockInitiateSTKPush).toHaveBeenCalledWith({
        payments: [
          { amount: 500, phone_number: '254700000000' },
          { amount: 500, phone_number: '254712345678' },
        ],
        account_reference: 'Lunch Bill',
        transaction_desc: 'Lunch',
        vendor_id: '550e8400-e29b-41d4-a716-446655440000',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home', { state: { refresh: true } });
  });

  it('has correct page layout', async () => {
    const { container } = await renderCreateNewBillPage();

    const mainContainer = container.querySelector('.app-shell');
    expect(mainContainer).toBeInTheDocument();
  });

  it('adds multiple participants', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    // Add first participant
    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    // Add second participant
    await user.type(phoneInput, '+254700000000');
    await user.click(addButton);

    expect(screen.getByText('+254712345678')).toBeInTheDocument();
    expect(screen.getByText('+254700000000')).toBeInTheDocument();
    expect(screen.getByText(/Participants \(2\)/i)).toBeInTheDocument();
  });

  describe('STK Push Integration', () => {
    it('renders with user data from AuthContext', async () => {
      await renderCreateNewBillPage();
      // User data comes from AuthContext, not from calling getCurrentUser
      expect(screen.getByText('Create New Bill')).toBeInTheDocument();
    });

    it('calculates equal split correctly', async () => {
      mockInitiateSTKPush.mockResolvedValue({
        message: 'Success',
      });

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const vendorSelect = screen.getByLabelText(/select vendor/i);
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Test Bill');
      await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
      await user.type(amountInput, '300');
      await user.type(phoneInput, '0712345678');
      await user.click(addButton);
      await user.type(phoneInput, '0798765432');
      await user.click(addButton);

      const sendButton = screen.getByText('Send Payment Requests');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockInitiateSTKPush).toHaveBeenCalledWith({
          payments: [
            { amount: 100, phone_number: '254700000000' },
            { amount: 100, phone_number: '254712345678' },
            { amount: 100, phone_number: '254798765432' },
          ],
          account_reference: 'Test Bill',
          transaction_desc: 'Payment for Test Bill',
          vendor_id: '550e8400-e29b-41d4-a716-446655440000',
        });
      });
    });

    it('normalizes phone numbers correctly', async () => {
      mockInitiateSTKPush.mockResolvedValue({
        message: 'Success',
      });

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const vendorSelect = screen.getByLabelText(/select vendor/i);
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Test');
      await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
      await user.type(amountInput, '200');
      await user.type(phoneInput, '0712345678');
      await user.click(addButton);

      const sendButton = screen.getByText('Send Payment Requests');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockInitiateSTKPush).toHaveBeenCalledWith(
          expect.objectContaining({
            payments: expect.arrayContaining([
              expect.objectContaining({
                phone_number: '254712345678',
              }),
            ]),
            vendor_id: '550e8400-e29b-41d4-a716-446655440000',
          })
        );
      });
    });

    it('handles STK Push errors gracefully', async () => {
      const mockError = {
        message: 'Invalid phone number',
        status: 400,
      };

      mockInitiateSTKPush.mockRejectedValue(mockError);

      // Suppress console.error for this test since we're testing error handling
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const vendorSelect = screen.getByLabelText(/select vendor/i);
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Test');
      await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
      await user.type(amountInput, '100');
      await user.type(phoneInput, '0712345678');
      await user.click(addButton);

      const sendButton = screen.getByText('Send Payment Requests');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockInitiateSTKPush).toHaveBeenCalled();
      });

      // Should not navigate on error
      expect(mockNavigate).not.toHaveBeenCalled();

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('uses bill name as account reference', async () => {
      mockInitiateSTKPush.mockResolvedValue({
        message: 'Success',
      });

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const vendorSelect = screen.getByLabelText(/select vendor/i);
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Custom Bill Name');
      await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
      await user.type(amountInput, '500');
      await user.type(phoneInput, '0712345678');
      await user.click(addButton);

      const sendButton = screen.getByText('Send Payment Requests');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockInitiateSTKPush).toHaveBeenCalledWith(
          expect.objectContaining({
            account_reference: 'Custom Bill Name',
            vendor_id: '550e8400-e29b-41d4-a716-446655440000',
          })
        );
      });
    });

    it('uses description as transaction description', async () => {
      mockInitiateSTKPush.mockResolvedValue({
        message: 'Success',
      });

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const vendorSelect = screen.getByLabelText(/select vendor/i);
      const amountInput = screen.getByPlaceholderText('0');
      const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Bill');
      await user.selectOptions(vendorSelect, '550e8400-e29b-41d4-a716-446655440000');
      await user.type(amountInput, '500');
      await user.type(descriptionInput, 'Custom Description');
      await user.type(phoneInput, '0712345678');
      await user.click(addButton);

      const sendButton = screen.getByText('Send Payment Requests');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockInitiateSTKPush).toHaveBeenCalledWith(
          expect.objectContaining({
            transaction_desc: 'Custom Description',
            vendor_id: '550e8400-e29b-41d4-a716-446655440000',
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('renders page even if user data is not immediately available', async () => {
      // Temporarily set user to null in AuthContext
      (usersService.getCurrentUser as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      render(
        <BrowserRouter>
          <AuthProvider>
            <CreateNewBillPage />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        // Should still render the page structure
        expect(screen.getByText('Create New Bill')).toBeInTheDocument();
      });
    });
  });
});
