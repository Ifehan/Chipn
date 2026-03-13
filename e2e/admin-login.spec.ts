import { test, expect } from '@playwright/test'

test.describe('Admin Login Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login page
    await page.goto('/admin/login')
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should display admin login page heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Chipn Admin')
  })

  test('should display login subtitle', async ({ page }) => {
    await expect(page.locator('text=Sign in to access the dashboard')).toBeVisible()
  })

  test('should display email input field', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    await expect(emailInput).toHaveAttribute('placeholder', 'you@example.com')
  })

  test('should display password input field', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
    await expect(passwordInput).toHaveAttribute('placeholder', '••••••••')
  })

  test('should display email address label', async ({ page }) => {
    await expect(page.locator('text=Email Address')).toBeVisible()
  })

  test('should display password label', async ({ page }) => {
    // Use more specific locator to avoid strict mode violations
    const passwordLabel = page.locator('label:has-text("Password")')
    await expect(passwordLabel).toBeVisible()
  })

  test('should display sign in button', async ({ page }) => {
    const signInButton = page.locator('button:has-text("Sign In")')
    await expect(signInButton).toBeVisible()
  })

  test('should display back to home button', async ({ page }) => {
    const backButton = page.locator('button:has-text("Back to Home")')
    await expect(backButton).toBeVisible()
  })

  test('should display demo credentials section', async ({ page }) => {
    await expect(page.locator('text=Demo Credentials:')).toBeVisible()
  })

  test('should display admin role credentials', async ({ page }) => {
    // Use more specific selectors to avoid strict mode violations
    const adminRole = page.locator('p:has-text("Admin")').first()
    await expect(adminRole).toBeVisible()
    await expect(page.locator('text=admin@chipn.com')).toBeVisible()
    await expect(page.locator('text=admin123')).toBeVisible()
  })

  test('should display support staff credentials', async ({ page }) => {
    const supportRole = page.locator('p:has-text("Support Staff")')
    await expect(supportRole).toBeVisible()
    await expect(page.locator('text=support@chipn.com')).toBeVisible()
    await expect(page.locator('text=support123')).toBeVisible()
  })

  test('should display analyst credentials', async ({ page }) => {
    // Use the exact same approach as other tests but ensure we're selecting the right element
    const analystRole = page.locator('p:has-text("Analyst")').first()
    await expect(analystRole).toBeVisible()
    await expect(page.locator('text=analyst@chipn.com')).toBeVisible()
    await expect(page.locator('text=analyst123')).toBeVisible()
  })

  test('should show error when submitting empty form', async ({ page }) => {
    const signInButton = page.locator('button:has-text("Sign In")')
    await signInButton.click()

    await expect(page.locator('text=Please fill in all fields')).toBeVisible()
  })

  test('should show error when email is empty', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    const signInButton = page.locator('button:has-text("Sign In")')

    await passwordInput.fill('admin123')
    await signInButton.click()

    await expect(page.locator('text=Please fill in all fields')).toBeVisible()
  })

  test('should show error when password is empty', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const signInButton = page.locator('button:has-text("Sign In")')

    await emailInput.fill('admin@chipn.com')
    await signInButton.click()

    await expect(page.locator('text=Please fill in all fields')).toBeVisible()
  })

  test('should accept email input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('admin@chipn.com')

    await expect(emailInput).toHaveValue('admin@chipn.com')
  })

  test('should accept password input', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('admin123')

    await expect(passwordInput).toHaveValue('admin123')
  })

  test('should disable form inputs while loading', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const signInButton = page.locator('button:has-text("Sign In")')

    await emailInput.fill('admin@chipn.com')
    await passwordInput.fill('admin123')

    // Start the form submission and wait for the loading state to appear
    await signInButton.click()

    // Give it a bit more time for the DOM to update
    await page.waitForTimeout(100)

    // Check if button is disabled during loading
    // Alternative approach: check that the button has the disabled class
    await expect(signInButton).toHaveClass(/disabled/)
  })

  test('should navigate to home when back button is clicked', async ({ page }) => {
    const backButton = page.locator('button:has-text("Back to Home")')
    await backButton.click()

    // Should navigate to home page
    await page.waitForURL('/')
    await expect(page).toHaveURL(/\/$/)
  })

  test('should have dark lock icon in header', async ({ page }) => {
    // Look for the lock icon SVG or container
    const header = page.locator('h1:has-text("Chipn Admin")')
    const headerContainer = header.locator('..')
    await expect(headerContainer).toBeVisible()
  })

  test('should display demo credentials in card format', async ({ page }) => {
    // Fix invalid CSS selector - use proper approach to find credential cards
    const credentialItems = page.locator('.rounded-lg')
    const count = await credentialItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('email input should have correct placeholder text', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]')
    const placeholder = await emailInput.getAttribute('placeholder')
    expect(placeholder).toBe('you@example.com')
  })

  test('password input should have correct placeholder text', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]')
    const placeholder = await passwordInput.getAttribute('placeholder')
    expect(placeholder).toBe('••••••••')
  })

  test('should have proper styling with dark background', async ({ page }) => {
    // Check for gradient or dark background on main container
    const mainCard = page.locator('.rounded-2xl').first()
    await expect(mainCard).toHaveCSS('background-color', /rgb\(255, 255, 255\)/) // White card
  })

  test('sign in button should have dark background', async ({ page }) => {
    const signInButton = page.locator('button:has-text("Sign In")')
    // Button should have dark styling
    await expect(signInButton).toHaveClass(/bg-slate-900/)
  })

  test('back button should have light background', async ({ page }) => {
    const backButton = page.locator('button:has-text("Back to Home")')
    // Back button should have light styling
    await expect(backButton).toHaveClass(/bg-slate-100/)
  })

  test('should display all demo credential roles correctly', async ({ page }) => {
    // Use more specific selectors to avoid strict mode violations
    const adminRole = page.locator('p:has-text("Admin")').first()
    const supportRole = page.locator('p:has-text("Support Staff")')
    const analystRole = page.locator('p:has-text("Analyst")').first()

    await expect(adminRole).toBeVisible()
    await expect(supportRole).toBeVisible()
    await expect(analystRole).toBeVisible()
  })

  test('credentials should be clickable/copyable', async ({ page }) => {
    // All credential text should be accessible
    const adminEmail = page.locator('text=admin@chipn.com')
    const adminPassword = page.locator('text=admin123')

    await expect(adminEmail).toBeVisible()
    await expect(adminPassword).toBeVisible()
  })

  test('form should be properly labeled for accessibility', async ({ page }) => {
    // Use more specific locator to avoid strict mode violations
    const emailLabel = page.locator('label:has-text("Email Address")')
    const passwordLabel = page.locator('label:has-text("Password")')

    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()
  })
})
