const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function resetApp(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

test.describe('professional end-to-end and mobile QA', () => {
  test('boots without JavaScript errors and exposes the six main areas', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await resetApp(page);

    for (const hash of ['#accueil', '#graphique', '#calendrier', '#historique', '#apprendre', '#profil']) {
      await page.locator('nav a[href="' + hash + '"]').click();
      await expect(page.locator(hash)).toBeVisible();
    }

    expect(errors).toEqual([]);
  });

  test('records an observation and keeps it after a reload', async ({ page }) => {
    await resetApp(page);

    const date = await page.locator('#f-date').inputValue();
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#f-time').fill('07:00');
    await page.locator('#f-mucus').selectOption('cremeuse');
    await page.locator('#f-bleeding').selectOption('aucun');
    await page.locator('#f-notes').fill('QA observation');
    await page.locator('#save-entry-btn').click();

    await expect(page.locator('#entry-action-status')).toContainText('Observation');
    await expect(page.locator('#today-summary')).toContainText('36.50');
    await page.reload();

    await expect(page.locator('#today-summary')).toContainText('36.50');
    await expect(page.locator('#calendar-grid [data-calendar-date="' + date + '"]')).toBeVisible();
  });

  test('switches to Fahrenheit and saves a valid converted measurement', async ({ page }) => {
    await resetApp(page);

    await page.locator('#profil').scrollIntoViewIfNeeded();
    await page.locator('#profile-unit').selectOption('f');
    await page.locator('[data-action="save-profile"]').click();

    await expect(page.locator('#temp-unit-label')).toHaveText('°F');
    await page.locator('#f-temp').fill('98.60');
    await page.locator('#save-entry-btn').click();

    await expect(page.locator('#entry-action-status')).toContainText('Observation');
    await expect(page.locator('#today-summary')).toContainText('98.6');
  });

  for (const [lang, dir, expected] of [
    ['fr', 'ltr', 'Aujourd’hui'],
    ['en', 'ltr', 'Today'],
    ['es', 'ltr', 'Hoy'],
    ['ar', 'rtl', 'اليوم'],
  ]) {
    test('supports profile language ' + lang, async ({ page }) => {
      await resetApp(page);
      await page.locator('#profil').scrollIntoViewIfNeeded();
      await page.locator('#profile-language').selectOption(lang);
      await page.locator('[data-action="save-profile"]').click();

      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('html')).toHaveAttribute('dir', dir);
      await expect(page.locator('#today-title')).toContainText(expected);
    });
  }

  test('supports keyboard access to a recorded calendar day', async ({ page }) => {
    await resetApp(page);
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#save-entry-btn').click();

    const day = page.locator('#calendar-grid [data-calendar-date]').first();
    await day.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#calendar-detail')).toBeVisible();
    await expect(page.locator('#calendar-detail')).toContainText('36.5');
  });

  test('learning modules open and the module list toggles', async ({ page }) => {
    await resetApp(page);
    const toggle = page.locator('#toggle-modules');
    const list = page.locator('#module-list');

    await expect(list).toBeHidden();
    await toggle.click();
    await expect(list).toBeVisible();
    await expect(list.locator('[data-action="open-lesson"]').first()).toBeVisible();
    await toggle.click();
    await expect(list).toBeHidden();
  });

  test('user-entered HTML is rendered as text, not executed', async ({ page }) => {
    await resetApp(page);
    const marker = '<img src=x onerror="alert(\'xss\')">';
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#f-notes').fill(marker);
    await page.locator('#save-entry-btn').click();
    await expect(page.locator('#table-container')).toContainText(marker);
    await expect(page.locator('#table-container img')).toHaveCount(0);
  });

  test('backup export creates a JSON download after data exists', async ({ page }) => {
    await resetApp(page);
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#save-entry-btn').click();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-data"]').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^SymRella-sauvegarde-\d{4}-\d{2}-\d{2}\.json$/);
  });

  test('exports, clears, and restores a real backup including rich cervical observations through the UI', async ({ page }) => {
    await resetApp(page);
    const date = await page.locator('#f-date').inputValue();
    await page.locator('#f-temp').fill('36.50');
    await page.locator('#f-time').fill('07:00');
    await page.locator('#f-mucus').selectOption('cremeuse');
    await page.locator('#f-mucus-sensation').selectOption('glissante');
    await page.locator('#mucus-appearance input[value="filant"]').check();
    await page.locator('#mucus-appearance input[value="transparent"]').check();
    await page.locator('#f-cervix-position').selectOption('haut');
    await page.locator('#f-cervix-opening').selectOption('entre-ouvert');
    await page.locator('#f-cervix-consistency').selectOption('souple');
    await page.locator('#f-cervix-notes').fill('Observation cervicale de contrôle');
    await page.locator('#save-entry-btn').click();

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-data"]').click();
    const download = await downloadPromise;
    const backupPath = await download.path();
    expect(backupPath).toBeTruthy();

    page.once('dialog', dialog => dialog.accept());
    await page.locator('[data-action="clear-all-data"]').click();
    await expect(page.locator('#today-summary')).not.toContainText('36.50');

    page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles(backupPath);
    await expect(page.locator('#backup-status')).toContainText(/restaur|import/i);
    await expect(page.locator('#today-summary')).toContainText('36.50');
    await expect(page.locator('#calendar-grid [data-calendar-date="' + date + '"]')).toBeVisible();

    await page.locator('[data-action="edit-entry"][data-date="' + date + '"]').click();
    await expect(page.locator('#f-mucus-sensation')).toHaveValue('glissante');
    await expect(page.locator('#mucus-appearance input[value="filant"]')).toBeChecked();
    await expect(page.locator('#mucus-appearance input[value="transparent"]')).toBeChecked();
    await expect(page.locator('#f-cervix-position')).toHaveValue('haut');
    await expect(page.locator('#f-cervix-opening')).toHaveValue('entre-ouvert');
    await expect(page.locator('#f-cervix-consistency')).toHaveValue('souple');
    await expect(page.locator('#f-cervix-notes')).toHaveValue('Observation cervicale de contrôle');
  });

  test('cervical observations remain editable and visible after archiving a cycle', async ({ page }) => {
    await resetApp(page);
    const date = await page.locator('#f-date').inputValue();
    await page.locator('#f-temp').fill('36.40');
    await page.locator('#f-mucus-sensation').selectOption('glissante');
    await page.locator('#mucus-appearance input[value="filant"]').check();
    await page.locator('#f-cervix-position').selectOption('haut');
    await page.locator('#f-cervix-opening').selectOption('ouvert');
    await page.locator('#f-cervix-consistency').selectOption('souple');
    await page.locator('#f-cervix-notes').fill('Col souple observé');
    await page.locator('#save-entry-btn').click();

    await page.locator('[data-action="edit-entry"][data-date="' + date + '"]').click();
    await expect(page.locator('#f-cervix-position')).toHaveValue('haut');
    await expect(page.locator('#f-cervix-opening')).toHaveValue('ouvert');
    await expect(page.locator('#f-cervix-consistency')).toHaveValue('souple');
    await expect(page.locator('#f-cervix-notes')).toHaveValue('Col souple observé');
    await page.locator('#f-cervix-position').selectOption('bas');
    await page.locator('#save-entry-btn').click();

    page.once('dialog', dialog => dialog.accept());
    await page.locator('[data-action="start-new-cycle"]').click();
    const archived = page.locator('#history-container details');
    await expect(archived).toBeVisible();
    await archived.locator('summary').click();
    await expect(archived).toContainText('Position du col : bas');
    await expect(archived).toContainText('Ouverture du col : ouvert');
    await expect(archived).toContainText('Consistance du col : souple');
    await expect(archived).toContainText('Col souple observé');
    await page.reload();
    await expect(page.locator('#history-container details')).toBeVisible();
    await page.locator('#history-container details summary').click();
    await expect(page.locator('#history-container')).toContainText('Position du col : bas');
  });

  test('critical accessibility issues are absent', async ({ page }) => {
    await resetApp(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  test('service worker is available where the test browser supports it', async ({ page, browserName }) => {
    await resetApp(page);
    const result = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return { supported: false, registered: false };
      const registration = await navigator.serviceWorker.getRegistration('./sw.js');
      return { supported: true, registered: Boolean(registration) };
    });
    expect(result.supported).toBeTruthy();
    if (browserName === 'chromium') expect(result.registered).toBeTruthy();
  });
});


test('production GitHub Pages serves and renders all RPS-02 reference images', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('https://couple-et-sexualite.github.io/suivi-symptothermie/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  await page.locator('nav a[href="#apprendre"]').click();
  const compare = page.locator('#rps02-photo-compare');
  await page.locator('#rps02-visual-workshop [data-next="2"]').click();
  await expect(compare).toBeVisible();
  await expect(compare.locator('img')).toHaveCount(9, { timeout: 15000 });

  const images = await compare.locator('img').evaluateAll(items => items.map(img => ({
    src: img.currentSrc || img.src,
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight
  })));

  expect(images).toHaveLength(9);
  expect(images.every(image =>
    image.complete &&
    image.naturalWidth > 0 &&
    image.naturalHeight > 0 &&
    image.src.includes('/data/rps02-blind-assets/RPS02-A')
  )).toBeTruthy();
});


test('imports a legacy-format backup without discarding richer cervical observations for matching dates', async ({ page }) => {
  await resetApp(page);
  const date = await page.locator('#f-date').inputValue();

  await page.locator('#f-temp').fill('36.40');
  await page.locator('#f-mucus-sensation').selectOption('glissante');
  await page.locator('#mucus-appearance input[value="filant"]').check();
  await page.locator('#mucus-appearance input[value="transparent"]').check();
  await page.locator('#f-cervix-position').selectOption('haut');
  await page.locator('#f-cervix-opening').selectOption('ouvert');
  await page.locator('#f-cervix-consistency').selectOption('souple');
  await page.locator('#f-cervix-notes').fill('Donnée cervicale détaillée conservée');
  await page.locator('#save-entry-btn').click();

  // This is the pre-v2 export envelope: it contains only the classic UI fields.
  const legacyBackup = {
    version: 2,
    exportedAt: new Date().toISOString(),
    current: [{
      date,
      temp: 36.55,
      mucus: 'cremeuse',
      notes: 'Note issue de l’ancienne sauvegarde',
      factors: ['sommeil'],
      bleeding: 'aucun',
      time: '06:45'
    }],
    history: [],
    profile: { version: 2, name: '', goal: 'observer', language: 'fr', unit: 'c' },
    learning: { version: 1, completed: {}, lastModule: null }
  };

  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-data').setInputFiles({
    name: 'ancienne-sauvegarde.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(legacyBackup))
  });

  await expect(page.locator('#backup-status')).toContainText(/restaur|import/i);
  await page.locator('[data-action="edit-entry"][data-date="' + date + '"]').click();
  await expect(page.locator('#f-temp')).toHaveValue('36.55');
  await expect(page.locator('#f-notes')).toHaveValue('Note issue de l’ancienne sauvegarde');
  await expect(page.locator('#f-mucus-sensation')).toHaveValue('glissante');
  await expect(page.locator('#mucus-appearance input[value="filant"]')).toBeChecked();
  await expect(page.locator('#mucus-appearance input[value="transparent"]')).toBeChecked();
  await expect(page.locator('#f-cervix-position')).toHaveValue('haut');
  await expect(page.locator('#f-cervix-opening')).toHaveValue('ouvert');
  await expect(page.locator('#f-cervix-consistency')).toHaveValue('souple');
  await expect(page.locator('#f-cervix-notes')).toHaveValue('Donnée cervicale détaillée conservée');

  await page.reload();
  await page.locator('[data-action="edit-entry"][data-date="' + date + '"]').click();
  await expect(page.locator('#f-cervix-notes')).toHaveValue('Donnée cervicale détaillée conservée');
});

test('exports and restores archived cycles with all rich cervical observations', async ({ page }) => {
  await resetApp(page);
  const date = await page.locator('#f-date').inputValue();
  await page.locator('#f-temp').fill('36.45');
  await page.locator('#f-mucus-sensation').selectOption('glissante');
  await page.locator('#mucus-appearance input[value="filant"]').check();
  await page.locator('#mucus-appearance input[value="transparent"]').check();
  await page.locator('#f-cervix-position').selectOption('haut');
  await page.locator('#f-cervix-opening').selectOption('ouvert');
  await page.locator('#f-cervix-consistency').selectOption('souple');
  await page.locator('#f-cervix-notes').fill('Observation archivée à restaurer');
  await page.locator('#save-entry-btn').click();

  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-action="start-new-cycle"]').click();
  await expect(page.locator('#history-container details')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-data"]').click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  expect(backupPath).toBeTruthy();

  page.once('dialog', dialog => dialog.accept());
  await page.locator('[data-action="clear-all-data"]').click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-data').setInputFiles(backupPath);
  await expect(page.locator('#backup-status')).toContainText(/restaur|import/i);

  const archived = page.locator('#history-container details');
  await expect(archived).toBeVisible();
  await archived.locator('summary').click();
  await expect(archived).toContainText('Sensation vulvaire : glissante');
  await expect(archived).toContainText('Aspect de la glaire : filant, transparent');
  await expect(archived).toContainText('Position du col : haut');
  await expect(archived).toContainText('Ouverture du col : ouvert');
  await expect(archived).toContainText('Consistance du col : souple');
  await expect(archived).toContainText('Observation archivée à restaurer');

  await page.reload();
  const restoredArchive = page.locator('#history-container details');
  await expect(restoredArchive).toBeVisible();
  await restoredArchive.locator('summary').click();
  await expect(restoredArchive).toContainText('Observation archivée à restaurer');
});
