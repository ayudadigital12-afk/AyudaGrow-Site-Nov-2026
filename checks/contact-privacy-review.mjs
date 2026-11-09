import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const origin='https://ayudagrow.com';
for (const path of ['contact','get-started','privacy']) {
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
  assert.match(main.textContent,/Draft for review/);
  assert.match(main.textContent,/not an effective production privacy notice/);
  assert.match(main.textContent,/Ayuda Grow LLC, registered in Florida, operates AyudaGrow/);
  assert.match(main.textContent,/7901 Fourth Street North, St\. Petersburg, Florida/);
  assert.match(main.textContent,/Confirm the designated privacy contact/);
  assert.match(main.textContent,/Emails sent to admin@ayudagrow.com go to AyudaGrow’s admin email inbox for the team to handle/);
 }else assert.match(main.textContent,/Get in touch/);
}
const home=readFileSync('dist/index.html','utf8');
assert(home.includes('aisha-portrait-natural.webp'));
assert(home.includes('marcus-portrait-natural.webp'));
assert(readFileSync('dist/pricing-page.js','utf8').includes('US$149'));
console.log('Contact/privacy checks passed: exact email/telephone links, no submissions/widgets, draft privacy boundaries, private indexing and latest portraits/pricing retained.');
