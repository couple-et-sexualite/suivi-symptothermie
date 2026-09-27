const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');

if (!/<script\s+src=["']\.\/app\.js["']><\/script>/i.test(html)) {
  throw new Error('Le shell HTML doit charger app.js comme script externe.');
}
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) {
  throw new Error('Aucun bloc JavaScript inline n\'est autorisé dans index.html.');
}
new vm.Script(app, { filename: 'app.js' });
console.log('OK : app.js est syntaxiquement valide et le shell ne contient aucun JavaScript inline.');