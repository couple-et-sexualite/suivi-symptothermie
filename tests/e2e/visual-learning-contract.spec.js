import { test, expect } from '@playwright/test';

test.describe('RPS-02 visual learning — contract tests', () => {
  test('the integrated workshop offers an explicit unknown path', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#rps02-visual-workshop')).toBeVisible();
    await expect(page.getByText('Je ne sais pas', { exact: true }).first()).toBeVisible();
  });

  test('the workshop keeps the photo local and does not present a clinical conclusion', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/vous ovulez|vous êtes fertile|c'est votre glaire fertile/i);
    await expect(page.locator('#rps02-photo')).toHaveAttribute('accept', /image/);
    await expect(page.locator('#rps02-result')).toBeHidden();
  });

  test('the comparison result only repeats observations selected by the user', async ({ page }) => {
    await page.goto('/');
    await page.locator('#rps02-transparency').selectOption('transparent');
    await page.locator('#rps02-texture').selectOption('watery');
    await page.locator('#rps02-check').click();
    const result = page.locator('#rps02-result');
    await expect(result).toContainText('claire / transparente');
    await expect(result).toContainText('très fluide');
    await expect(result).not.toMatch(/fertile|ovulation|diagnostic|Peak/i);
  });
});
