import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Represents the user authentication page
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly backButton: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on actual LoginPage component
    this.heading = page.getByRole('heading', { name: /tandapay/i });
    this.subtitle = page.getByText(/split bills and pay instantly via m-pesa/i);
    this.emailInput = page.getByLabel(/email address/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.loginButton = page.getByRole('button', { name: /sign in/i, exact: true });
    this.backButton = page.getByRole('button', { name: /back/i });
    this.errorMessage = page.getByText(/please fill in all fields|error/i);
  }

  /**
   * Navigate to Login page
   */
  async navigate() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill in email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Click back button
   */
  async clickBack() {
    await this.backButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if error message is visible
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Verify page is loaded
   */
  async isLoaded(): Promise<boolean> {
    // Check if either heading or email input is visible
    const headingVisible = await this.heading.isVisible().catch(() => false);
    const emailVisible = await this.emailInput.isVisible().catch(() => false);
    return headingVisible || emailVisible;
  }
}
