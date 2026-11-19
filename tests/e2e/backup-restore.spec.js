const { test, expect } = require('@playwright/test');
const fs = require('node:fs/promises');

async function resetApp(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
}

function cervicalObservation(id) {
  return {
    id,
    source: 'rps02',
    observedAt: '2026-11-10T12:00:00.000Z',
    observations: { sensation: 'moist', appearance: 'creamy', transparency: 'opaque', stretch: 'little' },
    visualChoice: 'opaque',
    interpretation: {
      title: 'Observation intermédiaire',
      body: 'Description pédagogique.',
      detail: 'Une observation isolée ne permet pas de conclure.'
    }
  };
}

async function completeRps02(page, sensation, appearance, transparency, stretch) {
  const workshop = page.locator('#rps02-visual-workshop');
  await workshop.locator('[data-group="sensation"] button[data-value="' + sensation + '"]').click();
  await workshop.locator('[data-group="appearance"] button[data-value="' + appearance + '"]').click();
  await workshop.locator('[data-group="transparency"] button[data-value="' + transparency + '"]').click();
  await workshop.locator('[data-group="stretch"] button[data-value="' + stretch + '"]').click();
  await workshop.locator('[data-next="2"]').click();
  await workshop.locator('#rps02-none').click();
  await workshop.locator('#rps02-compare-next').click();
  await workshop.locator('[data-next="4"]').click();
  await workshop.locator('[data-next="5"]').click();
  await expect(workshop.locator('#rps02-save-status')).toContainText('enregistrées localement');
}

async function localDateOffsets(page) {
  return page.evaluate(() => {
    const date = new Date();
    const format = value => [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, '0'),
      String(value.getDate()).padStart(2, '0')
    ].join('-');
    return {
      today: format(date),
      yesterday: format(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))
    };
  });
}

test.describe('SymRella — sauvegarde et restauration cervicales', () => {
  test('real backup round trip preserves cervical records and both cycle stores', async ({ page }) => {
    await resetApp(page);
    const dates = await localDateOffsets(page);

    await page.locator('#f-date').fill(dates.yesterday);
    await page.locator('#f-temp').fill('36.45');
    await page.locator('#f-time').fill('06:30');
    await page.locator('#f-mucus').selectOption('cremeuse');
    await page.locator('#save-entry-btn').click();
    await page.once('dialog', dialog => dialog.accept());
    await page.locator('[data-action="start-new-cycle"]').click();

    await page.locator('#f-date').fill(dates.today);
    await page.locator('#f-temp').fill('36.62');
    await page.locator('#f-time').fill('07:00');
    await page.locator('#f-mucus').selectOption('blanc-oeuf');
    await page.locator('#save-entry-btn').click();

    await completeRps02(page, 'moist', 'creamy', 'opaque', 'little');
    await page.locator('#rps02-restart').click();
    await completeRps02(page, 'lubricative', 'stretchy', 'transparent', 'clear');

    const expected = await page.evaluate(() => ({
      current: JSON.parse(localStorage.getItem('symptothermie_current_cycle')),
      history: JSON.parse(localStorage.getItem('symptothermie_history')),
      cervical: JSON.parse(localStorage.getItem('symrella_cervical_observations_v1'))
    }));
    expect(expected.current).toHaveLength(1);
    expect(expected.history).toHaveLength(1);
    expect(expected.history[0].entries).toHaveLength(1);
    expect(expected.cervical).toHaveLength(2);
    expect(expected.cervical.every(record => !('photo' in record) && !('photoDataUrl' in record))).toBe(true);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('[data-action="export-data"]').click();
    const download = await downloadPromise;
    const backupPath = await download.path();
    const backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
    expect(backup.current).toEqual(expected.current);
    expect(backup.history).toEqual(expected.history);
    expect(backup.cervicalObservations).toEqual(expected.cervical);

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles(backupPath);
    await expect(page.locator('#backup-status')).toContainText(/importée avec succès|imported successfully/i);
    const restored = await page.evaluate(() => ({
      current: JSON.parse(localStorage.getItem('symptothermie_current_cycle')),
      history: JSON.parse(localStorage.getItem('symptothermie_history')),
      cervical: JSON.parse(localStorage.getItem('symrella_cervical_observations_v1'))
    }));
    expect(restored).toEqual(expected);
    await page.locator('#backup-status').evaluate(status => { status.textContent = ''; });
    await expect(page.locator('#backup-status')).toBeEmpty();
    await page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles(backupPath);
    await expect(page.locator('#backup-status')).toContainText(/importée avec succès|imported successfully/i);
    const restoredAgain = await page.evaluate(() => ({
      current: JSON.parse(localStorage.getItem('symptothermie_current_cycle')),
      history: JSON.parse(localStorage.getItem('symptothermie_history')),
      cervical: JSON.parse(localStorage.getItem('symrella_cervical_observations_v1'))
    }));
    expect(restoredAgain).toEqual(expected);
    expect(restoredAgain.cervical.map(record => record.id)).toEqual(expected.cervical.map(record => record.id));
  });

  test('a legacy backup keeps cervical observations and RPS-02 progress already on device', async ({ page }) => {
    await resetApp(page);
    const local = cervicalObservation('local-rps02');
    await page.evaluate(record => {
      localStorage.setItem('symrella_cervical_observations_v1', JSON.stringify([record]));
      localStorage.setItem('symrella_rps02_visual_progress_v2', '1');
    }, local);

    const legacy = {
      version: 2,
      exportedAt: new Date().toISOString(),
      current: [],
      history: []
    };
    await page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles({
      name: 'ancienne-sauvegarde.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(legacy))
    });
    await expect(page.locator('#backup-status')).toContainText(/importée avec succès|imported successfully/i);
    const restored = await page.evaluate(() => ({
      cervical: JSON.parse(localStorage.getItem('symrella_cervical_observations_v1')),
      progress: localStorage.getItem('symrella_rps02_visual_progress_v2')
    }));
    expect(restored.cervical).toEqual([local]);
    expect(restored.progress).toBe('1');
  });

  test('incomplete cervical data is rejected without changing stored values', async ({ page }) => {
    await resetApp(page);
    const local = cervicalObservation('keep-this-record');
    await page.evaluate(record => {
      localStorage.setItem('symptothermie_current_cycle', '[]');
      localStorage.setItem('symptothermie_history', '[]');
      localStorage.setItem('symrella_cervical_observations_v1', JSON.stringify([record]));
    }, local);
    const before = await page.evaluate(() => Object.fromEntries(
      Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
    ));
    const invalid = {
      version: 2,
      exportedAt: new Date().toISOString(),
      current: [],
      history: [],
      cervicalObservations: [{ id: 'incomplete', source: 'rps02' }]
    };
    await page.locator('#import-data').setInputFiles({
      name: 'incomplete.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(invalid))
    });
    await expect(page.locator('#backup-status')).toContainText(/fichier invalide|invalid, incomplete/i);
    const after = await page.evaluate(() => Object.fromEntries(
      Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
    ));
    expect(after).toEqual(before);

    const impossibleDate = {
      version: 2,
      exportedAt: '2026-02-30T12:00:00.000Z',
      current: [],
      history: [],
      cervicalObservations: []
    };
    await page.locator('#import-data').setInputFiles({
      name: 'invalid-date.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(impossibleDate))
    });
    await expect(page.locator('#backup-status')).toContainText(/fichier invalide|invalid, incomplete/i);
    const afterInvalidDate = await page.evaluate(() => Object.fromEntries(
      Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
    ));
    expect(afterInvalidDate).toEqual(before);
  });

  test('a failed restore write rolls every browser storage key back', async ({ page }) => {
    await page.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (window.__symrellaFailOnce && key === window.__symrellaFailKey) {
          window.__symrellaFailOnce = false;
          throw new DOMException('quota', 'QuotaExceededError');
        }
        return original.call(this, key, value);
      };
    });
    await resetApp(page);
    const local = cervicalObservation('restore-rollback');
    await page.evaluate(record => {
      localStorage.setItem('symptothermie_current_cycle', '[]');
      localStorage.setItem('symptothermie_history', '[]');
      localStorage.setItem('symrella_cervical_observations_v1', JSON.stringify([record]));
      window.__symrellaFailKey = 'symptothermie_history';
      window.__symrellaFailOnce = true;
    }, local);
    const before = await page.evaluate(() => Object.fromEntries(
      Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
    ));
    const incoming = {
      version: 2,
      exportedAt: new Date().toISOString(),
      current: [],
      history: [],
      cervicalObservations: [local]
    };
    await page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles({
      name: 'restore.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(incoming))
    });
    await expect(page.locator('#backup-status')).toContainText(/n’a pas été importée|backup was not imported/i);
    const after = await page.evaluate(() => Object.fromEntries(
      Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])
    ));
    expect(after).toEqual(before);
  });

  test('a refused rollback leaves a durable journal and the next startup restores current, history and cervical data', async ({ page }) => {
    await page.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'symptothermie_history' && window.__failHistoryWrite) {
          window.__failHistoryWrite = false;
          throw new DOMException('quota', 'QuotaExceededError');
        }
        if (key === 'symptothermie_current_cycle' && value === window.__oldCurrent && window.__failCurrentRollback) {
          window.__failCurrentRollback = false;
          throw new DOMException('rollback denied', 'QuotaExceededError');
        }
        return original.call(this, key, value);
      };
    });
    await resetApp(page);
    const dates = await localDateOffsets(page);
    const current = [{ date: dates.today, temp: 36.51, mucus: 'cremeuse', notes: 'local current', factors: [], bleeding: 'aucun', time: '06:30' }];
    const history = [{ start: dates.yesterday, end: dates.yesterday, entries: [{ date: dates.yesterday, temp: 36.4, mucus: 'sec', notes: 'local archived', factors: [], bleeding: 'regles', time: '06:20' }] }];
    const cervical = [cervicalObservation('rollback-preserve-cervical')];
    await page.evaluate(({ currentValue, historyValue, cervicalValue }) => {
      localStorage.setItem('symptothermie_current_cycle', JSON.stringify(currentValue));
      localStorage.setItem('symptothermie_history', JSON.stringify(historyValue));
      localStorage.setItem('symrella_cervical_observations_v1', JSON.stringify(cervicalValue));
      window.__oldCurrent = JSON.stringify(currentValue);
      window.__failHistoryWrite = true;
      window.__failCurrentRollback = true;
    }, { currentValue: current, historyValue: history, cervicalValue: cervical });
    const before = await page.evaluate(() => ({
      current: localStorage.getItem('symptothermie_current_cycle'),
      history: localStorage.getItem('symptothermie_history'),
      cervical: localStorage.getItem('symrella_cervical_observations_v1')
    }));
    const incoming = { version: 2, exportedAt: new Date().toISOString(), current: [], history: [], cervicalObservations: cervical };
    await page.once('dialog', dialog => dialog.accept());
    await page.locator('#import-data').setInputFiles({
      name: 'failed-restore.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(incoming))
    });
    await expect(page.locator('#backup-status')).toContainText(/restauration a échoué/i);
    expect(await page.evaluate(() => localStorage.getItem('symrella_restore_recovery_v1'))).not.toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('symptothermie_current_cycle'))).toBe('[]');

    await page.reload();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('symrella_restore_recovery_v1'))).toBeNull();
    const restored = await page.evaluate(() => ({
      current: localStorage.getItem('symptothermie_current_cycle'),
      history: localStorage.getItem('symptothermie_history'),
      cervical: localStorage.getItem('symrella_cervical_observations_v1')
    }));
    expect(restored).toEqual(before);
  });

  test('startup recovery failure keeps the journal, blocks writes and displays a clear warning', async ({ page }) => {
    await page.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (sessionStorage.getItem('__symrellaBlockRecovery') === '1' && key === 'symptothermie_current_cycle') {
          throw new DOMException('storage unavailable', 'QuotaExceededError');
        }
        return original.call(this, key, value);
      };
    });
    await resetApp(page);
    const dates = await localDateOffsets(page);
    const current = [{ date: dates.today, temp: 36.51, mucus: 'cremeuse', notes: 'must survive', factors: [], bleeding: 'aucun', time: '06:30' }];
    const history = [{ start: dates.yesterday, end: dates.yesterday, entries: [{ date: dates.yesterday, temp: 36.4, mucus: 'sec', notes: 'archived', factors: [], bleeding: 'regles', time: '06:20' }] }];
    const cervical = [cervicalObservation('startup-recovery-cervical')];
    await page.evaluate(({ currentValue, historyValue, cervicalValue }) => {
      const previous = {
        symptothermie_current_cycle: JSON.stringify(currentValue),
        symptothermie_history: JSON.stringify(historyValue),
        symrella_cervical_observations_v1: JSON.stringify(cervicalValue)
      };
      localStorage.setItem('symptothermie_current_cycle', '[]');
      localStorage.setItem('symptothermie_history', JSON.stringify(historyValue));
      localStorage.setItem('symrella_cervical_observations_v1', JSON.stringify(cervicalValue));
      localStorage.setItem('symrella_restore_recovery_v1', JSON.stringify({ version: 1, state: 'pending', previous }));
      sessionStorage.setItem('__symrellaBlockRecovery', '1');
    }, { currentValue: current, historyValue: history, cervicalValue: cervical });
    await page.reload();
    await expect(page.locator('#storage-status')).toContainText(/récupération automatique a échoué/i);
    const pending = await page.evaluate(() => ({
      current: localStorage.getItem('symptothermie_current_cycle'),
      history: localStorage.getItem('symptothermie_history'),
      cervical: localStorage.getItem('symrella_cervical_observations_v1'),
      journal: localStorage.getItem('symrella_restore_recovery_v1')
    }));
    expect(pending.current).toBe('[]');
    expect(pending.history).toBe(JSON.stringify(history));
    expect(pending.cervical).toBe(JSON.stringify(cervical));
    expect(pending.journal).not.toBeNull();
    await page.locator('#f-temp').fill('36.7');
    await page.locator('#save-entry-btn').click();
    await expect(page.locator('#action-status')).toContainText(/restauration interrompue/i);
    expect(await page.evaluate(() => localStorage.getItem('symptothermie_current_cycle'))).toBe('[]');

    await page.evaluate(() => sessionStorage.removeItem('__symrellaBlockRecovery'));
    await page.reload();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('symrella_restore_recovery_v1'))).toBeNull();
    const restored = await page.evaluate(() => ({
      current: JSON.parse(localStorage.getItem('symptothermie_current_cycle')),
      history: JSON.parse(localStorage.getItem('symptothermie_history')),
      cervical: JSON.parse(localStorage.getItem('symrella_cervical_observations_v1'))
    }));
    expect(restored).toEqual({ current, history, cervical });
  });
});
