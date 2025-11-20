import React from 'react';
import { render, screen } from '@/test-utils';
import { Card } from '../Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders children content', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Card>
          <h1>Title</h1>
          <p>Description</p>
          <button>Action</button>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });

    it('applies base card styles', () => {
      const { container } = render(
        <Card>
          <div>Content</div>
        </Card>
      );
      const cardDiv = container.querySelector('.card-visual');
      expect(cardDiv).toHaveClass('card-visual', 'p-4');
    });

    it('applies custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <div>Content</div>
        </Card>
      );
      const cardDiv = container.querySelector('.card-visual');
      expect(cardDiv).toHaveClass('custom-class');
    });

    it('combines custom className with base styles', () => {
      const { container } = render(
        <Card className="mt-4 mb-2">
          <div>Content</div>
        </Card>
      );
      const cardDiv = container.querySelector('.card-visual');
      expect(cardDiv).toHaveClass('card-visual', 'p-4', 'mt-4', 'mb-2');
    });

    it('accepts empty className', () => {
      const { container } = render(
        <Card className="">
          <div>Content</div>
        </Card>
      );
      const cardDiv = container.querySelector('.card-visual');
      expect(cardDiv).toHaveClass('card-visual', 'p-4');
    });
  });

  describe('Children Variations', () => {
    it('renders text content directly', () => {
      render(<Card>Simple text content</Card>);
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('renders complex nested components', () => {
      render(
        <Card>
          <div>
            <header>Header</header>
            <main>
              <section>Section 1</section>
              <section>Section 2</section>
            </main>
            <footer>Footer</footer>
          </div>
        </Card>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('renders with null children', () => {
      const { container } = render(<Card>{null}</Card>);
      const cardDiv = container.querySelector('.card-visual');
      expect(cardDiv).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      const { container } = render(<Card>{undefined}</Card>);
      const cardDiv = container.querySelector('.card-visual');
      expect(cardDiv).toBeInTheDocument();
    });

    it('renders with conditional children', () => {
      const showContent = true;
      render(<Card>{showContent && <div>Conditional content</div>}</Card>);
      expect(screen.getByText('Conditional content')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('works as a wrapper for form elements', () => {
      render(
        <Card>
          <form>
            <input type="text" aria-label="Username" />
            <button type="submit">Submit</button>
          </form>
        </Card>
      );
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('works as a wrapper for lists', () => {
      render(
        <Card>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </Card>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });
});
