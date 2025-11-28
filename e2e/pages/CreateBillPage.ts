import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Create Bill Page Object Model
 * Represents the bill creation form page
 */
export class CreateBillPage extends BasePage {
  // Locators
  readonly heading: Locator;
  readonly backButton: Locator;
  readonly billNameInput: Locator;
  readonly vendorSelect: Locator;
  readonly amountInput: Locator;
  readonly descriptionInput: Locator;
  readonly splitMethodEqual: Locator;
  readonly splitMethodPercentage: Locator;
  readonly splitMethodCustom: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on actual CreateNewBillPage component
    this.heading = page.getByRole('heading', { name: /create new bill/i });
    this.backButton = page.locator('button').filter({ has: page.locator('svg') }).first(); // ArrowLeft icon button
    this.billNameInput = page.getByLabel(/bill name/i);
    this.vendorSelect = page.getByLabel(/select vendor/i);
    this.amountInput = page.getByLabel(/total amount/i);
    this.descriptionInput = page.getByLabel(/description/i);
    this.splitMethodEqual = page.getByRole('button', { name: /^equal$/i });
    this.splitMethodPercentage = page.getByRole('button', { name: /^percentage$/i });
    this.splitMethodCustom = page.getByRole('button', { name: /^custom$/i });
    this.createButton = page.getByRole('button', { name: /send payment requests/i });
    this.cancelButton = this.backButton; // No cancel button, use back button instead
  }

  /**
   * Navigate to Create Bill page
   */
  async navigate() {
    await this.goto('/create-bill');
    await this.waitForPageLoad();
  }

  /**
   * Fill bill name
   */
  async fillBillName(name: string) {
    await this.billNameInput.fill(name);
  }

  /**
   * Select vendor
   */
  async selectVendor(vendorId: string) {
    await this.vendorSelect.selectOption(vendorId);
  }

  /**
   * Fill amount
   */
  async fillAmount(amount: string) {
    await this.amountInput.fill(amount);
  }

  /**
   * Fill description
   */
  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  /**
   * Select split method
   */
  async selectSplitMethod(method: 'equal' | 'percentage' | 'custom') {
    switch (method) {
      case 'equal':
        await this.splitMethodEqual.click();
        break;
      case 'percentage':
        await this.splitMethodPercentage.click();
        break;
      case 'custom':
        await this.splitMethodCustom.click();
        break;
    }
  }

  /**
   * Click create button
   */
  async clickCreate() {
    await this.createButton.click();
  }

  /**
   * Click cancel button
   */
  async clickCancel() {
    await this.cancelButton.click();
  }

  /**
   * Click back button
   */
  async clickBack() {
    await this.backButton.click();
  }

  /**
   * Create a complete bill
   */
  async createBill(data: {
    name: string;
    vendorId: string;
    amount: string;
    description?: string;
    splitMethod?: 'equal' | 'percentage' | 'custom';
  }) {
    await this.fillBillName(data.name);
    await this.selectVendor(data.vendorId);
    await this.fillAmount(data.amount);

    if (data.description) {
      await this.fillDescription(data.description);
    }

    if (data.splitMethod) {
      await this.selectSplitMethod(data.splitMethod);
    }

    // Add a participant (required for form validation)
    const phoneInput = this.page.getByPlaceholder(/0712345678|\\+254712345678/i);
    await phoneInput.fill('+254712345678');
    const addButton = this.page.locator('button').filter({ hasText: '+' });
    await addButton.click();

    await this.clickCreate();
  }

  /**
   * Verify page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.heading.isVisible();
  }
}
