import React from 'react';
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { GroupsContent } from '../GroupsContent';

describe('GroupsContent', () => {
  describe('Rendering', () => {
    it('renders the main heading', () => {
      render(<GroupsContent />);
      expect(screen.getByText('Unlock Groups & Recurring Bills')).toBeInTheDocument();
    });

    it('renders the description text', () => {
      render(<GroupsContent />);
      expect(
        screen.getByText(/Create groups for your roommates, work crew, or friends/i)
      ).toBeInTheDocument();
    });

    it('renders the crown emojis', () => {
      render(<GroupsContent />);
      const crowns = screen.getAllByText('👑');
      expect(crowns).toHaveLength(2);
    });

    it('renders the upgrade button', () => {
      render(<GroupsContent />);
      const button = screen.getByRole('button', { name: /upgrade to pro/i });
      expect(button).toBeInTheDocument();
    });

    it('renders all feature items', () => {
      const { container } = render(<GroupsContent />);
      const featureItems = container.querySelectorAll('li');
      expect(featureItems).toHaveLength(3);
    });

    it('renders save groups feature', () => {
      render(<GroupsContent />);
      expect(screen.getByText('Save groups with persistent members')).toBeInTheDocument();
    });

    it('renders recurring bills feature', () => {
      render(<GroupsContent />);
      expect(screen.getByText('Set up recurring bills (monthly rent, etc.)')).toBeInTheDocument();
    });

    it('renders automated reminders feature', () => {
      render(<GroupsContent />);
      expect(screen.getByText('Automated payment reminders')).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('upgrade button has correct aria-label', () => {
      render(<GroupsContent />);
      const button = screen.getByRole('button', { name: /upgrade to pro/i });
      expect(button).toHaveAttribute('aria-label', 'Upgrade to Pro');
    });

    it('upgrade button is clickable', async () => {
      const user = userEvent.setup();
      render(<GroupsContent />);
      const button = screen.getByRole('button', { name: /upgrade to pro/i });

      await user.click(button);
      // Button should be clickable without errors
      expect(button).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct container classes', () => {
      const { container } = render(<GroupsContent />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'py-8', 'px-4');
    });

    it('applies yellow theme to card', () => {
      const { container } = render(<GroupsContent />);
      const card = container.querySelector('.bg-yellow-50');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('border', 'border-yellow-200');
    });

    it('applies correct button styles', () => {
      render(<GroupsContent />);
      const button = screen.getByRole('button', { name: /upgrade to pro/i });
      expect(button).toHaveClass('bg-amber-500', 'hover:bg-amber-600', 'text-white');
    });

    it('renders star emojis for features', () => {
      render(<GroupsContent />);
      const stars = screen.getAllByText('⭐');
      expect(stars).toHaveLength(3);
    });
  });

  describe('Layout', () => {
    it('centers content', () => {
      const { container } = render(<GroupsContent />);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('items-center');
    });

    it('applies correct heading styles', () => {
      render(<GroupsContent />);
      const heading = screen.getByText('Unlock Groups & Recurring Bills');
      expect(heading).toHaveClass('text-2xl', 'font-extrabold', 'text-slate-900');
    });

    it('applies correct description styles', () => {
      const { container } = render(<GroupsContent />);
      const description = container.querySelector('.text-slate-600');
      expect(description).toHaveClass('text-sm', 'leading-relaxed');
    });
  });
});
