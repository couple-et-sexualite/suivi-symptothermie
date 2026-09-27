const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const manifest = fs.readFileSync(path.join(__dirname, '..', 'manifest.webmanifest'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');
const source = page + '\n' + app;

test('user-controlled text is escaped before being inserted into HTML', () => {
  assert.match(app, /function escapeHtml\(value\)\s*\{/);
  assert.match(app, /escapeHtml\\(e\\.notes\\)/);
  assert.match(app, /e\.factors\.map\(f => escapeHtml/);
  assert.match(app, /escapeHtml\\(e\\.time\\)/);
});

test('backup import is versioned, validated and size-limited', () => {
  assert.match(source, /function validBackup\(value\)/);
  assert.match(source, /value\.version!==APP_DATA_VERSION/);
  assert.match(source, /validEntryCollection\(value\.current\)/);
  assert.match(source, /value\.history\.every\(validStoredHistoryCycle\)/);
  assert.match(source, /file\.size>2\*1024\*1024/);
  assert.match(source, /JSON\.parse\(reader\.result\)/);
});

test('stored observations validate dates, temperatures, mucus and time', () => {
  assert.match(source, /function validStoredEntry\(e\)/);
  assert.match(source, /isValidDateKey\(e\.date\)/);
  assert.match(source, /validStoredTemperature\(e\.temp\)/);
  assert.match(source, /VALID_MUCUS\.includes\(e\.mucus\)/);
  assert.match(source, /validStoredTime\(e\.time\)/);
});

test('dangerous script execution primitives are absent', () => {
  assert.doesNotMatch(app, /(\beval\s*\(/);
  assert.doesNotMatch(app, /(document\.write\s*\(/);
  assert.doesNotMatch(app, /(new Function\s*\(/);
});

test('calendar weekday headings are localized', () => {
  assert.match(source, /const weekdays=getLanguage\(\)==='en'\?\['Mon','Tue','Wed','Thu','Fri','Sat','Sun'\]:getLanguage\(\)==='ar'\?/);
});
test('dynamic localized action messages are present', () => {
  assert.match(source, /const ACTION_TEXTS=/);
  assert.match(source, /function at\(key\)/);
  assert.match(source, /mucus:\{sec:/);
});
test('the main interface keeps localized controls including the temperature help link', () => {
  assert.match(source, /id="today-add-btn"/);
  assert.match(source, /id="temp-label-text"/);
  assert.match(source, /id="temp-help-link"/);
  assert.match(source, /todayAdd:/);
  assert.match(source, /tempLink:/);
  assert.match(source, /chartDescription:/);
  assert.match(source, /calendarTitle:/);
});
test('the profile explains automatic detection and manual language choice', () => {
  assert.match(source, /id="language-help"/);
  assert.match(source, /La langue est détectée automatiquement/);
  assert.match(source, /Your language is detected automatically/);
  assert.match(source, /El idioma se detecta automáticamente/);
  assert.match(source, /يتم اكتشاف اللغة تلقائيًا/);
});
test('the first launch detects a supported browser language and keeps an explicit profile choice', () => {
  assert.match(source, /function detectBrowserLanguage\(\)/);
  assert.match(source, /navigator\.languages/);
  assert.match(source, /if\(code==='fr'\|\|code==='en'\|\|code==='es'\|\|code==='ar'\)return code/);
  assert.match(source, /language:detectBrowserLanguage\(\)/);
  assert.match(source, /language:v\.language/);
});
test('supported languages localize the main observation controls', () => {
  assert.match(source, /Nombre para mostrar \(opcional\)/);
  assert.match(source, /اسم العرض \(اختياري\)/);
  assert.match(source, /const labels=\{/);
  assert.match(source, /Pegajoso/);
  assert.match(source, /لزج/);
  assert.match(source, /document\.querySelectorAll\('#f-bleeding option'\)/);
});
test('saving profile applies language/unit immediately', () => {
  assert.match(source, /memProfile=p;try\{localStorage\.setItem\(PROFILE_KEY,JSON\.stringify\(p\)\)/);
  assert.match(source, /applyLanguage\(\);renderProfile\(\);render\(\);document\.getElementById\('profile-status'\)\?\.focus\(\)/);
});
test('calendar month title follows selected language', () => {
  assert.match(source, /toLocaleDateString\(getLanguage\(\)==='ar'\?'ar':getLanguage\(\)==='es'\?'es':'fr'/);
});

test('temperature validation warning uses the selected display unit', () => {
  assert.match(source, /at\('unusualConfirm'\)/);
});

test('Bluetooth thermometer readings use the selected display unit', () => {
  assert.match(source, /function handleThermometerMeasurement\(event\)/);
  assert.match(source, /field\.value = celsiusToDisplay\(value\)\.toFixed\(2\)/);
  assert.match(source, /bt\('received'/);
});

test('destructive data actions require explicit confirmation', () => {
  assert.match(source, /function clearAllData\(\)/);
  assert.match(source, /function clearAllData\(\)[\s\S]*?if\(!confirm\(/);
});

test('calendar interactions use delegated events instead of inline handlers', () => {
  assert.match(source, /data-calendar-date=/);
  assert.match(source, /event\.target\.closest\('\[data-calendar-date\]'\)/);
  assert.doesNotMatch(source, /onclick="showCalendarDetail/);
  assert.doesNotMatch(source, /onkeydown="if\(event\.key===/);
});


test('all user interactions are wired without inline event attributes', () => {
  assert.doesNotMatch(source, /\bon(?:click|change|keydown|submit|input|focus|blur)=/i);
  assert.match(source, /data-action="open-lesson"/);
  assert.match(source, /data-action="answer-quiz"/);
  assert.match(source, /data-action="complete-lesson"/);
  assert.match(source, /data-action="calendar-prev"/);
  assert.match(source, /data-action="calendar-next"/);
  assert.match(source, /getElementById\('import-data'\)\?\.addEventListener\('change', importData\)/);
  assert.match(source, /action === 'answer-quiz'/);
  assert.match(source, /action === 'complete-lesson'/);
});


test('cycle archiving and full deletion roll back persistent storage on failure', () => {
  assert.match(source, /function startNewCycle\(\)[\s\S]*localStorage\.setItem\(HISTORY_KEY/);
  assert.match(source, /function startNewCycle\(\)[\s\S]*localStorage\.setItem\(CURRENT_KEY/);
  assert.match(source, /function startNewCycle\(\)[\s\S]*rollbackError/);
  assert.match(source, /function clearAllData\(\)[\s\S]*previous\[key\]/);
  assert.match(source, /function clearAllData\(\)[\s\S]*at\('storageSession'\)/);
});


test('PWA shell is declared and service worker is registered safely', () => {
  assert.match(source, /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
  assert.match(source, /navigator\.serviceWorker\.register\("\.\/sw\.js"\)/);
});


test('PWA files are structurally valid', () => {
  const data = JSON.parse(manifest);
  assert.equal(data.start_url, './');
  assert.equal(data.scope, './');
  assert.equal(data.display, 'standalone');
  assert.match(serviceWorker, /const CACHE_NAME = 'symptothermie-shell-v5'/);
  assert.match(serviceWorker, /self\.addEventListener\('install'/);
  assert.match(serviceWorker, /self\.addEventListener\('fetch'/);
});

test('les leçons et quiz rejettent les identifiants ou choix invalides', () => {
  assert.match(source, /function answerQuiz\(id, choice\) \{ const module = localizedModules\(\)\.find\(item => item\.id === id\);/);
  assert.match(source, /Number\.isInteger\(choice\)/);
  assert.match(source, /if \(!MODULES\.some\(module => module\.id === id\)\) return/);
});

test('les notes et facteurs importés restent bornés et validés', () => {
  assert.match(source, /e\.notes\.length<=2000/);
  assert.match(source, /e\.factors\.length<=VALID_FACTORS\.length/);
  assert.match(source, /id="f-notes" maxlength="2000"/);
});


test('stored entry collections reject duplicate dates and excessive history size', () => {
  assert.match(source, /const MAX_ENTRIES_PER_CYCLE = 3700/);
  assert.match(source, /const MAX_HISTORY_CYCLES = 200/);
  assert.match(source, /function validEntryCollection\(entries\)/);
  assert.match(source, /const dates=new Set\(\)/);
  assert.match(source, /dates\.has\(entry\.date\)/);
  assert.match(source, /entries\.length>MAX_ENTRIES_PER_CYCLE/);
  assert.match(source, /value\.history\.length>MAX_HISTORY_CYCLES/);
});
test('editing an observation respects the selected Fahrenheit display unit', () => {
  assert.match(source, /document\.getElementById\('f-temp'\)\.value = entry\.temp === null \? '' : celsiusToDisplay\(entry\.temp\)\.toFixed\(2\)/);
  assert.match(source, /function displayToCelsius\(value\)/);
});


test('PWA declares an installable icon and caches it', () => {
  assert.match(manifest, /icons/);
  assert.match(manifest, /\.\/icons\/icon\.svg/);
  assert.match(serviceWorker, /\.\/app\.js/);\n  assert.match(serviceWorker, /\.\/icons\/icon\.svg/);
});

test('privacy and terms documentation are linked and local-first claims remain explicit', () => {
  assert.match(source, /href="PRIVACY\.md"/);
  assert.match(source, /href="TERMS\.md"/);
  assert.match(source, /<meta http-equiv="Content-Security-Policy" content="[^"]*script-src 'self'/i);\n  assert.match(source, /<script src="\\.\\/app\\.js"><\\/script>/i);\n  assert.doesNotMatch(source, /<script(?![^>]*src=)[^>]*>/i);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /\bsendBeacon\s*\(/);
});
