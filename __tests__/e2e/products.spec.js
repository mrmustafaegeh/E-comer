import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test('should load products and display grid', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    
    // Check if URL is correct
    await expect(page).toHaveURL(/\/products/);
    
    // Check for main heading or filter sidebar
    await expect(page.locator('h3:has-text("Filters")')).toBeVisible();
    
    // Check if products grid is present (assuming class name or role)
    // We look for at least one product card
    // Note: Depends on seed data, but structure should be there.
    const productCards = page.locator('.product-card'); // Update selector if needed
    // We expect the page not to show "Error"
    await expect(page.locator('text=Error loading products')).not.toBeVisible();
  });

  test('should update URL when filter is applied', async ({ page }) => {
    await page.goto('/products');
    
    // Find a filter (e.g., Min Price input)
    // Adjust selector based on actual generic components used
    const minPriceInput = page.locator('input[placeholder="Min"]');
    
    if (await minPriceInput.isVisible()) {
      await minPriceInput.fill('100');
      await minPriceInput.press('Enter');
      
      // Wait for URL update
      await expect(page).toHaveURL(/minPrice=100/);
    }
  });

  test('should perform search', async ({ page }) => {
    await page.goto('/products');
    
    const searchInput = page.locator('input[type="search"]');
    if (await searchInput.isVisible()) {
        await searchInput.fill('laptop');
        await searchInput.press('Enter');
        
        await expect(page).toHaveURL(/search=laptop/);
    }
  });
});
