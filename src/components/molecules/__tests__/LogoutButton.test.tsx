import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from '../LogoutButton';

describe('LogoutButton', () => {
  it('renders logout button with correct text', () => {
    render(<LogoutButton />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders logout icon', () => {
    const { container } = render(<LogoutButton />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<LogoutButton onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when onClick is not provided', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should not throw error
    expect(button).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full', 'card-visual', 'hover:bg-red-50');
  });

  it('has red text color for logout action', () => {
    render(<LogoutButton />);

    const text = screen.getByText('Logout');
    expect(text).toHaveClass('text-red-600');
  });
});
