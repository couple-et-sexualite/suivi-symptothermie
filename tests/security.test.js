const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const manifest = fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const source = page + '\n' + app;

test('application JavaScript is external and protected by same-origin CSP', () => {
  assert.ok(page.includes('<script src="./app.js"></script>'));
  assert.ok(!/<script(?![^>]*src=)[^>]*>/i.test(page));
  assert.ok(page.includes('Content-Security-Policy'));
  assert.ok(page.includes("script-src 'self'"));
  assert.ok(page.includes("object-src 'none'"));
});

test('dangerous script execution primitives are absent', () => {
  assert.ok(!app.includes('eval('));
  assert.ok(!app.includes('document.write('));
  assert.ok(!app.includes('new Function('));
});

test('user-controlled HTML is escaped before HTML insertion', () => {
  assert.ok(app.includes('function escapeHtml(value)'));
  assert.ok(app.includes('escapeHtml(e.notes)'));
  assert.ok(app.includes('escapeHtml(e.time)'));
  assert.ok(app.includes('e.factors.map(f => escapeHtml'));
});

test('backup import is bounded, versioned and validated', () => {
  assert.ok(source.includes('function validBackup(value)'));
  assert.ok(source.includes('value.version!==APP_DATA_VERSION'));
  assert.ok(source.includes('validEntryCollection(value.current)'));
  assert.ok(source.includes('value.history.every(validStoredHistoryCycle)'));
  assert.ok(source.includes('file.size>2*1024*1024'));
  assert.ok(source.includes('JSON.parse(reader.result)'));
  assert.ok(source.includes('e.notes.length<=2000'));
});

test('stored observations are validated with allowlists and bounds', () => {
  assert.ok(source.includes('function validStoredEntry(e)'));
  assert.ok(source.includes('isValidDateKey(e.date)'));
  assert.ok(source.includes('validStoredTemperature(e.temp)'));
  assert.ok(source.includes('VALID_MUCUS.includes(e.mucus)'));
  assert.ok(source.includes('validStoredTime(e.time)'));
  assert.ok(source.includes('const MAX_ENTRIES_PER_CYCLE = 3700'));
  assert.ok(source.includes('const MAX_HISTORY_CYCLES = 200'));
});

test('inline event handlers are absent and delegated actions are used', () => {
  assert.ok(!/\bon(?:click|change|keydown|submit|input|focus|blur)=/i.test(page));
  assert.ok(source.includes('data-action="open-lesson"'));
  assert.ok(source.includes('data-action="answer-quiz"'));
  assert.ok(source.includes("event.target.closest('[data-calendar-date]')"));
});

test('privacy-sensitive network APIs are not used by the local-first app', () => {
  assert.ok(!app.includes('fetch('));
  assert.ok(!app.includes('sendBeacon('));
  assert.ok(!app.includes('XMLHttpRequest'));
  assert.ok(!app.includes('Authorization'));
});

test('PWA shell and service worker use an explicit allowlist', () => {
  const data = JSON.parse(manifest);
  assert.equal(data.start_url, './');
  assert.equal(data.scope, './');
  assert.equal(data.display, 'standalone');
  assert.ok(source.includes('navigator.serviceWorker.register("./sw.js")'));
  assert.ok(serviceWorker.includes("const CACHE_NAME = 'symptothermie-shell-v5'"));
  assert.ok(serviceWorker.includes('const CACHEABLE_PATHS'));
  assert.ok(serviceWorker.includes('./app.js'));
  assert.ok(serviceWorker.includes('./icons/icon.svg'));
});

test('destructive data operations require explicit confirmation', () => {
  assert.ok(source.includes('function clearAllData()'));
  assert.ok(source.includes('if(!confirm('));
});

test('security documentation pages are linked', () => {
  assert.ok(page.includes('privacy.html'));
  assert.ok(page.includes('terms.html'));
});

test('static informational pages also declare restrictive CSP', () => {
  for (const file of ['symrella.html', 'privacy.html', 'terms.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(html.includes('Content-Security-Policy'));
    assert.ok(html.includes("script-src 'none'"));
    assert.ok(html.includes("object-src 'none'"));
  }
});
