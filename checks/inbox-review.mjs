import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
let selected={},events={},rendered=0;
const context={pages:{},section:(body,cls='')=>`<section class="${cls}">${body}</section>`,visual:()=>'<div>Existing channel demonstration</div>',cardList:a=>a.map(([h,p])=>`<h3>${h}</h3><p>${p}</p>`).join(''),cta:()=>'',wireExpanded:()=>{},render:()=>rendered++};
vm.createContext(context);vm.runInContext(read('dist/inbox-page.js'),context);const html=context.pages.inbox();
assert.equal((html.match(/<h1>/g)||[]).length,1);assert.equal((html.match(/<details>/g)||[]).length,4);assert.equal((html.match(/data-inbox-step=/g)||[]).length,3);assert(html.includes('aria-live="polite"'));assert(html.includes('24/7'));assert(html.includes('Human support hours are agreed separately'));assert(html.includes('fictional'));assert(html.includes('selected plan'));assert(!html.includes('href="#ib-explore"'));
for(let i=0;i<3;i++){const view=context.inboxStoryView(i);assert(view.includes('original channel'));assert(view.includes('ib-owner'));}
for(const path of [...html.matchAll(/src="([^"]+)"/g)].map(m=>m[1]))assert(existsSync(new URL('../dist/'+path,import.meta.url)),path);
const css=read('dist/inbox-page.css');assert(css.includes('@media(max-width:640px)'));assert(css.includes('grid-template-columns:1fr'));assert(css.includes('min-height:48px'));assert(css.includes(':focus-visible'));assert(read('dist/inbox-page.js').includes('prefers-reduced-motion'));assert.equal(rendered,1);
const index=read('dist/index.html');assert(index.indexOf('inbox-page.js')>index.indexOf('expanded.js'));assert(index.includes('inbox-page.css'));
console.log('Inbox checks passed: content, three scenarios, accessible controls, four FAQs, assets, responsive rules, reduced motion, correct script order.');
