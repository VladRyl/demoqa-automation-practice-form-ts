import { expect, test } from '@playwright/test';

test('open practice form', async ({ page }) => {
  await page.goto('/automation-practice-form');
  await expect(page.locator('.container.playgound-body h1')).toHaveText('Practice Form');
});
