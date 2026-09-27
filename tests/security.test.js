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
  assert.match(page, /<script src="./app\\.js"><\\/script>/);
  assert.doesNotMatch(page, /<script(?![^>]*src=)[^>]*>/i);
  assert.match(page, /Content-Security-Policy/);
  assert.match(page, /script-src 'self'/);
  assert.match(page, /object-src 'none'/);
});

test('dangerous script execution primitives are absent', () => {
  assert.doesNotMatch(app, /\\beval\\s*\\(/);
  assert.doesNotMatch(app, /document\\.write\\s*\\(/);
  assert.doesNotMatch(app, /new Function\\s*\\(/);
});

test('user-controlled HTML is escaped before HTML insertion', () => {
  assert.match(app, /function escapeHtml\\(value\\)/);
  assert.match(app, /escapeHtml\\(e\\.notes\\)/);
  assert.match(app, /escapeHtml\\(e\\.time\\)/);
  assert.match(app, /e\\.factors\\.map\\(f => escapeHtml/);
});

test('backup import is bounded, versioned and validated', () => {
  assert.match(source, /function validBackup\\(value\\)/);
  assert.match(source, /value\\.version!==APP_DATA_VERSION/);
  assert.match(source, /validEntryCollection\\(value\\.current\\)/);
  assert.match(source, /value\\.history\\.every\\(validStoredHistoryCycle\\)/);
  assert.match(source, /file\\.size>2\\*1024\\*1024/);
  assert.match(source, /JSON\\.parse\\(reader\\.result\\)/);
  assert.match(source, /e\\.notes\\.length<=2000/);
});

test('stored observations are validated with allowlists and bounds', () => {
  assert.match(source, /function validStoredEntry\\(e\\)/);
  assert.match(source, /isValidDateKey\\(e\\.date\\)/);
  assert.match(source, /validStoredTemperature\\(e\\.temp\\)/);
  assert.match(source, /VALID_MUCUS\\.includes\\(e\\.mucus\\)/);
  assert.match(source, /validStoredTime\\(e\\.time\\)/);
  assert.match(source, /const MAX_ENTRIES_PER_CYCLE = 3700/);
  assert.match(source, /const MAX_HISTORY_CYCLES = 200/);
});

test('inline event handlers are absent and delegated actions are used', () => {
  assert.doesNotMatch(page, /\\bon(?:click|change|keydown|submit|input|focus|blur)=/i);
  assert.match(source, /data-action="open-lesson"/);
  assert.match(source, /data-action="answer-quiz"/);
  assert.match(source, /event\\.target\\.closest\\('\[data-calendar-date\]'\\)/);
});

test('privacy-sensitive network APIs are not used by the local-first app', () => {
  assert.doesNotMatch(app, /\\bfetch\\s*\\(/);
  assert.doesNotMatch(app, /\\bsendBeacon\\s*\\(/);
  assert.doesNotMatch(app, /XMLHttpRequest/);
  assert.doesNotMatch(app, /Authorization/);
});

test('PWA shell and service worker use an explicit allowlist', () => {
  const data = JSON.parse(manifest);
  assert.equal(data.start_url, './');
  assert.equal(data.scope, './');
  assert.equal(data.display, 'standalone');
  assert.match(page, /navigator\\.serviceWorker\\.register\\("\\.\\/sw\\.js"\\)/);
  assert.match(serviceWorker, /const CACHE_NAME = 'symptothermie-shell-v5'/);
  assert.match(serviceWorker, /const CACHEABLE_PATHS/);
  assert.match(serviceWorker, /\\.\\/app\\.js/);
  assert.match(serviceWorker, /\\.\\/icons\\/icon\\.svg/);
});

test('destructive data operations require explicit confirmation', () => {
  assert.match(source, /function clearAllData\\(\\)/);
  assert.match(source, /if\\(!confirm\\(/);
});

test('security documentation pages are linked', () => {
  assert.match(page, /privacy\\.html/);
  assert.match(page, /terms\\.html/);
});

test('static informational pages also declare restrictive CSP', () => {
  for (const file of ['symrella.html', 'privacy.html', 'terms.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(html, /Content-Security-Policy/);
    assert.match(html, /script-src 'none'/);
    assert.match(html, /object-src 'none'/);
  }
});
