# E2E Testing Documentation

## Overview

This project uses **Playwright** for End-to-End (E2E) testing to validate complete user workflows and ensure the application works correctly from a user's perspective. E2E tests complement the existing Jest unit/integration tests by testing the full application stack.

## Testing Stack

- **Playwright**: v1.56.1 - Modern E2E testing framework
- **TypeScript**: Full type safety in tests
- **Page Object Model**: Maintainable test architecture
- **Multi-Browser**: Chromium, Firefox, WebKit support
- **Mobile Testing**: iOS and Android viewport testing

## Project Structure

```
tunga-pay/
├── e2e/                           # E2E tests directory
│   ├── pages/                     # Page Object Models
│   │   ├── BasePage.ts           # Base page with common methods
│   │   ├── WelcomePage.ts        # Welcome/landing page
│   │   ├── LoginPage.ts          # Login page
│   │   ├── PasswordResetPage.ts  # Password reset page
│   │   ├── HomePage.ts           # Main dashboard
│   │   └── CreateBillPage.ts     # Bill creation page
│   ├── auth.spec.ts              # Authentication flow tests
│   ├── bills.spec.ts             # Bill management tests
│   └── navigation.spec.ts        # Navigation and routing tests
├── playwright.config.ts          # Playwright configuration
└── package.json                  # Test scripts
```

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### Run Tests in Specific Browser
```bash
npm run test:e2e:chromium   # Chrome/Edge
npm run test:e2e:firefox    # Firefox
npm run test:e2e:webkit     # Safari
```

### View Test Report
```bash
npm run test:e2e:report
```

## Test Suites

### 1. Authentication Tests ([`e2e/auth.spec.ts`](e2e/auth.spec.ts))

Tests user authentication flows, password reset, and form validation.

**Test Coverage:**
- Welcome page display and navigation
- Login form rendering and interaction
- Form validation (empty fields, invalid email)
- Successful login flow
- Password reset page display and navigation
- Password reset form interaction and validation
- Forgot password link from login page
- Complete password reset journey (Login → Forgot Password → Reset → Back to Login)
- Navigation between auth pages
- Complete authentication journey (Welcome → Login → Home)

**Examples:**
```typescript
// Authentication journey
test('should complete full authentication journey', async ({ page }) => {
  const welcomePage = new WelcomePage(page);
  await welcomePage.navigate();
  await welcomePage.clickLogin();

  const loginPage = new LoginPage(page);
  await loginPage.login('user@example.com', 'password');

  await expect(page).toHaveURL('/home');
});

// Password reset journey
test('should complete password reset flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();

  const forgotPasswordLink = page.getByText(/forgot password/i);
  await forgotPasswordLink.click();

  const passwordResetPage = new PasswordResetPage(page);
  await passwordResetPage.requestPasswordReset('user@example.com');

  await expect(page).toHaveURL('/password-reset');
});
```

### 2. Bill Management Tests ([`e2e/bills.spec.ts`](e2e/bills.spec.ts))

Tests bill creation, form validation, and bill-related workflows.

**Test Coverage:**
- Create bill form display
- Form field interactions
- Split method selection (Equal, Percentage, Custom)
- Bill creation flow
- Form validation (empty fields, invalid amounts)
- Navigation from home to create bill
- Cancel and back button functionality

**Example:**
```typescript
test('should create a bill successfully', async ({ page }) => {
  await loginUser(page);

  const createBillPage = new CreateBillPage(page);
  await createBillPage.navigate();
  await createBillPage.createBill({
    name: 'Dinner',
    amount: '150.00',
    splitMethod: 'equal'
  });

  await expect(page).toHaveURL(/\/(home|transaction-history)/);
});
```

### 3. Navigation Tests ([`e2e/navigation.spec.ts`](e2e/navigation.spec.ts))

Tests application routing, tab switching, and protected routes.

**Test Coverage:**
- Home page display after login
- Tab switching (Bills ↔ Groups)
- Navigation to profile and create bill
- Browser back/forward buttons
- Page refresh handling
- Deep linking to specific pages
- Protected route redirects
- Complete user journey through app

**Example:**
```typescript
test('should switch between Bills and Groups tabs', async ({ page }) => {
  await loginUser(page);

  const homePage = new HomePage(page);
  await homePage.switchToGroupsTab();
  expect(await homePage.getActiveTab()).toBe('groups');

  await homePage.switchToBillsTab();
  expect(await homePage.getActiveTab()).toBe('bills');
});
```

## Page Object Model (POM)

### What is POM?

Page Object Model is a design pattern that creates an object repository for web elements. Each page in the application has a corresponding Page Object class that encapsulates the page's elements and actions.

### Benefits

- **Maintainability**: Changes to UI only require updates in one place
- **Reusability**: Page objects can be reused across multiple tests
- **Readability**: Tests are more readable and self-documenting
- **Type Safety**: Full TypeScript support with autocomplete

### Base Page ([`e2e/pages/BasePage.ts`](e2e/pages/BasePage.ts))

All page objects extend `BasePage`, which provides common functionality:

```typescript
class BasePage {
  async goto(path: string)           // Navigate to path
  async waitForPageLoad()             // Wait for page to load
  async getTitle()                    // Get page title
  async takeScreenshot(name: string)  // Take screenshot
  async waitForElement(selector)      // Wait for element
  async isVisible(selector)           // Check visibility
  getCurrentUrl()                     // Get current URL
}
```

### Example Page Object

```typescript
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.loginButton = page.getByRole('button', { name: /log in/i });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

## Configuration

### Playwright Config ([`playwright.config.ts`](playwright.config.ts))

Key configuration settings:

```typescript
{
  testDir: './e2e',              // Test directory
  fullyParallel: true,           // Run tests in parallel
  retries: process.env.CI ? 2 : 0,  // Retry failed tests on CI
  baseURL: 'http://localhost:5173',  // Base URL for tests

  use: {
    trace: 'on-first-retry',     // Trace on retry
    screenshot: 'only-on-failure', // Screenshot on failure
    video: 'retain-on-failure',  // Video on failure
  },

  projects: [
    { name: 'chromium' },        // Chrome/Edge
    { name: 'firefox' },         // Firefox
    { name: 'webkit' },          // Safari
    { name: 'Mobile Chrome' },   // Mobile Chrome
    { name: 'Mobile Safari' },   // Mobile Safari
  ],

  webServer: {
    command: 'npm run dev',      // Start dev server
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  }
}
```

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Feature Name', () => {
  test.describe('Sub-feature', () => {
    test('should do something', async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Act
      await loginPage.login('user@example.com', 'password');

      // Assert
      await expect(page).toHaveURL('/home');
    });
  });
});
```

### Best Practices

#### 1. Use Page Object Model
```typescript
// ✅ Good - Uses Page Object
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password');

// ❌ Avoid - Direct element interaction
await page.fill('#email', 'user@example.com');
await page.fill('#password', 'password');
await page.click('button[type="submit"]');
```

#### 2. Use Semantic Locators
```typescript
// ✅ Good - Semantic locators
page.getByRole('button', { name: /submit/i })
page.getByLabel(/email/i)
page.getByText(/welcome/i)

// ❌ Avoid - CSS/XPath selectors
page.locator('#submit-btn')
page.locator('//button[@type="submit"]')
```

#### 3. Wait for Navigation
```typescript
// ✅ Good - Wait for URL change
await loginPage.clickLogin();
await page.waitForURL('/home', { timeout: 5000 });

// ❌ Avoid - No wait
await loginPage.clickLogin();
await expect(page).toHaveURL('/home'); // May fail
```

#### 4. Use Helper Functions
```typescript
// ✅ Good - Reusable helper
async function loginUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('test@example.com', 'password123');
  await page.waitForURL('/home');
}

test('should create bill', async ({ page }) => {
  await loginUser(page);
  // Test continues...
});
```

#### 5. Test User Behavior
```typescript
// ✅ Good - Tests user flow
test('should complete checkout', async ({ page }) => {
  await homePage.clickCreateBill();
  await createBillPage.fillForm({ name: 'Dinner', amount: '50' });
  await createBillPage.clickCreate();
  await expect(page).toHaveURL('/home');
});

// ❌ Avoid - Tests implementation
test('should call API', async ({ page }) => {
  await page.route('**/api/bills', route => {
    expect(route.request().postData()).toContain('Dinner');
  });
});
```

## Debugging

### Debug Mode
```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### UI Mode
```bash
npm run test:e2e:ui
```

Interactive mode with time-travel debugging and watch mode.

### Screenshots and Videos

Failed tests automatically capture:
- **Screenshots**: `test-results/*/test-failed-1.png`
- **Videos**: `test-results/*/video.webm`
- **Traces**: `test-results/*/trace.zip`

View traces:
```bash
npx playwright show-trace test-results/*/trace.zip
```

### Console Logs

Add console logging in tests:
```typescript
test('debug test', async ({ page }) => {
  page.on('console', msg => console.log('Browser:', msg.text()));
  await page.goto('/');
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Data Management

### Mock Data

Currently, the app uses mock data. Tests work with this mock data:

```typescript
// Login with any credentials (mock auth)
await loginPage.login('test@example.com', 'password123');

// Create bills (stored in memory)
await createBillPage.createBill({
  name: 'Test Bill',
  amount: '100.00'
});
```

### Future: API Mocking

When backend is integrated, use MSW or Playwright's route mocking:

```typescript
await page.route('**/api/login', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ token: 'mock-token' })
  });
});
```

## Troubleshooting

### Tests Timing Out

**Problem**: Tests hang or timeout

**Solutions**:
- Increase timeout: `test.setTimeout(60000)`
- Check if dev server is running
- Verify baseURL in config
- Use `page.waitForURL()` for navigation

### Element Not Found

**Problem**: `Locator.click: Target closed` or element not found

**Solutions**:
- Use `await page.waitForSelector()`
- Check if element is in viewport
- Verify locator is correct
- Use `page.locator().isVisible()`

### Flaky Tests

**Problem**: Tests pass/fail inconsistently

**Solutions**:
- Add proper waits (`waitForURL`, `waitForSelector`)
- Use `expect().toBeVisible()` instead of checking immediately
- Avoid hard-coded delays (`page.waitForTimeout()`)
- Use auto-waiting features of Playwright

### Browser Not Installed

**Problem**: `Executable doesn't exist`

**Solution**:
```bash
npx playwright install chromium
# or install all browsers
npx playwright install
```

## Comparison: Unit vs E2E Tests

| Aspect | Unit/Integration (Jest) | E2E (Playwright) |
|--------|------------------------|------------------|
| **Scope** | Component behavior | Full user workflows |
| **Speed** | Fast (milliseconds) | Slower (seconds) |
| **Isolation** | Mocked dependencies | Real browser environment |
| **Coverage** | Component logic | User journeys |
| **Debugging** | Easy | More complex |
| **Maintenance** | Lower | Higher |
| **When to Use** | Component testing | Critical user paths |

## Best Practices Summary

1. ✅ **Use Page Object Model** for maintainability
2. ✅ **Test user behavior**, not implementation
3. ✅ **Use semantic locators** (role, label, text)
4. ✅ **Wait for navigation** and state changes
5. ✅ **Keep tests independent** - no shared state
6. ✅ **Test critical paths** - focus on important flows
7. ✅ **Use descriptive test names** - explain what is tested
8. ✅ **Run tests in CI/CD** - catch issues early
9. ✅ **Review test reports** - analyze failures
10. ✅ **Keep tests fast** - parallel execution, focused tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Contributing

When adding new E2E tests:

1. **Create Page Object** if testing a new page
2. **Follow naming conventions**: `feature.spec.ts`
3. **Use describe blocks** to organize tests
4. **Add helper functions** for common operations
5. **Test happy paths** and error cases
6. **Run tests locally** before committing
7. **Update documentation** if adding new patterns

## Future Enhancements

- [ ] Visual regression testing with Percy
- [ ] API mocking with MSW when backend is integrated
- [ ] Performance testing with Lighthouse
- [ ] Accessibility testing with axe-core
- [ ] Cross-browser testing in CI
- [ ] Test data factories for complex scenarios
- [ ] Custom fixtures for common setups
- [ ] Parallel test execution optimization
