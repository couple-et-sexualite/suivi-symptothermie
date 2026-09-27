const { test, expect } = require('@playwright/test');

async function resetApp(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

test.describe('cervical observation assistant', () => {
  test('provides a descriptive result without fertility interpretation', async ({ page }) => {
    await resetApp(page);

    await expect(page.locator('#cervical-observation-assistant')).toBeVisible();
    await page.locator('#ca-transparency').selectOption('opaque');
    await page.locator('#ca-texture').selectOption('creamy');
    await page.locator('#ca-extensibility').selectOption('absent');
    await page.locator('#ca-sensation').selectOption('moist');
    await page.locator('#ca-stretch-length').selectOption('0');
    await page.locator('#cervical-assistant-analyze').click();

    const result = page.locator('#cervical-assistant-result');
    await expect(result).toContainText('crémeuse');
    await expect(result).not.toContainText(/fertile|ovulation|Peak \+?3|contracept/i);
  });

  test('returns uncertainty when the observation is insufficient', async ({ page }) => {
    await resetApp(page);

    await page.locator('#ca-texture').selectOption('mixed');
    await page.locator('#cervical-assistant-analyze').click();

    await expect(page.locator('#cervical-assistant-result')).toContainText(/incertaine|mixte/i);
  });

  test('keeps the optional photo local and does not send it to a network endpoint', async ({ page }) => {
    await resetApp(page);

    const requests = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/') || request.method() !== 'GET') requests.push({ url, method: request.method() });
    });

    const png1x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64'
    );
    await page.locator('#cervical-photo').setInputFiles({
      name: 'observation.png',
      mimeType: 'image/png',
      buffer: png1x1
    });

    await expect(page.locator('#cervical-photo-status')).toContainText(/résolution est faible/i);
    await expect(page.locator('#cervical-photo-preview')).toBeVisible();
    await expect(page.locator('#cervical-photo')).toHaveValue(/observation\.png$/i);
    expect(requests).toEqual([]);
  });

  test('reset clears the observation assistant', async ({ page }) => {
    await resetApp(page);

    await page.locator('#ca-transparency').selectOption('transparent');
    await page.locator('#ca-texture').selectOption('stretchy');
    await page.locator('#cervical-assistant-analyze').click();
    await expect(page.locator('#cervical-assistant-result')).toBeVisible();

    await page.locator('#cervical-assistant-reset').click();

    await expect(page.locator('#ca-transparency')).toHaveValue('unknown');
    await expect(page.locator('#ca-texture')).toHaveValue('unknown');
    await expect(page.locator('#cervical-assistant-result')).toBeHidden();
  });
});
