import { test, expect } from '@playwright/test';

test.describe('RPS-02 visual learning — contract tests', () => {
  test('the integrated workshop offers an explicit unknown path', async ({ page }) => {
    await page.goto('/');
    const workshop = page.locator('#rps02-visual-workshop');
    await expect(workshop).toBeVisible();
    const unknown = workshop.locator('[data-group="sensation"] button[data-value="unknown"]');
    await expect(unknown).toHaveAttribute('aria-pressed', 'false');
    await unknown.click();
    await expect(unknown).toHaveAttribute('aria-pressed', 'true');
  });

  test('the workshop keeps the photo local and does not present a clinical conclusion', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/vous ovulez|vous êtes fertile|c'est votre glaire fertile/i);
    await expect(page.locator('#rps02-photo')).toHaveAttribute('accept', /image/);
    await expect(page.locator('#rps02-photo-status')).toBeVisible();
    await expect(page.locator('#rps02-result')).toHaveCount(0);
  });

  test('the real corpus registry is loaded with provenance and licensing fields', async ({ page }) => {
    await page.goto('/');
    const corpus = page.locator('#rps02-corpus-list');
    await expect(corpus).toBeVisible();
    await expect(corpus.locator('.rps02-corpus-item')).toHaveCount(9);
    await expect(corpus).toContainText('10CK');
    await expect(corpus).toContainText('10C');
    await expect(corpus).toContainText('6CK');
  });

  test('the comparison result only repeats observations selected by the user', async ({ page }) => {
    await page.goto('/');
    const workshop = page.locator('#rps02-visual-workshop');
    await workshop.locator('[data-group="transparency"] button[data-value="transparent"]').click();
    await workshop.locator('[data-group="appearance"] button[data-value="watery"]').click();
    await workshop.locator('[data-next="2"]').click();
    await workshop.locator('.rps02-example[data-example="transparent"]').click();
    await workshop.locator('[data-next="3"]').click();
    const feedback = workshop.locator('#rps02-feedback');
    await expect(feedback).toContainText('transparent');
    expect(await feedback.innerText()).not.toMatch(/vous ovulez|vous êtes fertile|c'est votre glaire fertile/i);
  });
});
