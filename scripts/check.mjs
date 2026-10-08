import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
for (const name of ['app.js','finance.js','history.js','cash.js']) new vm.Script(readFileSync(path.join(root,'src',name),'utf8'), {filename:name});
const stdout = process.env.BI_TRACKED_FILES ?? (await promisify(execFile)('git',['ls-files','-z'],{cwd:root,encoding:'utf8'})).stdout;
const files = stdout.split(/[\0\r\n]+/).filter(Boolean);
const allowedJson = new Set(['package.json','.openai/hosting.json','published-data/data.json','published-data/finance-data.json']);
const forbidden = /(^|\/)(private|dist|node_modules)\/|(^|\/)\.env($|\.)|\.(png|jpe?g|webp|csv|tsv|xlsx?|pem|key|p12|pfx|tar|zip)$/i;
const secrets = /-----BEGIN .*PRIVATE KEY-----|AIza[\w-]{30,}|gh[pousr]_[\w]{20,}|github_pat_[\w]{20,}|sk-[\w-]{20,}/;
for (const file of files) {
  if (forbidden.test(file) && file!=='.env.example') throw Error(`Arquivo local ou credencial rastreada: ${file}`);
  if (file.endsWith('.json') && !allowedJson.has(file)) throw Error(`JSON não previsto: ${file}`);
  const content = readFileSync(path.join(root,file),'utf8');
  const searchable = file==='scripts/check.mjs' ? content.replace(/^const secrets =.*$/m,'') : content;
  if (secrets.test(searchable)) throw Error(`Possível credencial: ${file}`);
}
const data=JSON.parse(readFileSync(path.join(root,'published-data/data.json'),'utf8'));
const fin=JSON.parse(readFileSync(path.join(root,'published-data/finance-data.json'),'utf8'));
for (const key of ['leads','meta','crm','audit']) if (!Array.isArray(data[key])) throw Error(`Base inválida: ${key}`);
for (const key of ['sales','receipts','participants']) if (!Array.isArray(fin[key])) throw Error(`Base financeira inválida: ${key}`);
const ids=new Set(fin.sales.map(s=>s.id));
if(ids.size!==fin.sales.length) throw Error('IDs de venda duplicados');
for(const row of [...fin.receipts,...fin.participants]) if(!ids.has(row.sale)) throw Error('Recebimento ou participação sem venda');
console.log('Sintaxe, estrutura das bases e vínculos das vendas conferidos.');
