import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from '../scripts/render-page.mjs';
const forms={essentials:'CkmLMXN55hD2X9hCfO4j',core:'65wBICRDMlJ7RTZPK3dG',build:'XidHogjcgDQ48zVVZKSz',scale:'abrMomyu1JJgrxPvWYLh'};
const prices=[99,149,249,349];
for(const [i,[plan,id]] of Object.entries(forms).entries()){
 const html=readFileSync(`dist/signup/${plan}/index.html`,'utf8');
 const dom=new JSDOM(html,{url:`https://ayudagrow.com/signup/${plan}`}),d=dom.window.document;
 assert.equal(d.querySelectorAll('main h1').length,1);assert.match(d.querySelector('h1').textContent,new RegExp(plan,'i'));
 assert.equal(d.querySelector('.ag-purchase-price strong').textContent,'US$'+prices[i]);
 assert.equal(d.querySelectorAll('iframe').length,1);const f=d.querySelector('iframe');
 assert.equal(f.src,'https://grow.ayudagrow.com/widget/form/'+id);assert.equal(f.dataset.formId,id);assert.equal(f.id,'inline-'+id);assert(f.title);assert.equal(f.dataset.triggerType,'alwaysShow');
 assert.equal(d.querySelectorAll('script[src="https://grow.ayudagrow.com/js/form_embed.js"]').length,1);
 assert.equal(d.querySelectorAll('form,input').length,0,'The supplied form owns all data submission');
 assert.equal(d.querySelector('meta[name="robots"]').content,'noindex,nofollow');assert(d.querySelector('header a[href="/pricing"]'));assert(d.querySelector('footer a[href="/privacy"]'));
 assert.equal(d.querySelectorAll('a[href*="buy.stripe.com"]').length,0,'No checkout link may bypass contact submission');
 assert.equal(d.querySelector('.ag-purchase-help a').href,f.src);
 assert.match(d.querySelector('.ag-purchase-email-note').textContent,/same email/);
 assert.equal(!!d.querySelector('.ag-purchase-trial'),plan==='essentials');assert.equal(!!d.querySelector('.ag-purchase-popular'),plan==='build');
 assert(!/500 AI responses|2,500 AI|5,000 AI|Unlimited everything|SLA support|Priority support/.test(d.querySelector('main').textContent));
 dom.window.close();
 const live=renderPage(html,'https://staging2.ayudagrow.com','/signup/'+plan,{navigation:true});assert.equal(live.window.document.querySelectorAll('iframe').length,1);assert.equal(live.window.document.querySelector('iframe').dataset.formId,id);live.window.close();
}
console.log('PASS: four plan routes, approved prices and matrix, exact supplied form mapping, one loader each, accessible fallback, privacy and navigation, no card fields, no bypass checkout links.');
