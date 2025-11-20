import { render, screen } from '@testing-library/react';
import { Settings } from 'lucide-react';
import SectionCard from '../SectionCard';

describe('SectionCard', () => {
  it('renders section title', () => {
    render(
      <SectionCard title="Test Section" icon={Settings}>
        <div>Test Content</div>
      </SectionCard>
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <SectionCard title="Test Section" icon={Settings}>
        <div>Test Content</div>
      </SectionCard>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(
      <SectionCard title="Test Section" icon={Settings}>
        <div>Test Content</div>
      </SectionCard>
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies correct card styling', () => {
    const { container } = render(
      <SectionCard title="Test Section" icon={Settings}>
        <div>Test Content</div>
      </SectionCard>
    );
    const card = container.firstChild;
    expect(card).toHaveClass('card-visual', 'mb-4', 'overflow-hidden');
  });

  it('renders title with icon in header section', () => {
    render(
      <SectionCard title="Settings" icon={Settings}>
        <div>Settings Content</div>
      </SectionCard>
    );
    const title = screen.getByText('Settings');
    expect(title).toHaveClass('font-semibold', 'text-slate-900');
  });

  it('renders multiple children correctly', () => {
    render(
      <SectionCard title="Test Section" icon={Settings}>
        <div>First Child</div>
        <div>Second Child</div>
      </SectionCard>
    );
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('has correct padding structure', () => {
    const { container } = render(
      <SectionCard title="Test Section" icon={Settings}>
        <div>Test Content</div>
      </SectionCard>
    );
    const header = container.querySelector('.px-5.pt-4.pb-3');
    const content = container.querySelector('.px-5.pb-2');
    expect(header).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });
});
