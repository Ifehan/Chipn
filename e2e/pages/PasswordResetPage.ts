import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Password Reset Page Object Model
 * Represents the password reset request page
 */
export class PasswordResetPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly sendResetLinkButton: Locator;
  readonly backButton: Locator;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly instructionText: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on actual PasswordResetPage component
    this.heading = page.getByRole('heading', { name: /reset password/i });
    this.subtitle = page.getByText(/we'll send you a link to reset your password/i);
    this.instructionText = page.getByText(/enter your email address and we'll send you a link/i);
    this.emailInput = page.getByLabel(/email address/i);
    this.sendResetLinkButton = page.getByRole('button', { name: /send reset link/i });
    this.backButton = page.getByRole('button', { name: /back to login/i });
    this.errorMessage = page.getByRole('alert');
    this.successMessage = page.getByText(/check your email/i);
  }

  /**
   * Navigate to Password Reset page
   */
  async navigate() {
    await this.goto('/password-reset');
    await this.waitForPageLoad();
  }

  /**
   * Fill in email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Click send reset link button
   */
  async clickSendResetLink() {
    await this.sendResetLinkButton.click();
  }

  /**
   * Perform complete password reset request flow
   */
  async requestPasswordReset(email: string) {
    await this.fillEmail(email);
    await this.clickSendResetLink();
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
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Check if success message is visible
   */
  async hasSuccess(): Promise<boolean> {
    return await this.successMessage.isVisible().catch(() => false);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  /**
   * Verify page is loaded
   */
  async isLoaded(): Promise<boolean> {
    // Check if email input is visible (more reliable)
    return await this.emailInput.isVisible().catch(() => false);
  }
}
