import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuickActions from '../QuickActions';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('QuickActions', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders quick actions heading', () => {
    renderWithRouter(<QuickActions />);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('renders split bill button', () => {
    renderWithRouter(<QuickActions />);
    expect(screen.getByText('Split Bill')).toBeInTheDocument();
  });

  it('renders history button', () => {
    renderWithRouter(<QuickActions />);
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('navigates to create bill page when split bill is clicked', () => {
    renderWithRouter(<QuickActions />);

    const splitBillButton = screen.getByText('Split Bill');
    fireEvent.click(splitBillButton);

    expect(mockNavigate).toHaveBeenCalledWith('/create-bill');
  });

  it('navigates to transaction history page when history is clicked', () => {
    renderWithRouter(<QuickActions />);

    const historyButton = screen.getByText('History');
    fireEvent.click(historyButton);

    expect(mockNavigate).toHaveBeenCalledWith('/transactions');
  });

  it('renders buttons in a grid layout', () => {
    const { container } = renderWithRouter(<QuickActions />);
    const grid = container.querySelector('.grid.grid-cols-2');
    expect(grid).toBeInTheDocument();
  });

  it('renders split bill button with primary variant', () => {
    renderWithRouter(<QuickActions />);
    const splitBillButton = screen.getByText('Split Bill');
    expect(splitBillButton.closest('button')).toHaveClass('quick-action');
  });

  it('renders history button with outline variant', () => {
    renderWithRouter(<QuickActions />);
    const historyButton = screen.getByText('History');
    expect(historyButton.closest('button')).toHaveClass('quick-action', 'bg-white');
  });

  it('renders icons for both buttons', () => {
    const { container } = renderWithRouter(<QuickActions />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });
});
