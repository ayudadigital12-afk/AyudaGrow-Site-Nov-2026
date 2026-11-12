import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const origin='https://ayudagrow.com';
for (const path of ['contact','privacy']) {
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
  assert.match(main.textContent,/A complete privacy notice is being prepared/);
  assert.match(main.textContent,/not a complete privacy notice/);
  assert.match(main.textContent,/Ayuda Grow LLC, registered in Florida, operates AyudaGrow/);
  assert.match(main.textContent,/7901 Fourth Street North, St\. Petersburg, Florida/);
  assert.match(main.textContent,/browser session storage/);
  assert(!main.textContent.includes('hosted preview is protected'));
  assert.match(main.textContent,/effective date have not yet been confirmed/);
  assert.match(main.textContent,/Emails sent to admin@ayudagrow.com go to AyudaGrow’s admin email inbox for the team to handle/);
 }else assert.match(main.textContent,/Get in touch/);
}
const home=readFileSync('dist/index.html','utf8');
assert(home.includes('assets/danielle.webp'));
assert(home.includes('assets/rasheed.webp'));
assert(home.includes('Danielle is an illustrative business persona.'));
assert(readFileSync('dist/plan-data.js','utf8').includes('"price": 149'));
console.log('Contact/privacy checks passed: exact email/telephone links, no submissions/widgets, honest incomplete privacy boundaries, private indexing and latest portraits/pricing retained.');
