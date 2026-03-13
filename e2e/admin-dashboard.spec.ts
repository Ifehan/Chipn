import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Admin Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await loginAsAdmin(page)
  })

  test('should display dashboard overview', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Dashboard Overview')

    // Check for welcome message
    await expect(page.locator('text=Welcome back, Admin User!')).toBeVisible()
  })

  test('should display all stat cards', async ({ page }) => {
    // Check for stat card labels
    await expect(page.locator('text=Total Vendors')).toBeVisible()
    await expect(page.locator('text=Transactions Today')).toBeVisible()
    await expect(page.locator('text=Total Revenue')).toBeVisible()

    // Check for stat values using specific class selectors to avoid multiple matches
    // Find the specific value elements in the stat cards
    const statValues = page.locator('.text-2xl.font-bold.text-gray-900')
    await expect(statValues.nth(0)).toBeVisible() // Total Vendors: 4
    await expect(statValues.nth(1)).toBeVisible() // Transactions Today: 0
    await expect(statValues.nth(2)).toBeVisible() // Total Revenue: KES 835,100
  })

  test('should display transaction volume chart section', async ({ page }) => {
    await expect(page.locator('text=Transaction Volume (Last 7 Days)')).toBeVisible()
  })

  test('should display recent transactions table', async ({ page }) => {
    // Check table headers
    await expect(page.locator('text=Recent Transactions')).toBeVisible()
    await expect(page.locator('text=TRANSACTION ID')).toBeVisible()
    await expect(page.locator('th:text("VENDOR")')).toBeVisible()
    await expect(page.locator('text=AMOUNT')).toBeVisible()
    await expect(page.locator('text=STATUS')).toBeVisible()
    await expect(page.locator('text=TIME')).toBeVisible()

    // Check for sample transactions
    await expect(page.locator('text=TXN001')).toBeVisible()
    await expect(page.locator('text=Java House')).toBeVisible()
    await expect(page.locator('text=Success')).toBeVisible()
  })

  test('should display View All link', async ({ page }) => {
    const viewAllLink = page.locator('a:has-text("View All →")')
    await expect(viewAllLink).toBeVisible()
  })

  test('should render sidebar with navigation', async ({ page }) => {
    // Check sidebar branding
    await expect(page.locator('text=Chipn Admin')).toBeVisible()
    await expect(page.locator('text=Bill Splitting Dashboard')).toBeVisible()

    // Check navigation items
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible()
    await expect(page.locator('a:has-text("Vendors")')).toBeVisible()
    await expect(page.locator('a:has-text("Transactions")')).toBeVisible()
    await expect(page.locator('a:has-text("User Management")')).toBeVisible()
  })

  test('should display user profile in sidebar', async ({ page }) => {
    // Use more specific selector for the user name
    await expect(page.locator('div:text("Admin User")')).toBeVisible()
    await expect(page.locator('text=admin@chipn.com')).toBeVisible()
  })

  test('should have logout button in sidebar', async ({ page }) => {
    const logoutButton = page.locator('button:has-text("Logout")')
    await expect(logoutButton).toBeVisible()
  })

  test('Dashboard link should have active state', async ({ page }) => {
    const dashboardLink = page.locator('a:has-text("Dashboard")').first()
    // Check if it has the active/highlighted class
    await expect(dashboardLink).toHaveClass(/bg-slate-900/)
  })
})
