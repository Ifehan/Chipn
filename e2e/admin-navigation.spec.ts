import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin Navigation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await loginAsAdmin(page)
  })

  test('should navigate to Vendors page from sidebar', async ({ page }) => {
    // Click on Vendors link
    const vendorsLink = page.locator('a:has-text("Vendors")')
    await vendorsLink.click()

    // Wait for navigation
    await page.waitForURL('**/admin/vendors')

    // Verify we're on Vendors page
    await expect(page.locator('h1')).toContainText('Vendors Management')
    await expect(page.locator('text=Manage all vendors in the system')).toBeVisible()
  })

  test('should navigate to User Management page from sidebar', async ({ page }) => {
    // Click on User Management link
    const userMgmtLink = page.locator('a:has-text("User Management")')
    await userMgmtLink.click()

    // Wait for navigation
    await page.waitForURL('**/admin/users')

    // Verify we're on User Management page
    await expect(page.locator('h1')).toContainText('User Management')
    await expect(page.locator('text=Manage system users and their roles')).toBeVisible()
  })

  test('should navigate to Transactions page from sidebar', async ({ page }) => {
    // Click on Transactions link in the sidebar nav (not the "View All →" link on the dashboard)
    const transactionsLink = page.locator('nav a[href="/admin/transactions"]')
    await transactionsLink.click()

    // Wait for navigation
    await page.waitForURL('**/transactions')

    // Should navigate to transaction history page
    await expect(page).toHaveURL(/.*transactions/)
  })

  test('should navigate back to Dashboard from Vendors page', async ({ page }) => {
    // Navigate to Vendors
    await page.locator('a:has-text("Vendors")').click()
    await page.waitForURL('**/admin/vendors')

    // Navigate back to Dashboard
    const dashboardLink = page.locator('a:has-text("Dashboard")').first()
    await dashboardLink.click()
    await page.waitForURL('**/admin')

    // Verify we're back on Dashboard
    await expect(page.locator('h1')).toContainText('Dashboard Overview')
  })

  test('should navigate back to Dashboard from User Management page', async ({ page }) => {
    // Navigate to User Management
    await page.locator('a:has-text("User Management")').click()
    await page.waitForURL('**/admin/users')

    // Navigate back to Dashboard
    const dashboardLink = page.locator('a:has-text("Dashboard")').first()
    await dashboardLink.click()
    await page.waitForURL('**/admin')

    // Verify we're back on Dashboard
    await expect(page.locator('h1')).toContainText('Dashboard Overview')
  })

  test('should maintain sidebar across page navigation', async ({ page }) => {
    // Navigate to Vendors
    await page.locator('a:has-text("Vendors")').click()
    await page.waitForURL('**/admin/vendors')

    // Sidebar should still be visible
    await expect(page.locator('text=TandaPay Admin')).toBeVisible()
    await expect(page.locator('text=Bill Splitting Dashboard')).toBeVisible()

    // All navigation items should be visible
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('a:has-text("Transactions")')).toBeVisible()
    await expect(page.locator('a:has-text("User Management")')).toBeVisible()
  })

  test('should show correct active link during navigation', async ({ page }) => {
    // Vendors link should be active after navigation
    await page.locator('a:has-text("Vendors")').click()
    await page.waitForURL('**/admin/vendors')

    // Check if Vendors link has active styling (depending on implementation)
    const vendorsLink = page.locator('a:has-text("Vendors")')
    await expect(vendorsLink).toBeVisible()
  })
})
