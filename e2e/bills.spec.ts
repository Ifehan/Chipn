import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CreateBillPage } from './pages/CreateBillPage';

test.describe('Bill Management', () => {
  // Helper function to login before each test
  async function loginUser(page: any) {
    // Mock the login API call
    await page.route('**/auth/login', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-jwt-token-12345',
          token_type: 'bearer',
          expires_in: 3600
        })
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'password123');
    await page.waitForURL('/home', { timeout: 5000 });
  }

  test.describe('Create Bill Page', () => {
    test('should display create bill form correctly', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Verify page loads
      await expect(page).toHaveURL('/create-bill');
      expect(await createBillPage.isLoaded()).toBeTruthy();

      // Verify form elements are visible
      await expect(createBillPage.billNameInput).toBeVisible();
      await expect(createBillPage.amountInput).toBeVisible();
      await expect(createBillPage.createButton).toBeVisible();
    });

    test('should allow user to fill bill creation form', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Fill form
      await createBillPage.fillBillName('Dinner at Restaurant');
      await createBillPage.fillAmount('150.00');
      await createBillPage.fillDescription('Team dinner celebration');

      // Verify values are filled
      await expect(createBillPage.billNameInput).toHaveValue('Dinner at Restaurant');
      await expect(createBillPage.amountInput).toHaveValue('150.00');
      await expect(createBillPage.descriptionInput).toHaveValue('Team dinner celebration');
    });

    test('should allow selecting different split methods', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Test Equal split method
      await createBillPage.selectSplitMethod('equal');
      await expect(createBillPage.splitMethodEqual).toHaveAttribute('aria-selected', 'true');

      // Test Percentage split method
      await createBillPage.selectSplitMethod('percentage');
      await expect(createBillPage.splitMethodPercentage).toHaveAttribute('aria-selected', 'true');

      // Test Custom split method
      await createBillPage.selectSplitMethod('custom');
      await expect(createBillPage.splitMethodCustom).toHaveAttribute('aria-selected', 'true');
    });

    test('should create a bill successfully', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Create bill
      await createBillPage.createBill({
        name: 'Grocery Shopping',
        amount: '85.50',
        description: 'Weekly groceries',
        splitMethod: 'equal'
      });

      // Should navigate back to home or show success
      await page.waitForURL(/\/(home|transaction-history)/, { timeout: 5000 });
    });

    test('should navigate back to home when cancel is clicked', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Click cancel
      await createBillPage.clickCancel();

      // Should navigate back to home
      await expect(page).toHaveURL('/home');
    });

    test('should navigate back when back button is clicked', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Click back button
      await createBillPage.clickBack();

      // Should navigate back to previous page
      await expect(page).toHaveURL('/home');
    });
  });

  test.describe('Bill Creation from Home Page', () => {
    test('should navigate to create bill page from home', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Click create bill button
      await homePage.clickCreateBill();

      // Verify navigation to create bill page
      await expect(page).toHaveURL('/create-bill');
    });

    test('should complete full bill creation flow', async ({ page }) => {
      await loginUser(page);

      // Start at home page
      const homePage = new HomePage(page);
      await homePage.navigate();
      expect(await homePage.isLoaded()).toBeTruthy();

      // Navigate to create bill
      await homePage.clickCreateBill();
      await expect(page).toHaveURL('/create-bill');

      // Create bill
      const createBillPage = new CreateBillPage(page);
      await createBillPage.createBill({
        name: 'Movie Tickets',
        amount: '45.00',
        description: 'Weekend movie',
        splitMethod: 'equal'
      });

      // Should return to home or transaction history
      await page.waitForURL(/\/(home|transaction-history)/, { timeout: 5000 });
    });
  });

  test.describe('Bill Form Validation', () => {
    test('should handle empty form submission', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Button should be disabled with empty form
      await expect(createBillPage.createButton).toBeDisabled();

      // Should stay on create bill page (form validation prevents submission)
      await expect(page).toHaveURL('/create-bill');
    });

    test('should handle invalid amount format', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Fill with bill name but leave amount empty (invalid)
      await createBillPage.fillBillName('Test Bill');
      // Don't fill amount - this makes the form invalid

      // Try to submit - button should be disabled
      const createButton = createBillPage.createButton;
      await expect(createButton).toBeDisabled();

      // Should stay on create bill page
      await expect(page).toHaveURL('/create-bill');
    });

    test('should require bill name', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Fill only amount, no name
      await createBillPage.fillAmount('100.00');

      // Button should be disabled without bill name
      await expect(createBillPage.createButton).toBeDisabled();

      // Should stay on create bill page
      await expect(page).toHaveURL('/create-bill');
    });
  });
});
