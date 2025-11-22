# Tunga Pay Documentation

Welcome to the Tunga Pay documentation! This directory contains comprehensive guides for developing, testing, and maintaining the application.

## 📚 Documentation Index

### Getting Started
- **[Main README](../README.md)** - Project overview, features, and quick start guide

### Development Guides
- **[Architecture Guide](architecture.md)** - Component architecture and design patterns
- **[Contributing Guide](contributing.md)** - How to contribute to the project

### Testing Documentation
- **[Unit & Integration Testing](unit-testing.md)** - Jest and React Testing Library guide
- **[E2E Testing](e2e-testing.md)** - Playwright end-to-end testing guide

### Configuration
- **[Environment Setup](environment.md)** - Development environment configuration
- **[Deployment Guide](deployment.md)** - Production deployment instructions

---

## 🧪 Testing Overview

Tunga Pay uses a comprehensive testing strategy with multiple layers:

### Unit & Integration Tests (Jest + RTL)
- **Location**: `src/components/**/__tests__/`, `src/services/**/__tests__/`, `src/pages/**/__tests__/`
- **Coverage**: 38 test files covering services, components (atoms, molecules, organisms), and pages
- **Test Suites**: 38 (all passing)
- **Total Tests**: 477 (all passing)
- **Coverage**: High coverage across all layers with comprehensive mocking strategy
- **Documentation**: [`unit-testing.md`](unit-testing.md)
- **Run**: `npm test`

### E2E Tests (Playwright)
- **Location**: `e2e/`
- **Coverage**: 32 tests across authentication, bills, and navigation
- **Documentation**: [`e2e-testing.md`](e2e-testing.md)
- **Run**: `npm run test:e2e`

---

## 🏗️ Architecture Overview

### Component Structure
```
src/components/
├── ProtectedRoute.tsx  # Route authentication wrapper
├── atoms/              # Basic UI elements (Button, Input, Card, etc.)
├── molecules/          # Composed components (Forms, Headers, etc.)
└── organisms/          # Complex sections (Settings, Bills, etc.)
```

### Page Structure
```
src/pages/
├── WelcomePage.tsx
├── LoginPage.tsx
├── SignupPage.tsx
├── HomePage.tsx
├── CreateNewBillPage.tsx
├── ProfileSettingsPage.tsx
└── TransactionHistoryPage.tsx
```

### Test Structure
```
e2e/
├── pages/       # Page Object Models
└── *.spec.ts    # Test specifications
```

---

## 🚀 Quick Links

### Development
- [Getting Started](../README.md#-getting-started)
- [Available Scripts](../README.md#-available-scripts)
- [Tech Stack](../README.md#️-tech-stack)

### Testing
- [Running Unit Tests](unit-testing.md#running-tests)
- [Running E2E Tests](e2e-testing.md#running-tests)
- [Writing Tests](unit-testing.md#writing-tests)
- [Debugging Tests](e2e-testing.md#debugging)

### Configuration
- [Vite Config](../vite.config.ts)
- [TypeScript Config](../tsconfig.json)
- [Jest Config](../jest.config.ts)
- [Playwright Config](../playwright.config.ts)
- [Tailwind Config](../tailwind.config.cjs)

---

## 📖 Documentation Standards

When adding new documentation:

1. **Place files in `docs/` directory**
2. **Update this index** with links to new documents
3. **Use clear, descriptive titles**
4. **Include code examples** where applicable
5. **Keep documentation up-to-date** with code changes
6. **Use markdown formatting** for consistency

---

## 🤝 Contributing to Documentation

Found an error or want to improve the docs?

1. Edit the relevant markdown file
2. Ensure links are working
3. Update this index if adding new files
4. Submit a pull request

---

## 📝 Document Templates

### New Feature Documentation
```markdown
# Feature Name

## Overview
Brief description of the feature

## Usage
How to use the feature with examples

## API Reference
Detailed API documentation

## Examples
Code examples and use cases

## Troubleshooting
Common issues and solutions
```

### New Test Documentation
```markdown
# Test Suite Name

## Overview
What this test suite covers

## Running Tests
Commands to run the tests

## Test Structure
Organization of test files

## Writing Tests
Guidelines and examples

## Best Practices
Recommended patterns
```

---

## 📞 Need Help?

- Check the relevant documentation file
- Review code examples in the guides
- Look at existing implementations
- Ask the team for clarification

---


### 2025-11-22: Test Infrastructure Improvements
- ✅ Fixed all failing unit tests (38/38 suites passing, 477/477 tests passing)
- ✅ Resolved `import.meta` parsing errors in Jest environment
- ✅ Created `src/services/__mocks__/api-client.ts` for Jest-compatible API client mock
- ✅ Updated test files to properly mock modules before imports
- ✅ Fixed async state handling in ProfileSettingsPage tests
- ✅ Documented mocking strategy and best practices in unit-testing.md

**Technical Details:**
- Added manual mock in `__mocks__` directory following Jest conventions
- Mock placement: `jest.mock()` must be called before imports
- Resolved Vite-specific `import.meta.env` compatibility with Jest
- Proper async/await patterns for state updates in tests

**Files Modified:**
- `src/services/__mocks__/api-client.ts` (new)
- `src/pages/__tests__/LoginPage.test.tsx`
- `src/pages/__tests__/PasswordResetPage.test.tsx`
- `src/pages/__tests__/ProfileSettingsPage.test.tsx`
- `docs/unit-testing.md` (added Mocking Strategy section)

## 📋 Recent Changes

### 2025-11-22: Authentication System Implementation
- ✅ Implemented login functionality with POST /auth/login endpoint
- ✅ Implemented password reset with POST /auth/password-reset/request endpoint
- ✅ Added authentication service with token management
- ✅ Updated LoginForm with loading spinners and error handling
- ✅ Created PasswordResetForm component with email validation
- ✅ Added PasswordResetPage with success/error states
- ✅ Updated routing to include /password-reset route
- ✅ Added comprehensive test coverage (64 new tests)
- ✅ Configured environment variables properly (no hardcoded values)

**New Components:**
- `src/services/auth.service.ts` - Authentication service
- `src/services/types/auth.types.ts` - Auth type definitions
- `src/components/molecules/PasswordResetForm.tsx` - Password reset form
- `src/pages/PasswordResetPage.tsx` - Password reset page

**Test Statistics:**
- 5 new test suites (all passing)
- 64 new tests (all passing)
- 100% coverage on auth service, LoginForm, PasswordResetForm, LoginPage, and PasswordResetPage

### 2025-11-20: Test Suite Improvements
- ✅ Fixed 13 failing Jest tests across 3 test suites
- ✅ Added comprehensive ProtectedRoute test coverage (6 new tests)
- ✅ Updated SplitMethodSelector tests for 3-button layout
- ✅ Updated HomePage tests for router-based navigation
- ✅ Updated CreateNewBillPage tests with billName validation
- ✅ Achieved 95.66% overall test coverage

**Test Statistics:**
- 34 test suites (all passing)
- 428 tests (all passing)
- 100% coverage on ProtectedRoute component

---

**Last Updated**: 2025-11-22
