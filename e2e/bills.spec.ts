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

    // Mock the current user API call
    await page.route('**/users/me', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          first_name: 'John',
          last_name: 'Doe',
          email: 'test@example.com',
          phone_number: '254700000000',
          id_type: 'national_id'
        })
      });
    });

    // Mock the vendors API call
    await page.route('**/vendors/', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Safaricom',
            paybill_number: '123456',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            name: 'Kenya Power',
            paybill_number: '888880',
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z'
          }
        ])
      });
    });

    // Mock the STK Push API call
    await page.route('**/mpesa/stk-push', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'STK Push initiated successfully',
          checkout_request_id: 'ws_CO_123456789',
          merchant_request_id: 'mr_123456789',
          response_code: '0',
          response_description: 'Success',
          customer_message: 'Success. Request accepted for processing'
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
      await expect(createBillPage.vendorSelect).toBeVisible();
      await expect(createBillPage.amountInput).toBeVisible();
      await expect(createBillPage.createButton).toBeVisible();
    });

    test('should allow user to fill bill creation form', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Fill form
      await createBillPage.fillBillName('Dinner at Restaurant');
      await createBillPage.selectVendor('550e8400-e29b-41d4-a716-446655440000');
      await createBillPage.fillAmount('150.00');
      await createBillPage.fillDescription('Team dinner celebration');

      // Verify values are filled
      await expect(createBillPage.billNameInput).toHaveValue('Dinner at Restaurant');
      await expect(createBillPage.vendorSelect).toHaveValue('550e8400-e29b-41d4-a716-446655440000');
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
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        amount: '85.50',
        description: 'Weekly groceries',
        splitMethod: 'equal'
      });

      // Should navigate back to home or show success
      await page.waitForURL(/\/(home|transactions)/, { timeout: 5000 });
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
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        amount: '45.00',
        description: 'Weekend movie',
        splitMethod: 'equal'
      });

      // Should return to home or transaction history
      await page.waitForURL(/\/(home|transactions)/, { timeout: 5000 });
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

  test.describe('STK Push Integration', () => {
    test('should initiate STK Push when creating a bill', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Track STK Push API call
      let stkPushCalled = false;
      let stkPushPayload: any = null;

      await page.route('**/mpesa/stk-push', async (route) => {
        stkPushCalled = true;
        stkPushPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'STK Push initiated successfully',
            checkout_request_id: 'ws_CO_123456789',
          })
        });
      });

      // Create bill with participant
      await createBillPage.createBill({
        name: 'Test Bill',
        vendorId: '550e8400-e29b-41d4-a716-446655440000',
        amount: '300',
        description: 'Test Description',
        splitMethod: 'equal'
      });

      // Wait for navigation
      await page.waitForURL('/home', { timeout: 5000 });

      // Verify STK Push was called
      expect(stkPushCalled).toBeTruthy();
      expect(stkPushPayload).toBeTruthy();
      expect(stkPushPayload.account_reference).toBe('Test Bill');
      expect(stkPushPayload.transaction_desc).toBe('Test Description');
      expect(stkPushPayload.vendor_id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(stkPushPayload.payments).toHaveLength(2); // Current user + 1 participant
    });

    test('should handle STK Push errors gracefully', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      // Mock STK Push failure
      await page.route('**/mpesa/stk-push', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Invalid phone number format'
          })
        });
      });

      // Create bill
      await createBillPage.fillBillName('Test Bill');
      await createBillPage.selectVendor('550e8400-e29b-41d4-a716-446655440000');
      await createBillPage.fillAmount('100');

      const phoneInput = page.getByPlaceholder(/0712345678|\\+254712345678/i);
      await phoneInput.fill('+254712345678');
      const addButton = page.locator('button').filter({ hasText: '+' });
      await addButton.click();

      await createBillPage.clickCreate();

      // Should stay on the page (not navigate on error)
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL('/create-bill');
    });

    test('should calculate equal split correctly', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      let stkPushPayload: any = null;

      await page.route('**/mpesa/stk-push', async (route) => {
        stkPushPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Success',
          })
        });
      });

      // Fill form
      await createBillPage.fillBillName('Split Test');
      await createBillPage.selectVendor('550e8400-e29b-41d4-a716-446655440000');
      await createBillPage.fillAmount('300');
      await createBillPage.selectSplitMethod('equal');

      // Add two participants
      const phoneInput = page.getByPlaceholder(/0712345678|\\+254712345678/i);
      const addButton = page.locator('button').filter({ hasText: '+' });

      await phoneInput.fill('0712345678');
      await addButton.click();

      await phoneInput.fill('0798765432');
      await addButton.click();

      await createBillPage.clickCreate();

      // Wait for API call
      await page.waitForTimeout(500);

      // Verify equal split: 300 / 3 = 100 each
      expect(stkPushPayload.payments).toHaveLength(3);
      expect(stkPushPayload.payments[0].amount).toBe(100);
      expect(stkPushPayload.payments[1].amount).toBe(100);
      expect(stkPushPayload.payments[2].amount).toBe(100);
    });

    test('should normalize phone numbers to E.164 format', async ({ page }) => {
      await loginUser(page);

      const createBillPage = new CreateBillPage(page);
      await createBillPage.navigate();

      let stkPushPayload: any = null;

      await page.route('**/mpesa/stk-push', async (route) => {
        stkPushPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Success',
          })
        });
      });

      // Fill form
      await createBillPage.fillBillName('Phone Test');
      await createBillPage.selectVendor('550e8400-e29b-41d4-a716-446655440000');
      await createBillPage.fillAmount('200');

      // Add participant with local format
      const phoneInput = page.getByPlaceholder(/0712345678|\\+254712345678/i);
      const addButton = page.locator('button').filter({ hasText: '+' });

      await phoneInput.fill('0712345678'); // Local format
      await addButton.click();

      await createBillPage.clickCreate();

      // Wait for API call
      await page.waitForTimeout(500);

      // Verify phone numbers are normalized to 254XXXXXXXXX format
      expect(stkPushPayload.payments).toBeTruthy();
      stkPushPayload.payments.forEach((payment: any) => {
        expect(payment.phone_number).toMatch(/^254\d{9}$/);
      });
    });
  });
});
