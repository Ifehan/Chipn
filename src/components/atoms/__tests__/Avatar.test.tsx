import React from 'react';
import { render, screen } from '@/test-utils';
import { Avatar } from '../Avatar';

describe('Avatar Component', () => {
  describe('Rendering', () => {
    it('renders with initials', () => {
      render(<Avatar initials="JD" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('displays the provided initials correctly', () => {
      render(<Avatar initials="AB" />);
      const initialsElement = screen.getByText('AB');
      expect(initialsElement).toHaveClass('text-emerald-600', 'font-semibold', 'text-lg');
    });

    it('applies default medium size by default', () => {
      const { container } = render(<Avatar initials="JD" />);
      const avatarDiv = container.querySelector('.bg-emerald-100');
      expect(avatarDiv).toHaveClass('w-14', 'h-14');
    });

    it('applies small size styles when size is sm', () => {
      const { container } = render(<Avatar initials="JD" size="sm" />);
      const avatarDiv = container.querySelector('.bg-emerald-100');
      expect(avatarDiv).toHaveClass('w-10', 'h-10');
    });

    it('applies medium size styles when size is md', () => {
      const { container } = render(<Avatar initials="JD" size="md" />);
      const avatarDiv = container.querySelector('.bg-emerald-100');
      expect(avatarDiv).toHaveClass('w-14', 'h-14');
    });

    it('applies large size styles when size is lg', () => {
      const { container } = render(<Avatar initials="JD" size="lg" />);
      const avatarDiv = container.querySelector('.bg-emerald-100');
      expect(avatarDiv).toHaveClass('w-16', 'h-16');
    });

    it('applies base avatar styles', () => {
      const { container } = render(<Avatar initials="JD" />);
      const avatarDiv = container.querySelector('.bg-emerald-100');
      expect(avatarDiv).toHaveClass(
        'bg-emerald-100',
        'rounded-full',
        'flex',
        'items-center',
        'justify-center',
        'ring-1',
        'ring-emerald-200',
        'flex-shrink-0'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles single character initials', () => {
      render(<Avatar initials="J" />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('handles long initials', () => {
      render(<Avatar initials="ABCD" />);
      expect(screen.getByText('ABCD')).toBeInTheDocument();
    });

    it('handles lowercase initials', () => {
      render(<Avatar initials="jd" />);
      expect(screen.getByText('jd')).toBeInTheDocument();
    });

    it('handles empty string initials', () => {
      render(<Avatar initials="" />);
      const { container } = render(<Avatar initials="" />);
      const avatarDiv = container.querySelector('.bg-emerald-100');
      expect(avatarDiv).toBeInTheDocument();
    });
  });
});
