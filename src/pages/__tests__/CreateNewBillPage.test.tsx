import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CreateNewBillPage from '../CreateNewBillPage';

const mockNavigate = jest.fn();
const mockInitiateSTKPush = jest.fn();
const mockGetCurrentUser = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock payment hook
jest.mock('../../hooks/usePayment', () => ({
  useSTKPush: () => ({
    initiateSTKPush: mockInitiateSTKPush,
    loading: false,
    error: null,
  }),
}));

// Mock users hook
jest.mock('../../hooks/useUsers', () => ({
  useCurrentUser: () => ({
    getCurrentUser: mockGetCurrentUser,
    loading: false,
    error: null,
  }),
}));

// Mock child components
jest.mock('../../components/molecules/SplitMethodSelector', () => ({
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
      <CreateNewBillPage />
    </BrowserRouter>
  );

  // Wait for the useEffect to complete
  await waitFor(() => {
    expect(mockGetCurrentUser).toHaveBeenCalled();
  });

  return result;
};

describe('CreateNewBillPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockInitiateSTKPush.mockClear();
    mockGetCurrentUser.mockClear();
    mockGetCurrentUser.mockResolvedValue({
      id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '254700000000',
      id_type: 'national_id',
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

  it('enables send button when form is valid', async () => {
    const user = userEvent.setup();
    await renderCreateNewBillPage();

    // Fill in all required fields
    const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
    const amountInput = screen.getByPlaceholderText('0');
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(billNameInput, 'Lunch');
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

    // Fill in all required fields
    const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
    const amountInput = screen.getByPlaceholderText('0');
    const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(billNameInput, 'Lunch Bill');
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
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
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
    it('fetches current user on mount', async () => {
      await renderCreateNewBillPage();
      // getCurrentUser is already called in renderCreateNewBillPage
      expect(mockGetCurrentUser).toHaveBeenCalled();
    });

    it('calculates equal split correctly', async () => {
      mockInitiateSTKPush.mockResolvedValue({
        message: 'Success',
      });

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Test Bill');
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
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Test');
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
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const user = userEvent.setup();
      await renderCreateNewBillPage();

      const billNameInput = screen.getByPlaceholderText(/e.g., Dinner at Restaurant/i);
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Test');
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
      const amountInput = screen.getByPlaceholderText('0');
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Custom Bill Name');
      await user.type(amountInput, '500');
      await user.type(phoneInput, '0712345678');
      await user.click(addButton);

      const sendButton = screen.getByText('Send Payment Requests');
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockInitiateSTKPush).toHaveBeenCalledWith(
          expect.objectContaining({
            account_reference: 'Custom Bill Name',
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
      const amountInput = screen.getByPlaceholderText('0');
      const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
      const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
      const addButton = screen.getByText('+');

      await user.type(billNameInput, 'Bill');
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
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('handles getCurrentUser error gracefully', async () => {
      mockGetCurrentUser.mockRejectedValue(new Error('Failed to fetch user'));

      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      render(
        <BrowserRouter>
          <CreateNewBillPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockGetCurrentUser).toHaveBeenCalled();
      });

      // Should still render the page
      expect(screen.getByText('Create New Bill')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

  });
});
