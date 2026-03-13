import { render, screen, fireEvent } from '@testing-library/react';
import TabsContainer from '../TabsContainer';

describe('TabsContainer', () => {
  const mockOnTabChange = vi.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('renders both tab buttons', () => {
    render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    expect(screen.getByText('Bills')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
  });

  it('highlights bills tab when active', () => {
    const { container } = render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toHaveClass('translate-x-0');
  });

  it('highlights groups tab when active', () => {
    const { container } = render(
      <TabsContainer activeTab="groups" onTabChange={mockOnTabChange} />
    );

    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toHaveClass('translate-x-full');
  });

  it('calls onTabChange with "bills" when bills tab is clicked', () => {
    render(
      <TabsContainer activeTab="groups" onTabChange={mockOnTabChange} />
    );

    const billsButton = screen.getByText('Bills');
    fireEvent.click(billsButton);

    expect(mockOnTabChange).toHaveBeenCalledWith('bills');
  });

  it('calls onTabChange with "groups" when groups tab is clicked', () => {
    render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const groupsButton = screen.getByText('Groups');
    fireEvent.click(groupsButton);

    expect(mockOnTabChange).toHaveBeenCalledWith('groups');
  });

  it('renders crown icon for groups tab', () => {
    const { container } = render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders sliding pill indicator', () => {
    const { container } = render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('bg-white', 'rounded-full', 'shadow-sm');
  });

  it('positions indicator at start when bills is active', () => {
    const { container } = render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toHaveClass('translate-x-0');
  });

  it('positions indicator at end when groups is active', () => {
    const { container } = render(
      <TabsContainer activeTab="groups" onTabChange={mockOnTabChange} />
    );

    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toHaveClass('translate-x-full');
  });

  it('renders with rounded background container', () => {
    const { container } = render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const tabContainer = container.querySelector('.bg-gray-200.rounded-full');
    expect(tabContainer).toBeInTheDocument();
  });

  it('applies transition animation to indicator', () => {
    const { container } = render(
      <TabsContainer activeTab="bills" onTabChange={mockOnTabChange} />
    );

    const indicator = container.querySelector('[aria-hidden="true"]');
    expect(indicator).toHaveClass('transition-transform', 'duration-200', 'ease-in-out');
  });
});
