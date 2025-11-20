import { test, expect } from '@playwright/test';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test.describe('Authentication Flow', () => {
  test.describe('Welcome Page', () => {
    test('should display welcome page correctly', async ({ page }) => {
      const welcomePage = new WelcomePage(page);
      await welcomePage.navigate();

      // Verify page loads
      await expect(page).toHaveURL('/');
      expect(await welcomePage.isLoaded()).toBeTruthy();
    });

    test('should navigate to login page from welcome', async ({ page }) => {
      const welcomePage = new WelcomePage(page);
      await welcomePage.navigate();

      // Click login link
      await welcomePage.clickLogin();

      // Verify navigation to login page
      await expect(page).toHaveURL('/login');
    });

    test('should navigate to signup page from welcome', async ({ page }) => {
      const welcomePage = new WelcomePage(page);
      await welcomePage.navigate();

      // Click signup link
      await welcomePage.clickSignup();

      // Verify navigation to signup page
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Login Page', () => {
    test('should display login form correctly', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Verify page loads
      await expect(page).toHaveURL('/login');
      expect(await loginPage.isLoaded()).toBeTruthy();

      // Verify form elements are visible
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should allow user to fill login form', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Fill form
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('password123');

      // Verify values are filled
      await expect(loginPage.emailInput).toHaveValue('test@example.com');
      await expect(loginPage.passwordInput).toHaveValue('password123');
    });

    test('should navigate to home after successful login', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Perform login
      await loginPage.login('test@example.com', 'password123');

      // Wait for navigation
      await page.waitForURL('/home', { timeout: 5000 });

      // Verify navigation to home page
      await expect(page).toHaveURL('/home');
    });

    test('should navigate back to welcome from login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Click back button
      await loginPage.clickBack();

      // Verify navigation back to welcome page
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Complete Authentication Flow', () => {
    test('should complete full authentication journey: welcome -> login -> home', async ({ page }) => {
      // Start at welcome page
      const welcomePage = new WelcomePage(page);
      await welcomePage.navigate();
      expect(await welcomePage.isLoaded()).toBeTruthy();

      // Navigate to login
      await welcomePage.clickLogin();
      await expect(page).toHaveURL('/login');

      // Perform login
      const loginPage = new LoginPage(page);
      expect(await loginPage.isLoaded()).toBeTruthy();
      await loginPage.login('user@example.com', 'securepassword');

      // Verify home page is reached
      await page.waitForURL('/home', { timeout: 5000 });
      const homePage = new HomePage(page);
      expect(await homePage.isLoaded()).toBeTruthy();
    });

    test('should allow navigation between auth pages', async ({ page }) => {
      // Start at welcome
      const welcomePage = new WelcomePage(page);
      await welcomePage.navigate();
      await expect(page).toHaveURL('/');

      // Go to login
      await welcomePage.clickLogin();
      await expect(page).toHaveURL('/login');

      // Go back to welcome using back button
      const loginPage = new LoginPage(page);
      await loginPage.clickBack();
      await expect(page).toHaveURL('/');

      // Go to signup
      await welcomePage.clickSignup();
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Login Form Validation', () => {
    test('should handle empty form submission', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Try to submit empty form
      await loginPage.clickLogin();

      // Should stay on login page (form validation prevents submission)
      await expect(page).toHaveURL('/login');
    });

    test('should handle invalid email format', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Fill with invalid email
      await loginPage.fillEmail('invalid-email');
      await loginPage.fillPassword('password123');

      // Try to submit
      await loginPage.clickLogin();

      // Should stay on login page
      await expect(page).toHaveURL('/login');
    });
  });
});
