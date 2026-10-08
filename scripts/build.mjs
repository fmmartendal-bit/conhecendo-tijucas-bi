import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const dataDir = path.resolve(root, process.env.BI_DATA_DIR || 'published-data');
const output = path.join(root, 'dist');
for (const name of ['data.json', 'finance-data.json']) {
  const input = path.join(dataDir, name);
  if (!existsSync(input)) throw new Error(`Base ausente: ${name}`);
  JSON.parse(readFileSync(input, 'utf8'));
}
mkdirSync(output, { recursive: true });
for (const name of ['index.html','style.css','app.js','finance.js','history.js','cash.js']) cpSync(path.join(root, 'src', name), path.join(output, name));
for (const name of ['data.json', 'finance-data.json']) cpSync(path.join(dataDir, name), path.join(output, name));
writeFileSync(path.join(output, '.nojekyll'), '');
writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log('Build concluído. Bases preservam a data da última importação.');
