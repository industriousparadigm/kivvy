import { test, expect } from '@playwright/test';

test.describe('KidsHiz Basic Functionality', () => {
  test('homepage loads and displays activities', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check page title
    await expect(page).toHaveTitle(/KidsHiz/);

    // Check hero section
    await expect(page.locator('h1')).toContainText('Momentos Mágicos');

    // Check activities section exists
    await expect(
      page.locator('[data-testid="activities-section"]')
    ).toBeVisible();

    // Check activity cards are present
    const activityCards = page.locator('.group'); // Activity card selector
    await expect(activityCards).toHaveCount(5);
  });

  test('activity cards display correct pricing', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for activities to load
    await page.waitForSelector('.group', { timeout: 10000 });

    // Check that pricing is in euros (€) format
    const priceElements = page.locator('text=/€\\d+[.,]\\d+/');
    await expect(priceElements.first()).toBeVisible();

    // Verify no cent pricing (should not see prices like €0.25)
    const centPricing = page.locator('text=/€0\\./');
    await expect(centPricing).toHaveCount(0);
  });

  test('activity detail page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for activities to load
    await page.waitForSelector('.group', { timeout: 10000 });

    // Click on first activity card
    await page.locator('.group').first().click();

    // Should navigate to activity detail page
    await expect(page.url()).toMatch(/\/activities\/[a-zA-Z0-9]+/);

    // Page should load without crashing
    await expect(page.locator('h1')).toBeVisible();
  });

  test('dashboard loads without crashing', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');

    // Should either show login page or dashboard content
    // (depending on authentication state)
    await expect(page.locator('body')).toBeVisible();

    // Check that we don't have React error boundaries
    const errorBoundary = page.locator('text=/Something went wrong/');
    await expect(errorBoundary).toHaveCount(0);
  });

  test('navigation menu works correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check contact page navigation
    await page.click('text=Contacto');
    await expect(page.url()).toContain('/contact');
    await expect(page.locator('h1')).toContainText('Fale Connosco');

    // Check help page navigation
    await page.goto('http://localhost:3000');
    await page.click('text=Ajuda');
    await expect(page.url()).toContain('/help');
    await expect(page.locator('h1')).toContainText('Centro de Ajuda');
  });

  test('consistent styling across pages', async ({ page }) => {
    const pages = ['/', '/contact', '/help', '/about'];

    for (const path of pages) {
      await page.goto(`http://localhost:3000${path}`);

      // Check for warm theme colors (rose/amber)
      const warmElements = await page
        .locator('[class*="rose-"], [class*="amber-"]')
        .count();
      expect(warmElements).toBeGreaterThan(0);

      // Check page loads without errors
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('API endpoints respond correctly', async ({ page }) => {
    // Test activities API
    const activitiesResponse = await page.request.get(
      'http://localhost:3000/api/activities'
    );
    expect(activitiesResponse.status()).toBe(200);

    const activitiesData = await activitiesResponse.json();
    expect(activitiesData.activities).toHaveLength(5);

    // Test individual activity API
    const firstActivityId = activitiesData.activities[0].id;
    const activityResponse = await page.request.get(
      `http://localhost:3000/api/activities/${firstActivityId}`
    );
    expect(activityResponse.status()).toBe(200);
  });
});
