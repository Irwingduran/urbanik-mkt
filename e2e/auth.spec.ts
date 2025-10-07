import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login')

    // Check that we're on the login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login')

    // Look for sign up link
    const signUpLink = page.getByRole('link', { name: /sign up|register|create account/i })
    if (await signUpLink.isVisible()) {
      await signUpLink.click()
      await expect(page).toHaveURL(/\/register|\/signup/)
    }
  })
})
