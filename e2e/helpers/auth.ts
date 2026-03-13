import { Page } from '@playwright/test'

const MOCK_VENDORS = [
  { id: '1', name: 'Java House', paybill_number: '123456', created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
  { id: '2', name: 'Kenyan Bites', paybill_number: '234567', created_at: '2024-02-20T00:00:00Z', updated_at: '2024-02-20T00:00:00Z' },
  { id: '3', name: 'Mama Deli', paybill_number: '345678', created_at: '2024-03-10T00:00:00Z', updated_at: '2024-03-10T00:00:00Z' },
  { id: '4', name: 'Tech Café', paybill_number: '456789', created_at: '2023-12-05T00:00:00Z', updated_at: '2023-12-05T00:00:00Z' },
]

const MOCK_TRANSACTIONS = {
  transactions: [
    {
      id: 'txn001',
      merchant_request_id: 'MR001',
      checkout_request_id: 'CR001',
      phone_number: '254712345678',
      amount: 500,
      account_reference: 'Java House',
      transaction_desc: 'Test payment',
      mpesa_receipt_number: 'ABC123',
      transaction_date: new Date().toISOString(),
      status: 'success',
      callback_url: null,
      callback_received: null,
      result_code: null,
      result_desc: null,
      error_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
    },
  ],
  total: 1,
  page: 1,
  page_size: 50,
  status_filter: 'all',
}

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

  // Mock vendors endpoint to prevent 401 redirects from the real backend
  await page.route('**/vendors/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_VENDORS),
    })
  })

  // Mock transactions endpoint to prevent 401 redirects from the real backend
  await page.route('**/mpesa/transactions**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_TRANSACTIONS),
    })
  })
}

/**
 * Login as admin user for e2e tests
 * Uses the demo admin credentials to authenticate
 */
export async function loginAsAdmin(page: Page) {
  // Setup API mocks before navigating
  await setupAuthMocks(page, 'admin@chipn.com')
  
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  
  // Fill in admin credentials
  await page.fill('input[type="email"]', 'admin@chipn.com')
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
  await setupAuthMocks(page, 'support@chipn.com')
  
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  
  await page.fill('input[type="email"]', 'support@chipn.com')
  await page.fill('input[type="password"]', 'support123')
  
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/admin')
  await page.waitForLoadState('networkidle')
}

/**
 * Login as analyst for e2e tests
 */
export async function loginAsAnalyst(page: Page) {
  await setupAuthMocks(page, 'analyst@chipn.com')
  
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  
  await page.fill('input[type="email"]', 'analyst@chipn.com')
  await page.fill('input[type="password"]', 'analyst123')
  
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/admin')
  await page.waitForLoadState('networkidle')
}
