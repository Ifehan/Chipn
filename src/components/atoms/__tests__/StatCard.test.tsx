import React from 'react';
import { render, screen } from '@/test-utils';
import { StatCard } from '../StatCard';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

describe('StatCard Component', () => {
  describe('Rendering', () => {
    it('renders with label and amount', () => {
      render(
        <StatCard
          label="Total Spent"
          amount="$1,234.56"
          icon={<DollarSign size={16} className="text-gray-500" />}
        />
      );
      expect(screen.getByText('Total Spent')).toBeInTheDocument();
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('renders the provided icon', () => {
      const { container } = render(
        <StatCard
          label="Revenue"
          amount="$5,000"
          icon={<DollarSign size={16} className="text-gray-500" data-testid="icon" />}
        />
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies correct styles to label', () => {
      render(
        <StatCard
          label="Expenses"
          amount="$2,000"
          icon={<DollarSign size={16} />}
        />
      );
      const label = screen.getByText('Expenses');
      expect(label).toHaveClass('text-gray-600', 'text-xs', 'font-medium');
    });

    it('applies correct styles to amount', () => {
      render(
        <StatCard
          label="Balance"
          amount="$10,000"
          icon={<DollarSign size={16} />}
        />
      );
      const amount = screen.getByText('$10,000');
      expect(amount).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');
    });

    it('wraps content in Card component', () => {
      const { container } = render(
        <StatCard
          label="Total"
          amount="$100"
          icon={<DollarSign size={16} />}
        />
      );
      const card = container.querySelector('.card-visual');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Icon Variations', () => {
    it('renders with custom icon size', () => {
      render(
        <StatCard
          label="Sales"
          amount="$3,000"
          icon={<DollarSign size={20} data-testid="custom-icon" />}
        />
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders with different icon types', () => {
      render(
        <StatCard
          label="Growth"
          amount="+15%"
          icon={<TrendingUp size={16} data-testid="trending-icon" />}
        />
      );
      expect(screen.getByTestId('trending-icon')).toBeInTheDocument();
    });

    it('renders icon with custom className', () => {
      render(
        <StatCard
          label="Decline"
          amount="-5%"
          icon={<TrendingDown size={16} className="text-red-500" data-testid="red-icon" />}
        />
      );
      const icon = screen.getByTestId('red-icon');
      expect(icon).toHaveClass('text-red-500');
    });
  });

  describe('Amount Formats', () => {
    it('handles currency amounts', () => {
      render(
        <StatCard
          label="Revenue"
          amount="$1,234.56"
          icon={<DollarSign size={16} />}
        />
      );
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('handles percentage amounts', () => {
      render(
        <StatCard
          label="Growth Rate"
          amount="+25%"
          icon={<TrendingUp size={16} />}
        />
      );
      expect(screen.getByText('+25%')).toBeInTheDocument();
    });

    it('handles numeric amounts', () => {
      render(
        <StatCard
          label="Count"
          amount="1,500"
          icon={<DollarSign size={16} />}
        />
      );
      expect(screen.getByText('1,500')).toBeInTheDocument();
    });

    it('handles zero amount', () => {
      render(
        <StatCard
          label="Balance"
          amount="$0.00"
          icon={<DollarSign size={16} />}
        />
      );
      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles negative amounts', () => {
      render(
        <StatCard
          label="Deficit"
          amount="-$500"
          icon={<DollarSign size={16} />}
        />
      );
      expect(screen.getByText('-$500')).toBeInTheDocument();
    });
  });

  describe('Trend Prop', () => {
    it('accepts trend prop with up value', () => {
      const { container } = render(
        <StatCard
          label="Sales"
          amount="$5,000"
          icon={<TrendingUp size={16} />}
          trend="up"
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('accepts trend prop with down value', () => {
      const { container } = render(
        <StatCard
          label="Expenses"
          amount="$2,000"
          icon={<TrendingDown size={16} />}
          trend="down"
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('works without trend prop', () => {
      const { container } = render(
        <StatCard
          label="Neutral"
          amount="$1,000"
          icon={<DollarSign size={16} />}
        />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('displays elements in correct structure', () => {
      const { container } = render(
        <StatCard
          label="Total"
          amount="$100"
          icon={<DollarSign size={16} data-testid="icon" />}
        />
      );

      const card = container.querySelector('.card-visual');
      expect(card).toBeInTheDocument();

      // Check that both label and amount are present
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('maintains flex layout structure', () => {
      const { container } = render(
        <StatCard
          label="Balance"
          amount="$500"
          icon={<DollarSign size={16} />}
        />
      );

      const flexContainer = container.querySelector('.flex.flex-col.gap-2');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});
