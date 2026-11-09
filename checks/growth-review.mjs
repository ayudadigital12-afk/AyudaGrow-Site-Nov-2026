import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const source=read('dist/growth-pages.js');
const untouched=()=>'<h1>Parked</h1>';
const c={pages:{home:()=>'<h1>Home</h1><section class="ag-who"></section>',platform:()=>'<section><h1>Platform</h1></section>', 'consultative-sales':()=>'<h1>Consultative</h1><section class="cta"></section>',pricing:untouched,'get-started':untouched,ai:untouched},window:{AyudaHomepage:{whoServe:()=>''}},pageHead:(a,b,d)=>`<h1>${b}</h1><p>${d}</p>`,section:(h,cls='')=>`<section class="${cls}">${h}</section>`,linkCards:a=>a.map(x=>`<a href="#/${x[0]}">${x[1]}</a>`).join(''),cardList:a=>a.flat().join(' '),journeyBar:a=>a.join(' '),demo:()=>'<div>Demo</div>',cta:()=>'<section class="cta"></section>',reputationBridge:()=>'<a href="#/reputation">Reputation</a>',wireExpanded:()=>{},render:()=>{}};
vm.createContext(c);vm.runInContext(source,c);
for(const slug of ['home','platform','crm','appointments','use-cases','consultative-sales'])assert.equal((c.pages[slug]().match(/<h1>/g)||[]).length,1,slug);
assert(c.pages.home().indexOf('gp-growth-section')<c.pages.home().indexOf('ag-who'));
assert.equal((c.pages.platform().match(/data-growth-stage=/g)||[]).length,5);
assert(c.pages.crm().includes('Coach'));
assert(c.pages.crm().includes('expected'));
assert.equal((c.pages.crm().match(/data-crm-role=/g)||[]).length,3);
for(let i=0;i<3;i++){const h=vm.runInContext(`appointmentMoment(${i})`,c);assert(h.includes('AI-assisted enquiry'));assert(h.includes('Human-assisted enquiry'));assert(h.includes('ONE SHARED CALENDAR VIEW'));}
assert(c.pages.appointments().includes('simultaneous booking behaviour'));
assert(c.pages.appointments().includes('href="#/reputation"'));
assert(c.pages['use-cases']().includes('businesses, consumers or both'));
for(const slug of ['pricing','get-started','ai'])assert.equal(c.pages[slug],untouched);
assert(source.includes("['ArrowRight','ArrowLeft','Home','End']"));
assert(source.includes("setAttribute('tabindex'"));
assert(source.includes("setAttribute('aria-controls','demo-content')"));
assert(read('dist/growth-pages.css').includes('prefers-reduced-motion'));
assert(read('dist/index.html').indexOf('growth-pages.js')>read('dist/index.html').indexOf('reporting-page.js'));
console.log('Growth review passed: hierarchy, six routes, five lifecycle stages, three CRM roles, simultaneous calendar paths, audience scope, parked pages, keyboard tabs and reduced motion.');
const slugs=['attract-capture','follow-up-nurture','convert-close','delight-grow','reactivate'];
for(const [index,slug] of slugs.entries()){
 const homeDetail=c.growthStageDetail(index,'platform');
 const links=[...homeDetail.matchAll(/href="([^"]+)"/g)].map(match=>match[1]);
 assert.equal(links.length,4);assert(links.every(href=>href===`#/platform?growth=${slug}`),slug);
 const tools=c.growthStageDetail(index);assert(!tools.includes('#/platform?growth='),'Platform tool links remain direct');
 c.location={hash:`#/platform?growth=${slug}`};const platform=c.pages.platform();
 assert(platform.includes(`data-growth-stage="${index}" aria-pressed="true"`));assert(platform.includes('data-route-landing'));
 assert(c.pages.home().includes('data-growth-destination="platform"'));
}
c.location={hash:'#/platform?growth=unknown'};assert(c.pages.platform().includes('data-growth-stage="0" aria-pressed="true"'));assert(!c.pages.platform().includes('data-route-landing'));
console.log('Growth destination checks passed: all 20 homepage links target the matching Platform stage, direct-entry context, invalid-stage fallback and deeper Platform tool links remain intact.');

assert(source.includes("e.pointerType==='mouse'&&(e.movementX||e.movementY)"),'A stationary cursor must not change the landing stage');
