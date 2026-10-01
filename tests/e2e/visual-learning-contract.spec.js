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
    const externalRequests = [];
    page.on('request', request => {
      if (/^https?:\/\//.test(request.url()) && !request.url().startsWith('http://127.0.0.1') && !request.url().startsWith('http://localhost')) {
        externalRequests.push(request.url());
      }
    });
    await page.goto('/');
    const workshop = page.locator('#rps02-visual-workshop');
    await expect(page.locator('#rps02-photo')).toHaveAttribute('accept', /image/);
    await workshop.locator('[data-next="2"]').click();
    await workshop.locator('[data-next="3"]').click();
    await workshop.locator('[data-next="4"]').click();

    await page.locator('#rps02-photo').setInputFiles({
      name: 'observation.png',
      mimeType: 'image/png',
      buffer: Buffer.from([
        137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,
        0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,
        0,0,0,13,73,68,65,84,8,215,99,248,207,192,240,
        31,0,5,0,1,255,137,153,61,29,0,0,0,0,73,69,78,68,174,66,96,130
      ])
    });
    await expect(page.locator('#rps02-photo-preview')).toBeVisible();
    await expect(page.locator('#rps02-photo-status')).toContainText('localement uniquement');
    expect(externalRequests.some(url => /googleusercontent|justisse\.ca/i.test(url))).toBe(false);

    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/vous ovulez|vous êtes fertile|c'est votre glaire fertile/i);
  });

  test('the real corpus registry is loaded with provenance and licensing fields', async ({ page }) => {
    await page.goto('/');
    const corpus = page.locator('#rps02-corpus-list');
    await expect(corpus).toBeVisible();
    await expect(corpus.locator('.rps02-corpus-item')).toHaveCount(9);
    await expect(corpus).toContainText('Photo A01');
    await expect(corpus).toContainText('Photo A09');
    await expect(corpus).toContainText('candidate_pending_expert');
    expect(await corpus.innerText()).not.toMatch(/10CK|10C|6CK|8CKG|10CKG|6K|10K|8K/);
  });

  test('the comparison step displays the real local photos without source labels', async ({ page }) => {
    await page.goto('/');
    const workshop = page.locator('#rps02-visual-workshop');
    await workshop.locator('[data-next="2"]').click();
    const photos = workshop.locator('.rps02-photo-example');
    await expect(photos).toHaveCount(9);
    await expect(photos.first().locator('img')).toBeVisible();
    await expect.poll(async () => photos.first().locator('img').evaluate(img => img.naturalWidth), { timeout: 15000 }).toBeGreaterThan(0);
    await expect(photos.first().locator('img')).toHaveAttribute('src', /(?:googleusercontent\.com|data\/rps02-blind-assets\/RPS02-A01\.jpg)/);

    await photos.first().click();
    await expect(photos.first()).toHaveAttribute('aria-pressed', 'true');
    await workshop.locator('[data-next="3"]').click();

    const feedback = workshop.locator('#rps02-feedback');
    await expect(feedback).toContainText('photo A01');
    expect(await feedback.innerText()).not.toMatch(/10CK|10C|6CK|8CKG|10CKG|6K|10K|8K/);
    expect(await feedback.innerText()).not.toMatch(/vous ovulez|vous êtes fertile|c'est votre glaire fertile/i);
  });

  test('the questionnaire produces a pedagogical interpretation of a fertile-like observation', async ({ page }) => {
    await page.goto('/');
    const workshop = page.locator('#rps02-visual-workshop');

    await workshop.locator('[data-group="sensation"] button[data-value="lubricative"]').click();
    await workshop.locator('[data-group="appearance"] button[data-value="stretchy"]').click();
    await workshop.locator('[data-group="transparency"] button[data-value="transparent"]').click();
    await workshop.locator('[data-group="stretch"] button[data-value="clear"]').click();

    await workshop.locator('[data-next="2"]').click();
    await workshop.locator('[data-next="3"]').click();
    await workshop.locator('[data-next="4"]').click();
    await workshop.locator('[data-next="5"]').click();

    const result = workshop.locator('#rps02-interpretation');
    await expect(result).toContainText('Votre observation ressemble à un mucus de période fertile');
    await expect(result).toContainText('autour de l’ovulation');
    await expect(result).toContainText('ne permettent pas de dire que vous ovulez aujourd’hui');
    await expect(result).not.toContainText('10CK');
    await expect(result).not.toContainText('10C');
    await expect(result).not.toContainText('6CK');
  });

});
