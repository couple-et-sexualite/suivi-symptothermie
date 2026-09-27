import { test, expect } from '@playwright/test';

test.describe('RPS-02 visual learning — contract tests', () => {
  test('module must offer an explicit unknown path', async ({ page }) => {
    await page.goto('/');
    const unknown = page.getByText(/je ne sais pas/i).first();
    await expect(unknown).toBeVisible();
  });

  test('visual examples must not be presented as a clinical conclusion', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/vous ovulez|vous êtes fertile|c'est votre glaire fertile/i);
  });
});
