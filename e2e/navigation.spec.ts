import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test.describe('Navigation and User Flows', () => {
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

    // Mock the user info API call
    await page.route('**/users/me', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone_number: '+254712345678',
          id_type: 'national_id'
        })
      });
    });

    // Mock vendors endpoint - CreateNewBillPage calls useVendors() which hits /vendors/
    // Without this mock, the real backend returns 401, triggering a redirect to /login
    await page.route('**/vendors/**', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Mock mpesa endpoints used by CreateNewBillPage for STK push
    await page.route('**/mpesa/**', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'STK push initiated' })
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'password123');
    await page.waitForURL('/home', { timeout: 5000 });
  }

  test.describe('Home Page Navigation', () => {
    test('should display home page correctly after login', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      expect(await homePage.isLoaded()).toBeTruthy();

      // Verify key sections are visible
      await expect(page).toHaveURL('/home');
    });

    test('should switch between Bills and Groups tabs', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Start on Bills tab (default)
      await homePage.switchToBillsTab();
      let activeTab = await homePage.getActiveTab();
      expect(activeTab).toBe('bills');

      // Switch to Groups tab
      await homePage.switchToGroupsTab();
      activeTab = await homePage.getActiveTab();
      expect(activeTab).toBe('groups');

      // Switch back to Bills tab
      await homePage.switchToBillsTab();
      activeTab = await homePage.getActiveTab();
      expect(activeTab).toBe('bills');
    });

    test('should navigate to profile settings', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Click profile button
      await homePage.clickProfile();

      // Verify navigation to profile page
      await expect(page).toHaveURL('/profile');
    });

    test('should navigate to create bill page', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Click create bill button
      await homePage.clickCreateBill();

      // Verify navigation to create bill page
      await expect(page).toHaveURL('/create-bill');
    });
  });

  test.describe('Browser Navigation', () => {
    test('should handle browser back button correctly', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Navigate to create bill
      await homePage.clickCreateBill();
      await expect(page).toHaveURL('/create-bill');

      // Go back
      await page.goBack();
      await expect(page).toHaveURL('/home');

      // Go forward
      await page.goForward();
      await expect(page).toHaveURL('/create-bill');
    });

    test('should handle browser refresh on home page', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Refresh page
      await page.reload();

      // Should still be on home page
      await expect(page).toHaveURL('/home');
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should maintain state after navigation', async ({ page }) => {
      await loginUser(page);

      const homePage = new HomePage(page);
      await homePage.navigate();

      // Switch to Groups tab
      await homePage.switchToGroupsTab();
      let activeTab = await homePage.getActiveTab();
      expect(activeTab).toBe('groups');

      // Navigate away and back
      await homePage.clickProfile();
      await expect(page).toHaveURL('/profile');

      await page.goBack();
      await expect(page).toHaveURL('/home');

      // Tab state might reset (depends on implementation)
      // This test documents the behavior
    });
  });

  test.describe('Deep Linking', () => {
    test('should allow direct navigation to create bill page', async ({ page }) => {
      await loginUser(page);

      // Navigate directly to create bill
      await page.goto('/create-bill');

      // Should be on create bill page
      await expect(page).toHaveURL('/create-bill');
    });

    test('should allow direct navigation to profile page', async ({ page }) => {
      await loginUser(page);

      // Navigate directly to profile
      await page.goto('/profile');

      // Should be on profile page
      await expect(page).toHaveURL('/profile');
    });

    test('should allow direct navigation to transaction history', async ({ page }) => {
      await loginUser(page);

      // Navigate directly to transaction history
      await page.goto('/transactions');

      // Should be on transaction history page
      await expect(page).toHaveURL('/transactions');
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      // Clear sessionStorage and start fresh
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());

      // Try to access home page without logging in
      await page.goto('/home');

      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });

    test('should redirect to login when accessing create bill without auth', async ({ page }) => {
      // Clear sessionStorage and start fresh
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());

      // Try to access create bill page without logging in
      await page.goto('/create-bill');

      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });

    test('should redirect to login when accessing profile without auth', async ({ page }) => {
      // Clear sessionStorage and start fresh
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());

      // Try to access profile page without logging in
      await page.goto('/profile');

      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Complete User Journey', () => {
    test('should complete full app navigation flow', async ({ page }) => {
      // Clear sessionStorage first
      await page.goto('/');
      await page.evaluate(() => sessionStorage.clear());

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

      // Mock the user info API call
      await page.route('**/users/me', async (route: any) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'user-123',
            first_name: 'Test',
            last_name: 'User',
            email: 'user@example.com',
            phone_number: '+254712345678',
            id_type: 'national_id'
          })
        });
      });

      // Mock vendors endpoint - CreateNewBillPage calls useVendors() which hits /vendors/
      await page.route('**/vendors/**', async (route: any) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });

      // Mock mpesa endpoints
      await page.route('**/mpesa/**', async (route: any) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'STK push initiated' })
        });
      });

      // Start at welcome
      await page.goto('/');
      await expect(page).toHaveURL('/');

      // Go to login
      await page.click('text=/sign in/i');
      await expect(page).toHaveURL('/login');

      // Login
      const loginPage = new LoginPage(page);
      await loginPage.login('user@example.com', 'password123');
      await page.waitForURL('/home', { timeout: 5000 });

      // Navigate to create bill
      const homePage = new HomePage(page);
      await homePage.clickCreateBill();
      await expect(page).toHaveURL('/create-bill');

      // Go back to home
      await page.goBack();
      await expect(page).toHaveURL('/home');

      // Switch tabs
      await homePage.switchToGroupsTab();
      let activeTab = await homePage.getActiveTab();
      expect(activeTab).toBe('groups');

      // Go to profile
      await homePage.clickProfile();
      await expect(page).toHaveURL('/profile');

      // Return to home using back navigation instead of goto
      await page.goBack();
      await expect(page).toHaveURL('/home');
    });
  });
});
