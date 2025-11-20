import React from 'react';
import { render, screen } from '@/test-utils';
import { AuthCard } from '../AuthCard';

describe('AuthCard', () => {
  const mockChildren = <div data-testid="mock-children">Test Content</div>;

  describe('Rendering', () => {
    it('renders with title', () => {
      render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with subtitle when provided', () => {
      render(
        <AuthCard title="Test Title" subtitle="Test Subtitle">
          {mockChildren}
        </AuthCard>
      );
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      expect(screen.getByTestId('mock-children')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders logo emoji', () => {
      render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      expect(screen.getByText('📞')).toBeInTheDocument();
    });

    it('renders footer text', () => {
      render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      expect(screen.getByText('Secure • Fast • Trusted by thousands of Kenyans')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct container classes', () => {
      const { container } = render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'p-4');
    });

    it('applies correct card classes', () => {
      const { container } = render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      const cardDiv = container.querySelector('.bg-white');
      expect(cardDiv).toHaveClass('bg-white', 'rounded-2xl', 'shadow-lg', 'p-8');
    });
  });

  describe('Layout', () => {
    it('renders title as h1 element', () => {
      render(<AuthCard title="Test Title">{mockChildren}</AuthCard>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Test Title');
    });

    it('centers subtitle text when provided', () => {
      render(
        <AuthCard title="Test Title" subtitle="Test Subtitle">
          {mockChildren}
        </AuthCard>
      );
      const subtitle = screen.getByText('Test Subtitle');
      expect(subtitle).toHaveClass('text-center');
    });
  });
});
