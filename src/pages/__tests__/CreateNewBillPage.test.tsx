import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CreateNewBillPage from '../CreateNewBillPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

const renderCreateNewBillPage = () => {
  return render(
    <BrowserRouter>
      <CreateNewBillPage />
    </BrowserRouter>
  );
};

describe('CreateNewBillPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Create New Bill')).toBeInTheDocument();
  });

  it('renders page title', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Create New Bill')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderCreateNewBillPage();
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

  it('renders bill details section', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Bill Details')).toBeInTheDocument();
  });

  it('renders informational message', () => {
    renderCreateNewBillPage();
    expect(
      screen.getByText(/You've already paid this bill/i)
    ).toBeInTheDocument();
  });

  it('renders total amount input', () => {
    renderCreateNewBillPage();
    const amountInput = screen.getByPlaceholderText('0');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveAttribute('type', 'number');
  });

  it('renders description input', () => {
    renderCreateNewBillPage();
    const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).toHaveAttribute('type', 'text');
  });

  it('updates total amount when user types', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

    const amountInput = screen.getByPlaceholderText('0');
    await user.type(amountInput, '1000');

    expect(amountInput).toHaveValue(1000);
  });

  it('updates description when user types', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

    const descriptionInput = screen.getByPlaceholderText(/What's this bill for/i);
    await user.type(descriptionInput, 'Lunch at Java House');

    expect(descriptionInput).toHaveValue('Lunch at Java House');
  });

  it('renders split method section', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Split Method')).toBeInTheDocument();
  });

  it('renders SplitMethodSelector component', () => {
    renderCreateNewBillPage();
    expect(screen.getByTestId('mock-split-method-selector')).toBeInTheDocument();
  });

  it('starts with equal split method by default', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Selected: equal')).toBeInTheDocument();
  });

  it('changes split method when selector is used', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

    const customButton = screen.getByText('Custom');
    await user.click(customButton);

    expect(screen.getByText('Selected: custom')).toBeInTheDocument();
  });

  it('renders participants section', () => {
    renderCreateNewBillPage();
    expect(screen.getByText(/Participants \(0\)/i)).toBeInTheDocument();
  });

  it('renders add from contacts button', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Add from Contacts')).toBeInTheDocument();
  });

  it('renders phone input for manual entry', () => {
    renderCreateNewBillPage();
    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveAttribute('type', 'tel');
  });

  it('renders add participant button', () => {
    renderCreateNewBillPage();
    const addButton = screen.getByText('+');
    expect(addButton).toBeInTheDocument();
  });

  it('adds participant when phone number is entered and add button is clicked', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    expect(screen.getByText('+254712345678')).toBeInTheDocument();
    expect(screen.getByText(/Participants \(1\)/i)).toBeInTheDocument();
  });

  it('clears phone input after adding participant', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

    const phoneInput = screen.getByPlaceholderText(/0712345678 or \+254712345678/i);
    const addButton = screen.getByText('+');

    await user.type(phoneInput, '+254712345678');
    await user.click(addButton);

    expect(phoneInput).toHaveValue('');
  });

  it('shows empty state when no participants added', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('No participants added yet')).toBeInTheDocument();
    expect(screen.getByText(/Add from contacts or enter phone numbers manually/i)).toBeInTheDocument();
  });

  it('removes participant when remove button is clicked', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

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

  it('renders send payment requests button', () => {
    renderCreateNewBillPage();
    expect(screen.getByText('Send Payment Requests')).toBeInTheDocument();
  });

  it('disables send button when form is invalid', () => {
    renderCreateNewBillPage();
    const sendButton = screen.getByText('Send Payment Requests');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when form is valid', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

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
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const user = userEvent.setup();
    renderCreateNewBillPage();

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

    expect(consoleSpy).toHaveBeenCalledWith('[v0] Bill details:', {
      billName: 'Lunch Bill',
      totalAmount: '1000',
      description: 'Lunch',
      splitMethod: 'equal',
      participants: ['+254712345678'],
    });
    expect(mockNavigate).toHaveBeenCalledWith('/home');

    consoleSpy.mockRestore();
  });

  it('has correct page layout', () => {
    const { container } = renderCreateNewBillPage();

    const mainContainer = container.querySelector('.app-shell');
    expect(mainContainer).toBeInTheDocument();
  });

  it('adds multiple participants', async () => {
    const user = userEvent.setup();
    renderCreateNewBillPage();

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
});
