import { render, screen } from '@testing-library/react';
import PaymentMethodCard from '../PaymentMethodCard';

describe('PaymentMethodCard', () => {
  const defaultProps = {
    name: 'M-PESA',
    phoneNumber: '+254712345678',
    status: 'Active' as const,
  };

  it('renders payment method name', () => {
    render(<PaymentMethodCard {...defaultProps} />);
    expect(screen.getByText('M-PESA')).toBeInTheDocument();
  });

  it('renders phone number', () => {
    render(<PaymentMethodCard {...defaultProps} />);
    expect(screen.getByText('+254712345678')).toBeInTheDocument();
  });

  it('renders active status', () => {
    render(<PaymentMethodCard {...defaultProps} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders inactive status', () => {
    render(<PaymentMethodCard {...defaultProps} status="Inactive" />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders phone icon', () => {
    const { container } = render(<PaymentMethodCard {...defaultProps} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies correct styling for active status', () => {
    render(<PaymentMethodCard {...defaultProps} />);
    const statusBadge = screen.getByText('Active');
    expect(statusBadge).toHaveClass('text-emerald-700', 'bg-emerald-100');
  });

  it('applies emerald background styling', () => {
    const { container } = render(<PaymentMethodCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-emerald-50', 'border-emerald-200');
  });

  it('renders with correct layout structure', () => {
    const { container } = render(<PaymentMethodCard {...defaultProps} />);
    const iconContainer = container.querySelector('.bg-emerald-600');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass('rounded-full');
  });
});
