import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the page title is present
    await expect(page).toHaveTitle(/Regen Marketplace/i)
  })

  test('should display main navigation', async ({ page }) => {
    await page.goto('/')

    // Check for main navigation elements
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should be able to navigate to marketplace', async ({ page }) => {
    await page.goto('/')

    // Look for marketplace link and click it
    const marketplaceLink = page.getByRole('link', { name: /marketplace/i })
    if (await marketplaceLink.isVisible()) {
      await marketplaceLink.click()
      await expect(page).toHaveURL(/\/marketplace/)
    }
  })

  test('should display hero section', async ({ page }) => {
    await page.goto('/')

    // Check that hero section is visible
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that page loads correctly
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
  })
})
