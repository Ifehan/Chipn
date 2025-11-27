import { render, screen } from '@testing-library/react';
import StatsContainer from '../StatsContainer';

describe('StatsContainer', () => {
  it('renders pending stat card', () => {
    render(<StatsContainer />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders collected stat card', () => {
    render(<StatsContainer />);
    expect(screen.getByText('Collected')).toBeInTheDocument();
  });

  it('displays default amounts when no props provided', () => {
    render(<StatsContainer />);
    const amounts = screen.getAllByText('KSh 0');
    expect(amounts).toHaveLength(2);
  });

  it('displays pending amount from props', () => {
    render(<StatsContainer pendingTotal={1500} completedTotal={0} />);
    expect(screen.getByText('KSh 1,500')).toBeInTheDocument();
  });

  it('displays completed amount from props', () => {
    render(<StatsContainer pendingTotal={0} completedTotal={2500} />);
    expect(screen.getByText('KSh 2,500')).toBeInTheDocument();
  });

  it('displays both amounts with proper formatting', () => {
    render(<StatsContainer pendingTotal={12345} completedTotal={67890} />);
    expect(screen.getByText('KSh 12,345')).toBeInTheDocument();
    expect(screen.getByText('KSh 67,890')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    render(<StatsContainer pendingTotal={0} completedTotal={0} />);
    const amounts = screen.getAllByText('KSh 0');
    expect(amounts).toHaveLength(2);
  });

  it('renders icons for both stat cards', () => {
    const { container } = render(<StatsContainer />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('renders in a grid layout', () => {
    const { container } = render(<StatsContainer />);
    const grid = container.querySelector('.grid.grid-cols-2');
    expect(grid).toBeInTheDocument();
  });

  it('applies correct spacing', () => {
    const { container } = render(<StatsContainer />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('gap-4', 'mb-6');
  });

  it('renders two stat cards', () => {
    const { container } = render(<StatsContainer />);
    const statCards = container.querySelectorAll('.grid > *');
    expect(statCards).toHaveLength(2);
  });
});
