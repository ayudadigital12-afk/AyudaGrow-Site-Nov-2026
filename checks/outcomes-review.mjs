import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');const source=read('dist/expanded.js');const c={pages:{},pageHead:(a,b,d)=>`<h1>${b}</h1><p>${d}</p>`,section:b=>`<section>${b}</section>`,journeyBar:a=>a.join(' / '),cardList:a=>a.flat().join(' '),cta:()=>''};vm.createContext(c);vm.runInContext(source.slice(source.indexOf('const outcomes='),source.indexOf('// Scan first')),c);const data=vm.runInContext('outcomes',c);assert.equal(data.length,7);const expected={
'convert-more-leads':['lead-capture','ai','inbox','follow-up'],
'improve-sales-follow-up':['follow-up','consultative-sales','automation'],
'manage-sales-opportunities':['crm','reporting'],
'book-more-appointments':['appointments','inbox','follow-up'],
'improve-customer-communication':['inbox','ai','crm'],
'generate-more-reviews':['reputation','appointments','automation'],
'reactivate-customers':['reactivation','automation','inbox']};
let count=0;for(const [slug,targets] of Object.entries(expected)){const h=c.pages['solutions/'+slug]();assert.equal((h.match(/<h1>/g)||[]).length,1);assert.equal((h.match(/class="ag-outcome-example"/g)||[]).length,1);assert(h.includes('not promised results'));for(const target of targets){assert(h.includes(`href="#/${target}"`));count++;}const example=vm.runInContext(`outcomeExamples['${slug}'][1]`,c);assert(example.split(/\s+/).length<=35);}
assert(c.pages['solutions/generate-more-reviews']().includes('additional and agreed separately'));assert(c.pages['solutions/reactivate-customers']().includes('older enquiries and outstanding quotes'));assert(c.pages['solutions/reactivate-customers']().includes('opt-outs'));assert.equal(count,21);
console.log('Outcome checks passed: seven existing routes, 21 intended links, one short illustrative example each, preserved result caveats, review-service scope and reactivation permissions.');
