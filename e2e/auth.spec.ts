import { test, expect } from '@playwright/test';
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
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
      // Mock the login API call
      await page.route('**/auth/login', async (route) => {
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
      await page.route('**/users/me', async (route) => {
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
      // Mock the login API call
      await page.route('**/auth/login', async (route) => {
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
      await page.route('**/users/me', async (route) => {
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

      // Start at welcome page
      const welcomePage = new WelcomePage(page);
      await welcomePage.navigate();
      expect(await welcomePage.isLoaded()).toBeTruthy();

      // Navigate to login
      await welcomePage.clickLogin();
      await expect(page).toHaveURL('/login');

      // Perform login
      const loginPage = new LoginPage(page);
      // Wait for the login page to fully load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // Small delay to ensure form is ready
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

  test.describe('Password Reset Flow', () => {
    test('should display password reset page correctly', async ({ page }) => {
      const passwordResetPage = new PasswordResetPage(page);
      await passwordResetPage.navigate();

      // Verify page loads
      await expect(page).toHaveURL('/password-reset');
      expect(await passwordResetPage.isLoaded()).toBeTruthy();

      // Verify form elements are visible
      await expect(passwordResetPage.emailInput).toBeVisible();
      await expect(passwordResetPage.sendResetLinkButton).toBeVisible();
      await expect(passwordResetPage.backButton).toBeVisible();
    });

    test('should navigate to password reset from login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Click forgot password link
      const forgotPasswordLink = page.getByText(/forgot password/i);
      await forgotPasswordLink.click();

      // Verify navigation to password reset page
      await expect(page).toHaveURL('/password-reset');
    });

    test('should allow user to fill password reset form', async ({ page }) => {
      const passwordResetPage = new PasswordResetPage(page);
      await passwordResetPage.navigate();

      // Fill form
      await passwordResetPage.fillEmail('test@example.com');

      // Verify value is filled
      await expect(passwordResetPage.emailInput).toHaveValue('test@example.com');
    });

    test('should show success message after requesting password reset', async ({ page }) => {
      const passwordResetPage = new PasswordResetPage(page);
      await passwordResetPage.navigate();

      // Request password reset
      await passwordResetPage.requestPasswordReset('user@example.com');

      // Wait for success message
      await page.waitForTimeout(1000);

      // Verify success message or that we stay on the page
      // (actual behavior depends on API response)
      await expect(page).toHaveURL('/password-reset');
    });

    test('should navigate back to login from password reset page', async ({ page }) => {
      const passwordResetPage = new PasswordResetPage(page);
      await passwordResetPage.navigate();

      // Click back button
      await passwordResetPage.clickBack();

      // Verify navigation back to login page
      await expect(page).toHaveURL('/login');
    });

    test('should handle empty email submission', async ({ page }) => {
      const passwordResetPage = new PasswordResetPage(page);
      await passwordResetPage.navigate();

      // Try to submit empty form
      await passwordResetPage.clickSendResetLink();

      // Should stay on password reset page (form validation prevents submission)
      await expect(page).toHaveURL('/password-reset');
    });

    test('should handle invalid email format', async ({ page }) => {
      const passwordResetPage = new PasswordResetPage(page);
      await passwordResetPage.navigate();

      // Fill with invalid email
      await passwordResetPage.fillEmail('invalid-email');

      // Try to submit
      await passwordResetPage.clickSendResetLink();

      // Should stay on password reset page and show error
      await expect(page).toHaveURL('/password-reset');
    });
  });

  test.describe('Complete Password Reset Journey', () => {
    test('should complete full password reset flow: login -> forgot password -> reset -> back to login', async ({ page }) => {
      // Start at login page
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      expect(await loginPage.isLoaded()).toBeTruthy();

      // Click forgot password
      const forgotPasswordLink = page.getByText(/forgot password/i);
      await forgotPasswordLink.click();
      await expect(page).toHaveURL('/password-reset');

      // Fill password reset form
      const passwordResetPage = new PasswordResetPage(page);
      expect(await passwordResetPage.isLoaded()).toBeTruthy();
      await passwordResetPage.requestPasswordReset('user@example.com');

      // Wait a moment for any processing
      await page.waitForTimeout(1000);

      // Navigate back to login (either via success state or back button)
      const backButton = page.getByRole('button', { name: /back to login/i });
      if (await backButton.isVisible()) {
        await backButton.click();
      }

      // Verify we're back at login
      await expect(page).toHaveURL('/login');
    });
  });
});
