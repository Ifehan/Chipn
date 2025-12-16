import { Page } from '@playwright/test'

/**
 * Setup mock API responses for authentication
 */
async function setupAuthMocks(page: Page, email: string) {
  // Mock login endpoint
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'mock-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600
      })
    })
  })

  // Mock current user endpoint
  await page.route('**/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '1',
        email: email,
        name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString()
      })
    })
  })
}

/**
 * Login as admin user for e2e tests
 * Uses the demo admin credentials to authenticate
 */
export async function loginAsAdmin(page: Page) {
  // Setup API mocks before navigating
  await setupAuthMocks(page, 'admin@tandapay.com')
  
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  
  // Fill in admin credentials
  await page.fill('input[type="email"]', 'admin@tandapay.com')
  await page.fill('input[type="password"]', 'admin123')
  
  // Submit the form
  await page.click('button:has-text("Sign In")')
  
  // Wait for navigation to admin dashboard
  await page.waitForURL('**/admin')
  await page.waitForLoadState('networkidle')
}

/**
 * Login as support staff for e2e tests
 */
export async function loginAsSupport(page: Page) {
  await setupAuthMocks(page, 'support@tandapay.com')
  
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  
  await page.fill('input[type="email"]', 'support@tandapay.com')
  await page.fill('input[type="password"]', 'support123')
  
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/admin')
  await page.waitForLoadState('networkidle')
}

/**
 * Login as analyst for e2e tests
 */
export async function loginAsAnalyst(page: Page) {
  await setupAuthMocks(page, 'analyst@tandapay.com')
  
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  
  await page.fill('input[type="email"]', 'analyst@tandapay.com')
  await page.fill('input[type="password"]', 'analyst123')
  
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/admin')
  await page.waitForLoadState('networkidle')
}
