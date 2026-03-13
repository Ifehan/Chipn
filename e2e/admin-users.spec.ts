import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin User Management Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await loginAsAdmin(page)
    // Navigate to user management page
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
  })

  test('should display user management page heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('User Management')
    await expect(page.locator('p.text-slate-500')).toContainText('Manage system users and their roles')
  })

  test('should display user statistics cards', async ({ page }) => {
    // Check for stat cards
    await expect(page.locator('text=Total Users')).toBeVisible()
    await expect(page.locator('text=Active Users')).toBeVisible()
    await expect(page.locator('text=Suspended/Inactive')).toBeVisible()
  })

  test('should display user list table', async ({ page }) => {
    // Check for table heading
    await expect(page.locator('h2:has-text("User List")')).toBeVisible()

    // Check for table headers - using more specific selectors
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Join Date', 'Last Login']
    for (const header of headers) {
      // Use more specific selectors to avoid strict mode violations
      await expect(page.locator(`th:has-text("${header}")`)).toBeVisible()
    }
  })

  test('should display all user data', async ({ page }) => {
    // Check for user IDs
    await expect(page.locator('td:has-text("U001")')).toBeVisible()
    await expect(page.locator('td:has-text("U002")')).toBeVisible()
    await expect(page.locator('td:has-text("U003")')).toBeVisible()
    await expect(page.locator('td:has-text("U004")')).toBeVisible()
    await expect(page.locator('td:has-text("U005")')).toBeVisible()

    // Check for user names - use more specific selectors to avoid strict mode violations
    await expect(page.locator('td:has-text("Admin User")')).toBeVisible()
    await expect(page.locator('td:has-text("John Doe")')).toBeVisible()
    await expect(page.locator('td:has-text("Jane Smith")')).toBeVisible()
    await expect(page.locator('td:has-text("Support Staff")')).toBeVisible()
    await expect(page.locator('td:has-text("Inactive User")')).toBeVisible()
  })

  test('should display user emails', async ({ page }) => {
    // Check for emails - use more specific selectors to avoid strict mode violations
    await expect(page.locator('td:has-text("admin@chipn.com")')).toBeVisible()
    await expect(page.locator('td:has-text("john.doe@example.com")')).toBeVisible()
    await expect(page.locator('td:has-text("jane.smith@example.com")')).toBeVisible()
    await expect(page.locator('td:has-text("support@chipn.com")')).toBeVisible()
    await expect(page.locator('td:has-text("inactive@example.com")')).toBeVisible()
  })

  test('should display user role badges', async ({ page }) => {
    // Check for roles - use more specific selectors to avoid strict mode violations
    const adminRoles = page.locator('span:has-text("Admin")')
    await expect(adminRoles.first()).toBeVisible()

    const supportRoles = page.locator('span:has-text("Support")')
    await expect(supportRoles.first()).toBeVisible()

    // Regular users might just show as "User" implicitly in the data
  })

  test('should display user status badges', async ({ page }) => {
    // Check for active status - use more specific selectors to avoid strict mode violations
    const activeStatuses = page.locator('span:has-text("Active")')
    await expect(activeStatuses.first()).toBeVisible()

    // Check for inactive status - use more specific selectors to avoid strict mode violations
    const inactiveStatuses = page.locator('span:has-text("Inactive")')
    await expect(inactiveStatuses.first()).toBeVisible()
  })

  test('should apply correct role colors', async ({ page }) => {
    // Admin role should have purple background
    const adminBadge = page.locator('span:has-text("Admin")').first()
    await expect(adminBadge).toHaveClass(/bg-purple-100/)

    // Support role should have blue background
    const supportBadge = page.locator('span:has-text("Support")').first()
    await expect(supportBadge).toHaveClass(/bg-blue-100/)
  })

  test('should apply correct status colors', async ({ page }) => {
    // Active status should have green background
    const activeStatus = page.locator('span:has-text("Active")').first()
    await expect(activeStatus).toHaveClass(/bg-green-100/)

    // Inactive status should have yellow background
    const inactiveStatus = page.locator('span:has-text("Inactive")').first()
    await expect(inactiveStatus).toHaveClass(/bg-yellow-100/)
  })

  test('should have functioning sidebar on users page', async ({ page }) => {
    // Sidebar should be visible
    await expect(page.locator('text=Chipn Admin')).toBeVisible()

    // All navigation links should be visible
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('a:has-text("Vendors")')).toBeVisible()
    await expect(page.locator('a:has-text("Transactions")')).toBeVisible()
  })

  test('should navigate to Dashboard from Users page', async ({ page }) => {
    // Click Dashboard link
    await page.locator('a:has-text("Dashboard")').first().click()

    // Should navigate to dashboard
    await page.waitForURL('**/admin')
    await expect(page.locator('h1')).toContainText('Dashboard Overview')
  })

  test('should navigate to Vendors from Users page', async ({ page }) => {
    // Click Vendors link
    await page.locator('a:has-text("Vendors")').click()

    // Should navigate to vendors
    await page.waitForURL('**/admin/vendors')
    await expect(page.locator('h1')).toContainText('Vendors Management')
  })

  test('should display correct number of user rows', async ({ page }) => {
    // Count rows in table body
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBe(5) // 5 users
  })

  test('should have hover effect on table rows', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first()

    // Hover over row
    await firstRow.hover()

    // Row should have hover styling
    await expect(firstRow).toHaveClass(/hover:bg-slate-50/)
  })

  test('should display last login information', async ({ page }) => {
    // Check that last login dates are displayed
    const lastLoginCells = page.locator('tbody td').filter({ hasText: /2025|2024/ })
    const count = await lastLoginCells.count()
    expect(count).toBeGreaterThan(0)
  })
})
