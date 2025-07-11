import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create Next App/)
})

test('homepage loads', async ({ page }) => {
  await page.goto('/')

  // Expect homepage to have Next.js logo
  await expect(page.locator('img[alt="Next.js logo"]')).toBeVisible()
})