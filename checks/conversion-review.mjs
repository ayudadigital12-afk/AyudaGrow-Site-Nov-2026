import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from '../scripts/render-page.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),shell=read('source/shell.html');
const manifest=JSON.parse(read('dist/route-manifest.json'));
for(const {path} of manifest.pages){const d=new JSDOM(read('dist/'+(path==='/'?'index.html':path.slice(1)+'/index.html'))).window.document;
 assert(d.querySelector('header nav a[href="/pricing"]'),'Pricing navigation on '+path);
 assert.equal(d.querySelector('meta[name="robots"]').content,'noindex,nofollow');
 assert.equal(d.querySelectorAll('main h1').length,1);
 assert(d.querySelector('script[data-widget-id="6adbe6959f0ad5b6ad0a7a22"]'));
 for(const img of d.querySelectorAll('main img[src]'))assert(existsSync(new URL('../dist/'+img.getAttribute('src').replace(/^\//,''),import.meta.url)),img.src);
}
const home=renderPage(shell,'https://staging2.ayudagrow.com','/'),d=home.window.document,w=home.window;
assert.match(d.querySelector('h1').textContent,/Stop leaving money on the table/);
assert.equal(d.querySelectorAll('.ag-sales-hero .ag-dimension-icon').length,11);
assert.equal(d.querySelectorAll('.ag-piece-robot').length,1);
const expected=['hero','ag-problem-section','ag-who','gp-growth-section','ai-home','inbox-home','ag-home-apps','ag-start-strip','ag-home-close'];
assert.deepEqual([...d.querySelectorAll('main>section')].map((s,i)=>s.classList.contains(expected[i])),expected.map(()=>true));
for(const b of d.querySelectorAll('[data-ag-piece]')){b.dispatchEvent(new w.Event('pointerover',{bubbles:true}));assert.equal(d.querySelector('[data-ag-context-title]').textContent,b.querySelector('strong').textContent);b.click();assert.equal(b.getAttribute('aria-pressed'),'true');}
for(const i of [0,1,2]){const b=d.querySelector('[data-problem="'+i+'"]');b.click();assert.equal(b.getAttribute('aria-selected'),'true');assert.equal(d.querySelector('#ag-problem-panel').getAttribute('aria-labelledby'),b.id);}
d.querySelector('[data-problem="0"]').focus();d.activeElement.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(d.activeElement.dataset.problem,'1');
for(const b of d.querySelectorAll('[data-growth-stage]')){b.click();assert.equal(b.getAttribute('aria-pressed'),'true');}
assert.equal(d.querySelectorAll('.ch-app-card:not([aria-hidden="true"])').length,34);
assert.equal(d.querySelector('#motion'),null);home.window.close();
const pricing=new JSDOM(read('dist/pricing/index.html')).window.document;
assert.match(pricing.title,/US\$99/);assert.match(pricing.querySelector('meta[name="description"]').content,/US\$99/);
assert(!/GoHighLevel|HighLevel|LeadConnector|supplier cost|14-day|21-day/.test(pricing.querySelector('main').textContent));
assert.equal(pricing.querySelectorAll('form,input,iframe').length,0);
console.log('PASS: 37 noindex routes with Pricing navigation and chatbot; homepage interactions and retained sections; current pricing metadata and no supplier disclosures.');
