import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Atividades Incríveis para');

    // Check if navigation is present (visible on desktop, hidden on mobile)
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      await expect(page.locator('header nav')).toBeVisible();
    } else {
      await expect(page.locator('[aria-label="Menu"]')).toBeVisible();
    }

    // Check if the KidsHiz logo is present
    await expect(page.locator('header >> text=KidsHiz')).toBeVisible();

    // Check if the explore activities button is present
    await expect(
      page.getByRole('button', { name: 'Explorar Atividades' })
    ).toBeVisible();
  });

  test('should navigate to activities page', async ({ page }) => {
    await page.goto('/');

    // Click on explore activities button
    await page.getByRole('button', { name: 'Explorar Atividades' }).click();

    // Should navigate to activities page
    await expect(page).toHaveURL('/activities');

    // Check if activities page loaded
    await expect(page.locator('h1')).toContainText(
      'Explora Atividades para Crianças'
    );
  });

  test('should show stats on homepage', async ({ page }) => {
    await page.goto('/');

    // Check if stats section is visible
    await expect(page.locator('text=500+')).toBeVisible();
    await expect(page.locator('text=Atividades Disponíveis')).toBeVisible();
    await expect(page.locator('text=50+')).toBeVisible();
    await expect(page.locator('text=Prestadores de Confiança')).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible();

    // Desktop navigation should be hidden
    await expect(page.locator('header nav.hidden')).not.toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/');

    // Click on sign in button (handle both desktop and mobile)
    const isMobile = await page.locator('[aria-label="Menu"]').isVisible();

    if (isMobile) {
      // Open mobile menu first
      await page.click('[aria-label="Menu"]');
      // Wait for mobile menu to be visible
      await page.waitForSelector('text=Entrar', { state: 'visible' });
      await page.click('text=Entrar');
    } else {
      await page.click('header >> text=Entrar');
    }

    // Should navigate to sign in page
    await expect(page).toHaveURL('/auth/signin');

    // Check if sign in form is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation on empty form submission', async ({ page }) => {
    await page.goto('/auth/signin');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Form should prevent submission (required fields)
    await expect(page.locator('input[type="email"]:invalid')).toBeVisible();
  });
});

test.describe('Activities Page', () => {
  test('should load activities page with filters', async ({ page }) => {
    await page.goto('/activities');

    // Check if page loads correctly
    await expect(page.locator('h1')).toContainText(
      'Explora Atividades para Crianças'
    );

    // Check if search functionality is present
    await expect(page.locator('input[placeholder*="Procurar"]')).toBeVisible();

    // Check if filters are present
    await expect(page.locator('text=Filtros')).toBeVisible();
  });

  test('should be able to search for activities', async ({ page }) => {
    await page.goto('/activities');

    // Type in search box
    await page.fill('input[placeholder*="Procurar"]', 'natação');

    // Search input should contain the typed text
    await expect(page.locator('input[placeholder*="Procurar"]')).toHaveValue(
      'natação'
    );
  });
});
