import { render, screen } from '@testing-library/react';
import ProfileCard from '../ProfileCard';

describe('ProfileCard', () => {
  const defaultProps = {
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    phoneNumber: '+254712345678',
    avatar: 'JD',
  };

  it('renders user name', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders user email', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('renders phone number', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('+254712345678')).toBeInTheDocument();
  });

  it('renders avatar with initials', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders verified account badge', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('Verified Account')).toBeInTheDocument();
  });

  it('renders mail icon', () => {
    const { container } = render(<ProfileCard {...defaultProps} />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('applies correct card styling', () => {
    const { container } = render(<ProfileCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('card-visual', 'mb-4', 'p-5');
  });

  it('renders with correct layout structure', () => {
    const { container } = render(<ProfileCard {...defaultProps} />);
    const flexContainer = container.querySelector('.flex.items-start.gap-3');
    expect(flexContainer).toBeInTheDocument();
  });

  it('displays verified badge with shield icon', () => {
    render(<ProfileCard {...defaultProps} />);
    const verifiedBadge = screen.getByText('Verified Account');
    expect(verifiedBadge).toHaveClass('text-emerald-600');
  });
});
