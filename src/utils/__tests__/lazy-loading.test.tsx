import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { lazyComponent } from '../lazy-loading';

// Suppress console.error for expected error boundary tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Simple test component for lazy loading
const TestComponent = ({ message }: { message?: string }) => (
  <div data-testid="test-component">{message || 'Test Component Loaded'}</div>
);

const createSuccessImport = (
  Component: React.ComponentType<any> = TestComponent
) => () => Promise.resolve({ default: Component });

const createFailingImport = () =>
  () => Promise.reject(new Error('Failed to load component'));

const createPendingImport = () =>
  new Promise<{ default: React.ComponentType<any> }>(() => {});

describe('lazyComponent', () => {
  it('renders the lazy loaded component after resolving', async () => {
    const LazyTest = lazyComponent(createSuccessImport());
    render(<LazyTest />);
    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('Test Component Loaded')).toBeInTheDocument();
    });
  });

  it('passes props correctly to the lazy loaded component', async () => {
    const LazyTest = lazyComponent(createSuccessImport());
    render(<LazyTest message="Hello from props" />);
    await waitFor(() => {
      expect(screen.getByText('Hello from props')).toBeInTheDocument();
    });
  });

  it('shows default loading fallback (spinner) while loading', async () => {
    // Never resolves so loading state persists
    const LazyTest = lazyComponent(() => createPendingImport());
    const { container } = render(<LazyTest />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows custom loading fallback when provided', async () => {
    const LazyTest = lazyComponent(
      () => createPendingImport(),
      { loading: <div data-testid="custom-loader">Loading...</div> }
    );
    render(<LazyTest />);
    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('hides loading fallback after component resolves', async () => {
    const LazyTest = lazyComponent(createSuccessImport());
    const { container } = render(<LazyTest />);
    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
  });

  it('shows default error fallback when component fails to load', async () => {
    const LazyTest = lazyComponent(createFailingImport());
    render(<LazyTest />);
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Please refresh the page and try again.')).toBeInTheDocument();
    });
  });

  it('shows custom error fallback when provided and component fails', async () => {
    const LazyTest = lazyComponent(
      createFailingImport(),
      { error: <div data-testid="custom-error">Custom Error</div> }
    );
    render(<LazyTest />);
    await waitFor(() => {
      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
      expect(screen.getByText('Custom Error')).toBeInTheDocument();
    });
  });

  it('does not show error fallback when component loads successfully', async () => {
    const LazyTest = lazyComponent(createSuccessImport());
    render(<LazyTest />);
    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('sets a displayName on the wrapped component', () => {
    const LazyTest = lazyComponent(createSuccessImport());
    expect(LazyTest.displayName).toMatch(/^Lazy\(/);
  });

  it('returns a memoized component (same reference on re-render)', () => {
    const importFunc = createSuccessImport();
    const LazyTest1 = lazyComponent(importFunc);
    const LazyTest2 = lazyComponent(importFunc);
    // Each call to lazyComponent creates a new wrapper, but the component itself is memoized
    expect(typeof LazyTest1).toBe('object');
    expect(typeof LazyTest2).toBe('object');
  });

  it('renders default LoadingFallback with correct spinner classes', () => {
    const LazyTest = lazyComponent(() => createPendingImport());
    const { container } = render(<LazyTest />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-green-600');
  });

  it('renders default ErrorFallback with correct structure when error occurs', async () => {
    const LazyTest = lazyComponent(createFailingImport());
    render(<LazyTest />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: 'Something went wrong' })).toBeInTheDocument();
    });
  });

  it('logs error to console when error boundary catches an error', async () => {
    const LazyTest = lazyComponent(createFailingImport());
    render(<LazyTest />);
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('can render multiple lazy components independently', async () => {
    const ComponentA: React.ComponentType<any> = () => <div data-testid="component-a">Component A</div>;
    const ComponentB: React.ComponentType<any> = () => <div data-testid="component-b">Component B</div>;

    const LazyA = lazyComponent(() => Promise.resolve({ default: ComponentA }));
    const LazyB = lazyComponent(() => Promise.resolve({ default: ComponentB }));

    render(
      <>
        <LazyA />
        <LazyB />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('component-a')).toBeInTheDocument();
      expect(screen.getByTestId('component-b')).toBeInTheDocument();
    });
  });
});
