import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PercentageSplitInput from '../PercentageSplitInput';

describe('PercentageSplitInput', () => {
  const defaultProps = {
    participants: ['+254711111111', '+254722222222'],
    currentUserPhone: '+254700000000',
    percentages: {},
    onPercentagesChange: jest.fn(),
    totalAmount: 300,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all participants including current user', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    expect(screen.getByText('+254700000000 (You)')).toBeInTheDocument();
    expect(screen.getByText('+254711111111')).toBeInTheDocument();
    expect(screen.getByText('+254722222222')).toBeInTheDocument();
  });

  it('renders the assign percentages label and split evenly button', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    expect(screen.getByText('Assign percentages')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /split evenly/i })).toBeInTheDocument();
  });

  it('renders an input for each participant', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(3);
  });

  it('calls onPercentagesChange when input value changes', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '50' } });
    expect(defaultProps.onPercentagesChange).toHaveBeenCalledWith({
      '+254700000000': 50,
    });
  });

  it('does not call onPercentagesChange for negative values', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '-10' } });
    expect(defaultProps.onPercentagesChange).not.toHaveBeenCalled();
  });

  it('does not call onPercentagesChange for values above 100', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '101' } });
    expect(defaultProps.onPercentagesChange).not.toHaveBeenCalled();
  });

  it('does not call onPercentagesChange for non-numeric values', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: 'abc' } });
    expect(defaultProps.onPercentagesChange).not.toHaveBeenCalled();
  });

  it('treats empty string input as 0 after clearing a typed value', async () => {
    const user = userEvent.setup();
    render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50 }}
      />
    );
    const inputs = screen.getAllByRole('spinbutton');
    await user.clear(inputs[0]);
    expect(defaultProps.onPercentagesChange).toHaveBeenCalledWith({
      '+254700000000': 0,
    });
  });

  it('distributes percentages evenly when split evenly is clicked', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const splitButton = screen.getByRole('button', { name: /split evenly/i });
    fireEvent.click(splitButton);
    expect(defaultProps.onPercentagesChange).toHaveBeenCalledWith({
      '+254700000000': 33.33,
      '+254711111111': 33.33,
      '+254722222222': 33.34,
    });
  });

  it('ensures even split always sums to exactly 100', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const splitButton = screen.getByRole('button', { name: /split evenly/i });
    fireEvent.click(splitButton);
    const result = defaultProps.onPercentagesChange.mock.calls[0][0];
    const total = Object.values(result as Record<string, number>).reduce((s, v) => s + v, 0);
    expect(Math.round(total * 100) / 100).toBe(100);
  });

  it('pre-fills inputs with provided percentages', () => {
    render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 40 }}
      />
    );
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs[0]).toHaveValue(40);
  });

  it('displays calculated KSH amount per participant based on percentage', () => {
    render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50, '+254711111111': 30, '+254722222222': 20 }}
      />
    );
    expect(screen.getByText('KSH 150')).toBeInTheDocument();
    expect(screen.getByText('KSH 90')).toBeInTheDocument();
    expect(screen.getByText('KSH 60')).toBeInTheDocument();
  });

  it('displays KSH 0 for participants with no percentage assigned', () => {
    render(<PercentageSplitInput {...defaultProps} />);
    const zeroAmounts = screen.getAllByText('KSH 0');
    expect(zeroAmounts).toHaveLength(3);
  });

  it('shows total percentage in the validation indicator', () => {
    render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50, '+254711111111': 30, '+254722222222': 20 }}
      />
    );
    expect(screen.getByText('Total: 100.00%')).toBeInTheDocument();
  });

  it('shows must equal 100% warning when total is not 100', () => {
    render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50 }}
      />
    );
    expect(screen.getByText('Must equal 100%')).toBeInTheDocument();
  });

  it('does not show must equal 100% warning when total is exactly 100', () => {
    render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50, '+254711111111': 30, '+254722222222': 20 }}
      />
    );
    expect(screen.queryByText('Must equal 100%')).not.toBeInTheDocument();
  });

  it('applies emerald color class when total percentage is valid', () => {
    const { container } = render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50, '+254711111111': 30, '+254722222222': 20 }}
      />
    );
    expect(container.querySelector('.text-emerald-600')).toBeInTheDocument();
  });

  it('applies amber color class when total percentage is invalid', () => {
    const { container } = render(
      <PercentageSplitInput
        {...defaultProps}
        percentages={{ '+254700000000': 50 }}
      />
    );
    expect(container.querySelector('.text-amber-600')).toBeInTheDocument();
  });
});
