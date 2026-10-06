import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const dataDir = path.resolve(root, process.env.BI_DATA_DIR || 'private');
const output = path.join(root, 'dist');
const names = ['data.json', 'finance-data.json'];
for (const name of names) {
  const input = path.join(dataDir, name);
  if (!existsSync(input)) throw new Error(`Base privada ausente: ${name}. Consulte o README.`);
  JSON.parse(readFileSync(input, 'utf8'));
}
mkdirSync(output, { recursive: true });
for (const name of ['index.html','style.css','app.js','finance.js','history.js','cash.js']) {
  cpSync(path.join(root, 'src', name), path.join(output, name));
}
for (const name of names) cpSync(path.join(dataDir, name), path.join(output, name));
writeFileSync(path.join(output, '_headers'), '/*\n  Cache-Control: private, no-store\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Robots-Tag: noindex, nofollow\n');
console.log('Build privado concluído. Publicação exige autenticação em TODOS os arquivos.');
