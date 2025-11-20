# Testing Documentation

## Overview

This project uses **Jest** and **React Testing Library** for comprehensive unit and integration testing. The testing setup follows the Atomic Design methodology, with tests organized to match the component structure (atoms, molecules, organisms, and pages).

## Testing Stack

- **Jest**: JavaScript testing framework (v30.2.0)
- **React Testing Library**: Testing utilities for React components (v16.3.0)
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions (v6.9.1)
- **@testing-library/user-event**: User interaction simulation (v14.6.1)
- **jest-environment-jsdom**: DOM environment for Jest (v30.2.0)
- **ts-jest**: TypeScript support for Jest (v29.4.5)

## Project Structure

Tests are co-located with their components in `__tests__` directories:

```
src/
├── components/
│   ├── atoms/
│   │   ├── Avatar.tsx
│   │   ├── BackButton.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── SettingItem.tsx
│   │   ├── StatCard.tsx
│   │   ├── TabButton.tsx
│   │   └── __tests__/
│   │       ├── Avatar.test.tsx
│   │       ├── BackButton.test.tsx
│   │       ├── Button.test.tsx
│   │       ├── Card.test.tsx
│   │       ├── Input.test.tsx
│   │       ├── SettingItem.test.tsx
│   │       ├── StatCard.test.tsx
│   │       └── TabButton.test.tsx
│   ├── molecules/
│   │   ├── Header.tsx
│   │   ├── LoginForm.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── PaymentMethodCard.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── QuickActions.tsx
│   │   ├── SectionCard.tsx
│   │   ├── SignupForm.tsx
│   │   ├── SplitMethodSelector.tsx
│   │   ├── StatsContainer.tsx
│   │   ├── TabsContainer.tsx
│   │   └── __tests__/
│   │       ├── Header.test.tsx
│   │       ├── LoginForm.test.tsx
│   │       ├── LogoutButton.test.tsx
│   │       ├── PaymentMethodCard.test.tsx
│   │       ├── ProfileCard.test.tsx
│   │       ├── QuickActions.test.tsx
│   │       ├── SectionCard.test.tsx
│   │       ├── SignupForm.test.tsx
│   │       ├── SplitMethodSelector.test.tsx
│   │       ├── StatsContainer.test.tsx
│   │       └── TabsContainer.test.tsx
│   └── organisms/
│       ├── AccountSettingsSection.tsx
│       ├── AuthCard.tsx
│       ├── EmptyBillsState.tsx
│       ├── GroupsContent.tsx
│       ├── PaymentSettingsSection.tsx
│       ├── RecentBillsSection.tsx
│       ├── SupportSection.tsx
│       └── __tests__/
│           ├── AccountSettingsSection.test.tsx
│           ├── AuthCard.test.tsx
│           ├── EmptyBillsState.test.tsx
│           ├── GroupsContent.test.tsx
│           ├── PaymentSettingsSection.test.tsx
│           ├── RecentBillsSection.test.tsx
│           └── SupportSection.test.tsx
├── pages/
│   ├── CreateNewBillPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProfileSettingsPage.tsx
│   ├── SignupPage.tsx
│   ├── TransactionHistoryPage.tsx
│   ├── WelcomePage.tsx
│   └── __tests__/
│       ├── CreateNewBillPage.test.tsx
│       ├── HomePage.test.tsx
│       ├── LoginPage.test.tsx
│       ├── ProfileSettingsPage.test.tsx
│       ├── SignupPage.test.tsx
│       ├── TransactionHistoryPage.test.tsx
│       └── WelcomePage.test.tsx
└── test-utils/
    └── index.tsx
```

## Running Tests

### Run all tests
```bash
npm test
```

### Watch mode (automatically re-run on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Verbose mode with watch
```bash
npm run test:ui
```

## Test Configuration

### Jest Configuration ([`jest.config.ts`](jest.config.ts))

- **Preset**: `ts-jest` for TypeScript support
- **Test Environment**: `jsdom` for DOM simulation
- **Test Root**: `src/` directory
- **Coverage Threshold**: 70% for branches, functions, lines, and statements
- **Module Name Mapping**:
  - CSS imports are mocked using `identity-obj-proxy`
  - `@/` aliases map to `src/` directory
- **Test Match Patterns**:
  - `**/__tests__/**/*.{ts,tsx}`
  - `**/*.{spec,test}.{ts,tsx}`
- **Coverage Collection**:
  - Includes all `src/**/*.{ts,tsx}` files
  - Excludes type definitions, `main.tsx`, and `vite-env.d.ts`

### Setup File ([`jest.setup.ts`](jest.setup.ts))

Global test environment configuration:

- Imports [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom) for additional matchers
- Polyfills for `TextEncoder` and `TextDecoder`
- Mocks for browser APIs:
  - `window.matchMedia` - for responsive design testing
  - `IntersectionObserver` - for visibility detection
  - `ResizeObserver` - for element resize detection

## Test Utilities

### Custom Render Function ([`src/test-utils/index.tsx`](src/test-utils/index.tsx))

Wraps components with necessary providers for testing:

```typescript
import { render, screen } from '@/test-utils';

// Use custom render instead of RTL's render
render(<YourComponent />);

// With custom route
render(<YourComponent />, { route: '/custom-path' });
```

**Features:**
- Automatically wraps components with `BrowserRouter`
- Supports custom route initialization
- Re-exports all React Testing Library utilities

## Writing Tests

### Unit Tests (Atoms/Molecules)

Test individual component behavior, props, and user interactions:

```typescript
import { render, screen } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with text', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100');
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
```

### Integration Tests (Organisms/Pages)

Test component integration, data flow, and complex user interactions:

```typescript
import { render, screen, waitFor } from '@/test-utils';
import userEvent from '@testing-library/user-event';
import HomePage from '../HomePage';

// Mock child components
jest.mock('../../components/molecules/Header', () => ({
  Header: ({ onProfileClick }: any) => (
    <button onClick={onProfileClick}>Profile</button>
  ),
}));

describe('HomePage Integration', () => {
  it('navigates to profile when profile button is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByText('Profile'));

    expect(screen.getByTestId('mock-profile-settings')).toBeInTheDocument();
  });

  it('switches between tabs', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByText('Groups'));
    expect(screen.getByText('Active: groups')).toBeInTheDocument();
  });
});
```

## Test Coverage

### Current Test Coverage

#### **Atoms (8 components)**
- [`Avatar.test.tsx`](src/components/atoms/__tests__/Avatar.test.tsx)
- [`BackButton.test.tsx`](src/components/atoms/__tests__/BackButton.test.tsx)
- [`Button.test.tsx`](src/components/atoms/__tests__/Button.test.tsx)
- [`Card.test.tsx`](src/components/atoms/__tests__/Card.test.tsx)
- [`Input.test.tsx`](src/components/atoms/__tests__/Input.test.tsx)
- [`SettingItem.test.tsx`](src/components/atoms/__tests__/SettingItem.test.tsx)
- [`StatCard.test.tsx`](src/components/atoms/__tests__/StatCard.test.tsx)
- [`TabButton.test.tsx`](src/components/atoms/__tests__/TabButton.test.tsx)

**Coverage includes:**
- Rendering with different props and variants
- Styling and className application
- User interactions (clicks, focus, hover)
- Accessibility attributes
- Disabled states

#### **Molecules (11 components)**
- [`Header.test.tsx`](src/components/molecules/__tests__/Header.test.tsx)
- [`LoginForm.test.tsx`](src/components/molecules/__tests__/LoginForm.test.tsx)
- [`LogoutButton.test.tsx`](src/components/molecules/__tests__/LogoutButton.test.tsx)
- [`PaymentMethodCard.test.tsx`](src/components/molecules/__tests__/PaymentMethodCard.test.tsx)
- [`ProfileCard.test.tsx`](src/components/molecules/__tests__/ProfileCard.test.tsx)
- [`QuickActions.test.tsx`](src/components/molecules/__tests__/QuickActions.test.tsx)
- [`SectionCard.test.tsx`](src/components/molecules/__tests__/SectionCard.test.tsx)
- [`SignupForm.test.tsx`](src/components/molecules/__tests__/SignupForm.test.tsx)
- [`SplitMethodSelector.test.tsx`](src/components/molecules/__tests__/SplitMethodSelector.test.tsx)
- [`StatsContainer.test.tsx`](src/components/molecules/__tests__/StatsContainer.test.tsx)
- [`TabsContainer.test.tsx`](src/components/molecules/__tests__/TabsContainer.test.tsx)

**Coverage includes:**
- Form validation and submission
- User input handling
- Callback function execution
- Error states and messages
- Component composition

#### **Organisms (7 components)**
- [`AccountSettingsSection.test.tsx`](src/components/organisms/__tests__/AccountSettingsSection.test.tsx)
- [`AuthCard.test.tsx`](src/components/organisms/__tests__/AuthCard.test.tsx)
- [`EmptyBillsState.test.tsx`](src/components/organisms/__tests__/EmptyBillsState.test.tsx)
- [`GroupsContent.test.tsx`](src/components/organisms/__tests__/GroupsContent.test.tsx)
- [`PaymentSettingsSection.test.tsx`](src/components/organisms/__tests__/PaymentSettingsSection.test.tsx)
- [`RecentBillsSection.test.tsx`](src/components/organisms/__tests__/RecentBillsSection.test.tsx)
- [`SupportSection.test.tsx`](src/components/organisms/__tests__/SupportSection.test.tsx)

**Coverage includes:**
- Complex component interactions
- State management
- Conditional rendering
- Data display and formatting
- Multi-step workflows

#### **Pages (7 pages)**
- [`CreateNewBillPage.test.tsx`](src/pages/__tests__/CreateNewBillPage.test.tsx)
- [`HomePage.test.tsx`](src/pages/__tests__/HomePage.test.tsx)
- [`LoginPage.test.tsx`](src/pages/__tests__/LoginPage.test.tsx)
- [`ProfileSettingsPage.test.tsx`](src/pages/__tests__/ProfileSettingsPage.test.tsx)
- [`SignupPage.test.tsx`](src/pages/__tests__/SignupPage.test.tsx)
- [`TransactionHistoryPage.test.tsx`](src/pages/__tests__/TransactionHistoryPage.test.tsx)
- [`WelcomePage.test.tsx`](src/pages/__tests__/WelcomePage.test.tsx)

**Coverage includes:**
- Full page rendering
- Navigation flows
- Component integration
- User workflows
- Error handling

## Best Practices

### 1. Use `screen` queries
```typescript
// ✅ Good
const button = screen.getByRole('button', { name: /submit/i });

// ❌ Avoid
const button = container.querySelector('button');
```

### 2. Prefer semantic queries (in priority order)
1. `getByRole` - Most accessible
2. `getByLabelText` - For form elements
3. `getByPlaceholderText` - For inputs
4. `getByText` - For non-interactive content
5. `getByTestId` - Last resort only

```typescript
// ✅ Best - uses role
const button = screen.getByRole('button', { name: /submit/i });

// ✅ Good - uses label
const input = screen.getByLabelText(/email/i);

// ⚠️ Acceptable - uses text
const heading = screen.getByText(/welcome/i);

// ❌ Avoid - uses test ID
const element = screen.getByTestId('custom-element');
```

### 3. Use `userEvent` over `fireEvent`
```typescript
// ✅ Good - simulates real user interactions
import userEvent from '@testing-library/user-event';
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'text');

// ❌ Less preferred - lower-level events
import { fireEvent } from '@testing-library/react';
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });
```

### 4. Test user behavior, not implementation
```typescript
// ✅ Good - tests what user sees/does
expect(screen.getByText(/error message/i)).toBeInTheDocument();
await user.click(screen.getByRole('button', { name: /submit/i }));

// ❌ Avoid - tests implementation details
expect(component.state.error).toBe('error message');
expect(mockFunction).toHaveBeenCalledWith(specificInternalValue);
```

### 5. Use `waitFor` for async operations
```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// ✅ Also good - for queries
const element = await screen.findByText(/success/i);

// ❌ Avoid - may cause flaky tests
expect(screen.getByText(/success/i)).toBeInTheDocument();
```

### 6. Organize tests with describe blocks
```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {});
    it('renders with custom props', () => {});
  });

  describe('Interactions', () => {
    it('handles click events', async () => {});
    it('handles form submission', async () => {});
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {});
  });
});
```

### 7. Clean up after tests
```typescript
import { cleanup } from '@testing-library/react';

afterEach(() => {
  jest.clearAllMocks();
  cleanup(); // Usually automatic, but explicit is better
});
```

## Common Patterns

### Testing Forms
```typescript
describe('LoginForm', () => {
  it('validates form input', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'pass');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
```

### Testing Navigation
```typescript
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

it('navigates on button click', async () => {
  const user = userEvent.setup();
  render(<Component />);

  await user.click(screen.getByRole('button', { name: /go to home/i }));
  expect(mockNavigate).toHaveBeenCalledWith('/home');
});
```

### Testing Async Operations
```typescript
it('handles async data loading', async () => {
  render(<Component />);

  // Check loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText(/loaded data/i)).toBeInTheDocument();
  });

  // Verify loading state is gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

### Mocking Child Components
```typescript
// Mock complex child components to isolate parent testing
jest.mock('../../components/molecules/Header', () => ({
  Header: ({ onProfileClick }: any) => (
    <div data-testid="mock-header">
      <button onClick={onProfileClick}>Profile</button>
    </div>
  ),
}));

describe('HomePage', () => {
  it('renders header and handles profile click', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();

    await user.click(screen.getByText('Profile'));
    // Assert expected behavior
  });
});
```

### Testing Conditional Rendering
```typescript
it('shows content when condition is true', () => {
  render(<Component showContent={true} />);
  expect(screen.getByText(/content/i)).toBeInTheDocument();
});

it('hides content when condition is false', () => {
  render(<Component showContent={false} />);
  expect(screen.queryByText(/content/i)).not.toBeInTheDocument();
});
```

### Testing Accessibility
```typescript
describe('Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<Button aria-label="Close dialog">X</Button>);
    expect(screen.getByRole('button', { name: /close dialog/i })).toBeInTheDocument();
  });

  it('labels are associated with inputs', () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
  });

  it('buttons have correct types', () => {
    render(<Form />);
    expect(screen.getByRole('button', { name: /submit/i }))
      .toHaveAttribute('type', 'submit');
  });
});
```

## Troubleshooting

### Tests timing out
**Problem:** Tests hang or timeout

**Solutions:**
- Increase Jest timeout: `jest.setTimeout(10000)`
- Use `waitFor` for async operations
- Check for unresolved promises
- Ensure all async operations complete

```typescript
// Add to test file
jest.setTimeout(10000);

// Or for specific test
it('async test', async () => {
  // test code
}, 10000);
```

### Can't find elements
**Problem:** `Unable to find element` errors

**Solutions:**
- Verify component renders: `screen.debug()`
- Check query methods: `getBy*` vs `queryBy*` vs `findBy*`
- Use case-insensitive matching: `/text/i`
- Wait for async elements: `await screen.findByText()`

```typescript
// Debug what's rendered
screen.debug();

// Or debug specific element
screen.debug(screen.getByRole('button'));

// Use findBy for async elements
const element = await screen.findByText(/async content/i);
```

### Mock not working
**Problem:** Mocks not being applied

**Solutions:**
- Ensure mock is hoisted: `jest.mock()` before imports
- Clear mocks between tests: `jest.clearAllMocks()`
- Reset modules if needed: `jest.resetModules()`
- Check mock path is correct

```typescript
// Hoist mock before imports
jest.mock('./module');

// Clear in afterEach
afterEach(() => {
  jest.clearAllMocks();
});

// Reset modules if needed
beforeEach(() => {
  jest.resetModules();
});
```

### Act warnings
**Problem:** `Warning: An update to Component inside a test was not wrapped in act(...)`

**Solutions:**
- Use `await` with `userEvent` methods
- Use `waitFor` for state updates
- Use `findBy*` queries for async elements

```typescript
// ✅ Good
await user.click(button);
await waitFor(() => expect(screen.getByText(/updated/i)).toBeInTheDocument());

// ❌ Causes warnings
user.click(button); // Missing await
```

### Flaky tests
**Problem:** Tests pass/fail inconsistently

**Solutions:**
- Add proper `waitFor` for async operations
- Don't rely on timing (avoid `setTimeout`)
- Clear mocks and state between tests
- Use `findBy*` queries instead of `getBy*` for async content

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Contributing

When adding new components or features:

1. **Create test file** in the same `__tests__` directory as the component
2. **Follow naming convention**: `ComponentName.test.tsx`
3. **Organize tests** with describe blocks (Rendering, Interactions, Accessibility)
4. **Aim for coverage**: Target 70%+ coverage for new code
5. **Test user behavior**: Focus on what users see and do, not implementation
6. **Run tests locally**: `npm test` before committing
7. **Check coverage**: `npm run test:coverage` to verify thresholds
