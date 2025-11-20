import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { RecentBillsSection } from '../RecentBillsSection';

describe('RecentBillsSection', () => {
  describe('Rendering', () => {
    it('renders the section heading', () => {
      render(<RecentBillsSection />);
      expect(screen.getByText('Recent Bills')).toBeInTheDocument();
    });

    it('renders the View All link', () => {
      render(<RecentBillsSection />);
      const link = screen.getByRole('link', { name: /view all/i });
      expect(link).toBeInTheDocument();
    });

    it('renders the empty state message', () => {
      render(<RecentBillsSection />);
      expect(screen.getByText('No bills yet')).toBeInTheDocument();
    });

    it('renders the dollar sign icon', () => {
      render(<RecentBillsSection />);
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders the create bill button', () => {
      render(<RecentBillsSection />);
      const button = screen.getByRole('button', { name: /create your first bill/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('renders heading as h2 element', () => {
      render(<RecentBillsSection />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Recent Bills');
    });

    it('View All link has correct href', () => {
      render(<RecentBillsSection />);
      const link = screen.getByRole('link', { name: /view all/i });
      expect(link).toHaveAttribute('href', '#');
    });

    it('applies correct heading styles', () => {
      render(<RecentBillsSection />);
      const heading = screen.getByText('Recent Bills');
      expect(heading).toHaveClass('text-base', 'font-semibold', 'text-slate-900');
    });

    it('applies correct link styles', () => {
      render(<RecentBillsSection />);
      const link = screen.getByRole('link', { name: /view all/i });
      expect(link).toHaveClass('text-sm', 'text-slate-900', 'font-medium', 'hover:underline');
    });
  });

  describe('Empty State', () => {
    it('renders empty state card', () => {
      const { container } = render(<RecentBillsSection />);
      const card = container.querySelector('.card-visual');
      expect(card).toBeInTheDocument();
    });

    it('applies correct empty state styles', () => {
      const { container } = render(<RecentBillsSection />);
      const card = container.querySelector('.card-visual');
      expect(card).toHaveClass('p-10', 'text-center');
    });

    it('dollar sign has correct styling', () => {
      render(<RecentBillsSection />);
      const dollarSign = screen.getByText('$');
      expect(dollarSign).toHaveClass('text-7xl', 'text-gray-300', 'mb-4', 'font-light');
    });

    it('empty message has correct styling', () => {
      render(<RecentBillsSection />);
      const message = screen.getByText('No bills yet');
      expect(message).toHaveClass('text-slate-700', 'font-medium', 'mb-5', 'text-sm');
    });
  });

  describe('Button', () => {
    it('button has correct styling', () => {
      render(<RecentBillsSection />);
      const button = screen.getByRole('button', { name: /create your first bill/i });
      expect(button).toHaveClass(
        'bg-emerald-600',
        'text-white',
        'font-semibold',
        'py-2.5',
        'px-5',
        'rounded-lg',
        'hover:bg-emerald-700',
        'transition-colors',
        'text-sm'
      );
    });

    it('button is clickable', async () => {
      const user = userEvent.setup();
      render(<RecentBillsSection />);
      const button = screen.getByRole('button', { name: /create your first bill/i });

      await user.click(button);
      // Button should be clickable without errors
      expect(button).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('applies correct container margin', () => {
      const { container } = render(<RecentBillsSection />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('mb-6');
    });

    it('header has correct flex layout', () => {
      const { container } = render(<RecentBillsSection />);
      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('mb-4');
    });
  });
});
