import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomSplitInput from '../CustomSplitInput';

describe('CustomSplitInput', () => {
  const defaultProps = {
    participants: ['+254711111111', '+254722222222'],
    currentUserPhone: '+254700000000',
    customAmounts: {},
    onCustomAmountsChange: jest.fn(),
    totalAmount: 300,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all participants including current user', () => {
    render(<CustomSplitInput {...defaultProps} />);
    expect(screen.getByText('+254700000000 (You)')).toBeInTheDocument();
    expect(screen.getByText('+254711111111')).toBeInTheDocument();
    expect(screen.getByText('+254722222222')).toBeInTheDocument();
  });

  it('renders the assign amounts label and split evenly button', () => {
    render(<CustomSplitInput {...defaultProps} />);
    expect(screen.getByText('Assign amounts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /split evenly/i })).toBeInTheDocument();
  });

  it('renders an input for each participant', () => {
    render(<CustomSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    // 3 participants: currentUser + 2 participants
    expect(inputs).toHaveLength(3);
  });

  it('displays KSH label for each participant input', () => {
    render(<CustomSplitInput {...defaultProps} />);
    const kshLabels = screen.getAllByText('KSH');
    expect(kshLabels).toHaveLength(3);
  });

  it('calls onCustomAmountsChange when input value changes', () => {
    render(<CustomSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '100' } });
    expect(defaultProps.onCustomAmountsChange).toHaveBeenCalledWith({
      '+254700000000': 100,
    });
  });

  it('does not call onCustomAmountsChange for negative values', () => {
    render(<CustomSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '-10' } });
    expect(defaultProps.onCustomAmountsChange).not.toHaveBeenCalled();
  });

  it('does not call onCustomAmountsChange for non-numeric values', () => {
    render(<CustomSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: 'abc' } });
    expect(defaultProps.onCustomAmountsChange).not.toHaveBeenCalled();
  });

  it('treats empty string input as 0 after clearing a typed value', async () => {
    const user = userEvent.setup();
    render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 50 }}
      />
    );
    const inputs = screen.getAllByRole('spinbutton');
    await user.clear(inputs[0]);
    expect(defaultProps.onCustomAmountsChange).toHaveBeenCalledWith({
      '+254700000000': 0,
    });
  });

  it('distributes amounts evenly when split evenly button is clicked', () => {
    render(<CustomSplitInput {...defaultProps} />);
    const splitButton = screen.getByRole('button', { name: /split evenly/i });
    fireEvent.click(splitButton);
    expect(defaultProps.onCustomAmountsChange).toHaveBeenCalledWith({
      '+254700000000': 100,
      '+254711111111': 100,
      '+254722222222': 100,
    });
  });

  it('assigns remainder to the last participant for uneven splits', () => {
    render(<CustomSplitInput {...defaultProps} totalAmount={100} />);
    const splitButton = screen.getByRole('button', { name: /split evenly/i });
    fireEvent.click(splitButton);
    const result = defaultProps.onCustomAmountsChange.mock.calls[0][0];
    const total = Object.values(result as Record<string, number>).reduce((s, v) => s + v, 0);
    expect(Math.round(total * 100) / 100).toBe(100);
  });

  it('shows assigned total vs totalAmount in the validation indicator', () => {
    render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 100, '+254711111111': 100, '+254722222222': 100 }}
      />
    );
    expect(screen.getByText('Assigned: KSH 300 / 300')).toBeInTheDocument();
  });

  it('shows remaining amount when not fully assigned', () => {
    render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 100 }}
      />
    );
    expect(screen.getByText('KSH 200 remaining')).toBeInTheDocument();
  });

  it('shows over amount when assigned exceeds total', () => {
    render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 200, '+254711111111': 150 }}
      />
    );
    expect(screen.getByText('KSH 50 over')).toBeInTheDocument();
  });

  it('applies emerald color class when amounts are valid', () => {
    const { container } = render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 100, '+254711111111': 100, '+254722222222': 100 }}
      />
    );
    const indicator = container.querySelector('.text-emerald-600');
    expect(indicator).toBeInTheDocument();
  });

  it('applies amber color class when amounts are invalid', () => {
    const { container } = render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 50 }}
      />
    );
    const indicator = container.querySelector('.text-amber-600');
    expect(indicator).toBeInTheDocument();
  });

  it('does not show remaining/over message when split is valid', () => {
    render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 100, '+254711111111': 100, '+254722222222': 100 }}
      />
    );
    expect(screen.queryByText(/remaining/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/over/i)).not.toBeInTheDocument();
  });

  it('pre-fills inputs with provided customAmounts', () => {
    render(
      <CustomSplitInput
        {...defaultProps}
        customAmounts={{ '+254700000000': 150 }}
      />
    );
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(150);
  });
});
