import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('dist/app.js'),head=read('dist/index.html');
const names=JSON.parse(app.match(/const pageTitles=(.*);/)[1]);
assert.equal(names.crm,'CRM & Sales Pipeline');
assert.equal(names['platform/crm-sales-pipeline'],names.crm);
assert(head.includes('content="noindex,nofollow"'));
for(const asset of ['brand-growth-ring-acrylic','brand-growth-ring-aluminium','brand-growth-ring-embossed','brand-growth-sweep-acrylic','brand-growth-sweep-aluminium','brand-growth-sweep-embossed']){
 assert(existsSync(new URL('../dist/assets/'+asset+'-optimized.webp',import.meta.url)));
 assert(read('dist/brand-growth.css').includes(asset+'-optimized.webp'));
 assert(!read('dist/brand-growth.css').includes(asset+'.png'));
}
console.log('Technical checks passed: route titles, indexing safeguards and six optimized served brand assets.');
