import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin Vendors Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await loginAsAdmin(page)
    // Navigate to vendors page
    await page.goto('/admin/vendors')
    await page.waitForLoadState('networkidle')
  })

  test('should display vendors page heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Vendors Management')
    await expect(page.locator('text=Manage all vendors in the system')).toBeVisible()
  })

  test('should display vendor statistics cards', async ({ page }) => {
    // Check for stat cards
    await expect(page.locator('text=Total Vendors')).toBeVisible()

    const activeVendorsCard = page.locator('div').filter({ hasText: 'Active Vendors' })
    await expect(activeVendorsCard.first()).toBeVisible()

    const inactiveVendorsCard = page.locator('div').filter({ hasText: 'Inactive Vendors' })
    await expect(inactiveVendorsCard.first()).toBeVisible()
  })

  test('should display vendor list table', async ({ page }) => {
    // Check for table heading
    await expect(page.locator('text=Vendor List')).toBeVisible()

    // Check for table headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Status', 'Join Date']
    for (const header of headers) {
      await expect(page.locator(`text=${header}`)).toBeVisible()
    }
  })

  test('should display all vendor data', async ({ page }) => {
    // Check for vendor IDs
    await expect(page.locator('text=V001')).toBeVisible()
    await expect(page.locator('text=V002')).toBeVisible()
    await expect(page.locator('text=V003')).toBeVisible()
    await expect(page.locator('text=V004')).toBeVisible()

    // Check for vendor names
    await expect(page.locator('text=Java House')).toBeVisible()
    await expect(page.locator('text=Kenyan Bites')).toBeVisible()
    await expect(page.locator('text=Mama Deli')).toBeVisible()
    await expect(page.locator('text=Tech Café')).toBeVisible()
  })

  test('should display vendor contact information', async ({ page }) => {
    // Check for emails
    await expect(page.locator('text=contact@javahouse.co.ke')).toBeVisible()
    await expect(page.locator('text=info@kenyanbites.com')).toBeVisible()

    // Check for phone numbers
    await expect(page.locator('text=+254 722 123 456')).toBeVisible()
    await expect(page.locator('text=+254 733 234 567')).toBeVisible()

    // Check for locations
    const nairobi = page.locator('text=Nairobi')
    await expect(nairobi.first()).toBeVisible()
    await expect(page.locator('text=Kampala')).toBeVisible()
  })

  test('should display vendor status badges', async ({ page }) => {
    // Check for active status
    const activeStatuses = page.locator('text=Active')
    await expect(activeStatuses.first()).toBeVisible()

    // Check for inactive status
    await expect(page.locator('span:has-text("Inactive")')).toBeVisible()
  })

  test('should apply correct status colors', async ({ page }) => {
    // Active status should have green background
    const activeStatus = page.locator('span:has-text("Active")').first()
    await expect(activeStatus).toHaveClass(/bg-green-100/)

    // Inactive status should have red background
    const inactiveStatus = page.locator('span:has-text("Inactive")')
    await expect(inactiveStatus).toHaveClass(/bg-red-100/)
  })

  test('should have functioning sidebar on vendors page', async ({ page }) => {
    // Sidebar should be visible
    await expect(page.locator('text=TandaPay Admin')).toBeVisible()

    // All navigation links should be visible
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('a:has-text("Transactions")')).toBeVisible()
    await expect(page.locator('a:has-text("User Management")')).toBeVisible()
  })

  test('should navigate to Dashboard from Vendors page', async ({ page }) => {
    // Click Dashboard link
    await page.locator('a:has-text("Dashboard")').first().click()

    // Should navigate to dashboard
    await page.waitForURL('**/admin')
    await expect(page.locator('h1')).toContainText('Dashboard Overview')
  })

  test('should display correct number of vendor rows', async ({ page }) => {
    // Count rows in table body
    const rows = page.locator('tbody tr')
    const count = await rows.count()
    expect(count).toBe(4) // 4 vendors
  })

  test('should have hover effect on table rows', async ({ page, browserName }) => {
    page.viewportSize()?.width! < 768 && browserName === 'chromium' ? test.skip() : null
    const firstRow = page.locator('tbody tr').first()

    // Hover over row
    await firstRow.hover()

    // Row should have hover styling
    await expect(firstRow).toHaveClass(/hover:bg-slate-50/)
  })
})
