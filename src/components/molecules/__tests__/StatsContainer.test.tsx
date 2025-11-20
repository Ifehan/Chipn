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

  it('displays pending amount', () => {
    render(<StatsContainer />);
    const amounts = screen.getAllByText('KSh 0');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it('displays collected amount', () => {
    render(<StatsContainer />);
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
