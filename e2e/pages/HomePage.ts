import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object Model
 * Represents the main dashboard page
 */
export class HomePage extends BasePage {
  // Locators
  readonly profileButton: Locator;
  readonly createBillButton: Locator;
  readonly billsTab: Locator;
  readonly groupsTab: Locator;
  readonly statsContainer: Locator;
  readonly recentBillsSection: Locator;
  readonly quickActionsSection: Locator;
  readonly userName: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators based on actual HomePage component
    // Look for elements that actually exist in the HomePage
    this.userName = page.getByText(/welcome back/i);
    this.profileButton = page.getByRole('button', { name: /open profile settings/i });
    this.createBillButton = page.getByRole('button', { name: /create bill|new bill|split bill/i });
    this.billsTab = page.getByRole('button', { name: /bills/i }).first();
    this.groupsTab = page.getByRole('button', { name: /groups/i }).first();
    this.statsContainer = page.getByText(/total spent|total owed|active bills/i).first();
    this.recentBillsSection = page.getByText(/recent bills|your bills/i).first();
    this.quickActionsSection = page.getByText(/quick actions|split bill|request money/i).first();
  }

  /**
   * Navigate to Home page
   */
  async navigate() {
    await this.goto('/home');
    await this.waitForPageLoad();
  }

  /**
   * Click profile button
   */
  async clickProfile() {
    await this.profileButton.click();
  }

  /**
   * Click create bill button
   */
  async clickCreateBill() {
    await this.createBillButton.click();
  }

  /**
   * Switch to Bills tab
   */
  async switchToBillsTab() {
    await this.billsTab.click();
  }

  /**
   * Switch to Groups tab
   */
  async switchToGroupsTab() {
    await this.groupsTab.click();
  }

  /**
   * Check if stats are visible
   */
  async hasStats(): Promise<boolean> {
    return await this.statsContainer.isVisible();
  }

  /**
   * Check if recent bills section is visible
   */
  async hasRecentBills(): Promise<boolean> {
    return await this.recentBillsSection.isVisible();
  }

  /**
   * Check if empty bills state is visible
   */
  async hasEmptyBillsState(): Promise<boolean> {
    const emptyState = this.page.getByText(/no bills yet|get started/i);
    return await emptyState.isVisible().catch(() => false);
  }

  /**
   * Check if quick actions are visible
   */
  async hasQuickActions(): Promise<boolean> {
    return await this.quickActionsSection.isVisible();
  }

  /**
   * Get active tab name
   */
  async getActiveTab(): Promise<string> {
    const billsActive = await this.billsTab.getAttribute('aria-selected');
    const groupsActive = await this.groupsTab.getAttribute('aria-selected');

    if (billsActive === 'true') return 'bills';
    if (groupsActive === 'true') return 'groups';
    return 'unknown';
  }

  /**
   * Verify page is loaded
   */
  async isLoaded(): Promise<boolean> {
    // Check if tabs are visible (they're always present on home page)
    const billsTabVisible = await this.billsTab.isVisible().catch(() => false);
    const groupsTabVisible = await this.groupsTab.isVisible().catch(() => false);
    return billsTabVisible || groupsTabVisible;
  }
}
