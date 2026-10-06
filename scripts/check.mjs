import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
for(const name of ['app.js','finance.js','history.js','cash.js']) new vm.Script(readFileSync(path.join(root,'src',name),'utf8'),{filename:name});
const stdout=process.env.BI_TRACKED_FILES ?? (await promisify(execFile)('git',['ls-files','-z'],{cwd:root,encoding:'utf8'})).stdout;
const files=stdout.split(/[\0\r\n]+/).filter(Boolean);
const forbidden=/(^|\/)(private|dist|node_modules)\/|(^|\/)\.env($|\.)|\.(png|jpe?g|webp|csv|tsv|xlsx?|pem|key|p12|pfx|tar|zip)$/i;
const secrets=/-----BEGIN .*PRIVATE KEY-----|AIza[\w-]{30,}|gh[pousr]_[\w]{20,}|github_pat_[\w]{20,}|sk-[\w-]{20,}|docs\.google\.com\/spreadsheets\/d\//;
for(const file of files){
  if(forbidden.test(file)&&file!=='.env.example') throw Error(`Arquivo privado rastreado: ${file}`);
  if(file.endsWith('.json')&&!['package.json','.openai/hosting.json'].includes(file)) throw Error(`Base rastreada: ${file}`);
  const content=readFileSync(path.join(root,file),'utf8');
  const searchable=file==='scripts/check.mjs'?content.replace(/^const secrets=.*$/m,''):content;
  if(secrets.test(searchable)) throw Error(`Possível segredo ou vínculo privado: ${file}`);
}
console.log('Sintaxe e arquivos rastreados verificados; nenhuma base privada no Git.');
