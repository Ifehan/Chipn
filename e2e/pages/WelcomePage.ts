import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Welcome Page Object Model
 * Represents the landing/onboarding page
 */
export class WelcomePage extends BasePage {
  // Locators
  readonly createAccountButton: Locator;
  readonly signInButton: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on actual WelcomePage component
    this.heading = page.getByRole('heading', { name: /chipn/i });
    this.subtitle = page.getByText(/split bills and pay instantly via m-pesa/i);
    this.createAccountButton = page.getByRole('button', { name: /create new account/i });
    this.signInButton = page.getByRole('button', { name: /sign in to existing account/i });
  }

  /**
   * Navigate to Welcome page
   */
  async navigate() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Click Create Account button (navigates to signup)
   */
  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  /**
   * Click Sign In button (navigates to login)
   */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /**
   * Alias for clickSignIn (for backward compatibility)
   */
  async clickLogin() {
    await this.clickSignIn();
  }

  /**
   * Alias for clickCreateAccount (for backward compatibility)
   */
  async clickSignup() {
    await this.clickCreateAccount();
  }

  /**
   * Verify page is loaded
   */
  async isLoaded(): Promise<boolean> {
    // Check if create account button is visible (more reliable than heading)
    return await this.createAccountButton.isVisible().catch(() => false);
  }
}
