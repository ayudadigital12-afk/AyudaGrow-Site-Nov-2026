import {readFileSync,writeFileSync} from 'node:fs';
import {apacheStagingRules} from './apache-rules.mjs';
const manifest=JSON.parse(readFileSync(new URL('../dist/route-manifest.json',import.meta.url)));
const aliases=Object.fromEntries(readFileSync(new URL('../dist/_redirects',import.meta.url),'utf8').trim().split('\n').filter(l=>!l.split(' ')[0].endsWith('/')).map(l=>{const [a,b]=l.split(' ');return [a.slice(1),b.slice(1)];}));
writeFileSync(new URL('../dist/.htaccess',import.meta.url),apacheStagingRules(manifest.pages.map(p=>p.path),aliases));
await import('./build-hostinger-root.mjs');
