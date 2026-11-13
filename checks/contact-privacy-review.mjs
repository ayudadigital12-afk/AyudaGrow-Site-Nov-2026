import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const origin='https://ayudagrow.com';
for (const path of ['contact','privacy','cookies']) {
 const d=new JSDOM(readFileSync(`dist/${path}/index.html`,'utf8'),{url:`${origin}/${path}`}).window.document;
 const main=d.querySelector('main');
 assert.equal(d.querySelectorAll('main h1').length,1);
 assert(main.querySelector('a[href="mailto:admin@ayudagrow.com"]'), path+' email');
 assert(main.querySelector('a[href="tel:+18764800413"]'), path+' phone');
 assert.equal(main.querySelectorAll('form,iframe').length,0);
 assert.equal(d.querySelector('meta[name="robots"]').content,'noindex,nofollow');
 assert.equal(d.querySelector('link[rel="canonical"]').href,origin+'/'+path);
 assert(!main.textContent.includes('Proposed enquiry experience'));
 if(path==='privacy'){
  assert.match(main.textContent,/Ayuda Grow LLC is registered in Florida/);
  assert.match(main.textContent,/7901 Fourth Street North, St\. Petersburg, Florida/);
  assert.match(main.textContent,/Website chat and AI/);
  assert.match(main.textContent,/12 months after the conversation ends/);
  assert.match(main.textContent,/24 months after the last meaningful contact/);
  assert.match(main.textContent,/90 days after closure/);
  assert.match(main.textContent,/We do not deploy Google Analytics 4 or Meta advertising tags/);
  assert(!/not a complete privacy notice|notice is being prepared|staging website|data-processing arrangements/.test(main.textContent));
  assert(main.querySelector('a[href="/cookies"]'));
  assert(main.querySelector('table caption'));
  assert(main.querySelector('th[scope="col"]'));
 }else if(path==='cookies'){
  assert.match(main.textContent,/ayudaVisits:clean-v1/);
  assert.match(main.textContent,/Signup forms and AI chat/);
  assert.match(main.textContent,/Stripe checkout/);
  assert.match(main.textContent,/We do not deploy Google Analytics 4 or Meta advertising tags/);
  assert(main.querySelector('a[href="/privacy"]'));
  assert(!/accept all|cookie preferences saved/i.test(main.textContent));
 }else assert.match(main.textContent,/Get in touch/);
}
const home=readFileSync('dist/index.html','utf8');
assert(home.includes('assets/danielle.webp'));
assert(home.includes('assets/rasheed.webp'));
assert(home.includes('Danielle is an illustrative business persona.'));
assert(readFileSync('dist/plan-data.js','utf8').includes('"price": 149'));
console.log('Contact/privacy checks passed: exact email/telephone links, no native submissions or embedded forms in policy content, approved privacy text and Cookie Policy, private indexing and latest portraits/pricing retained.');

