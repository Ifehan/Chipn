import { render, screen, fireEvent } from '@testing-library/react';
import SplitMethodSelector from '../SplitMethodSelector';

describe('SplitMethodSelector', () => {
  const mockOnMethodChange = jest.fn();

  beforeEach(() => {
    mockOnMethodChange.mockClear();
  });

  it('renders all three split method buttons', () => {
    render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    expect(screen.getByText('Equal')).toBeInTheDocument();
    expect(screen.getByText('Percentage')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('highlights equal split when selected', () => {
    render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    const equalButton = screen.getByText('Equal').closest('button');
    expect(equalButton).toHaveClass('bg-black', 'text-white');
  });

  it('highlights percentage split when selected', () => {
    render(
      <SplitMethodSelector
        selectedMethod="percentage"
        onMethodChange={mockOnMethodChange}
      />
    );

    const percentageButton = screen.getByText('Percentage').closest('button');
    expect(percentageButton).toHaveClass('bg-black', 'text-white');
  });

  it('highlights custom split when selected', () => {
    render(
      <SplitMethodSelector
        selectedMethod="custom"
        onMethodChange={mockOnMethodChange}
      />
    );

    const customButton = screen.getByText('Custom').closest('button');
    expect(customButton).toHaveClass('bg-black', 'text-white');
  });

  it('applies outline style to unselected equal split', () => {
    render(
      <SplitMethodSelector
        selectedMethod="custom"
        onMethodChange={mockOnMethodChange}
      />
    );

    const equalButton = screen.getByText('Equal').closest('button');
    expect(equalButton).toHaveClass('bg-white', 'border', 'border-gray-200');
  });

  it('applies outline style to unselected custom split', () => {
    render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    const customButton = screen.getByText('Custom').closest('button');
    expect(customButton).toHaveClass('bg-white', 'border', 'border-gray-200');
  });

  it('calls onMethodChange with "equal" when equal split is clicked', () => {
    render(
      <SplitMethodSelector
        selectedMethod="custom"
        onMethodChange={mockOnMethodChange}
      />
    );

    const equalButton = screen.getByText('Equal');
    fireEvent.click(equalButton);

    expect(mockOnMethodChange).toHaveBeenCalledWith('equal');
  });

  it('calls onMethodChange with "percentage" when percentage split is clicked', () => {
    render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    const percentageButton = screen.getByText('Percentage');
    fireEvent.click(percentageButton);

    expect(mockOnMethodChange).toHaveBeenCalledWith('percentage');
  });

  it('calls onMethodChange with "custom" when custom split is clicked', () => {
    render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);

    expect(mockOnMethodChange).toHaveBeenCalledWith('custom');
  });

  it('renders icons for all three buttons', () => {
    const { container } = render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(3);
  });

  it('renders in a grid layout', () => {
    const { container } = render(
      <SplitMethodSelector
        selectedMethod="equal"
        onMethodChange={mockOnMethodChange}
      />
    );

    const grid = container.querySelector('.grid.grid-cols-3');
    expect(grid).toBeInTheDocument();
  });
});
