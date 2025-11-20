import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  const defaultProps = {
    userName: 'John Doe',
    phoneNumber: '+254712345678',
    avatar: 'JD',
  };

  it('renders user information correctly', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument();
    expect(screen.getByText('+254712345678')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders profile button', () => {
    render(<Header {...defaultProps} />);

    const profileButton = screen.getByRole('button', { name: /open profile settings/i });
    expect(profileButton).toBeInTheDocument();
  });

  it('calls onProfileClick when profile button is clicked', () => {
    const mockOnProfileClick = jest.fn();
    render(<Header {...defaultProps} onProfileClick={mockOnProfileClick} />);

    const profileButton = screen.getByRole('button', { name: /open profile settings/i });
    fireEvent.click(profileButton);

    expect(mockOnProfileClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onProfileClick when not provided', () => {
    render(<Header {...defaultProps} />);

    const profileButton = screen.getByRole('button', { name: /open profile settings/i });
    fireEvent.click(profileButton);

    // Should not throw error
    expect(profileButton).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Header {...defaultProps} />);

    const avatarContainer = container.querySelector('.bg-emerald-100');
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer).toHaveClass('rounded-full', 'ring-1', 'ring-emerald-200');
  });
});
