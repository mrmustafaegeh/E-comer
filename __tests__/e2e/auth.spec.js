import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to register and login', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await expect(page).toHaveTitle(/Register/);
    
    // Fill form
    const email = `test-${Date.now()}@example.com`;
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Password123!');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect or success message
    // Adjust selector based on actual UI
    // await expect(page).toHaveURL('/login'); 
    
    // 2. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Verify Dashboard access
    await expect(page).toHaveURL('/');
    // Check for user menu or name
    // await expect(page.locator('header')).toContainText('Test User');
  });
});
