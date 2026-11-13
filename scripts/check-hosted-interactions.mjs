import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {JSDOM,VirtualConsole} from 'jsdom';
const origin=process.env.BASE_URL||'https://staging2.ayudagrow.com';
const response=await fetch(origin+'/',{signal:AbortSignal.timeout(20000)});
assert.equal(response.status,200);assert.match(response.headers.get('x-robots-tag')||'',/noindex/);
const html=await response.text(),vc=new VirtualConsole(),errors=[];
vc.on('jsdomError',e=>{if(e.type!=='not-implemented')errors.push(e.message)});
const dom=new JSDOM(html,{url:origin+'/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window;
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};
w.IntersectionObserver=class{observe(){}disconnect(){}};w.ResizeObserver=class{observe(){}disconnect(){}};
w.setInterval=()=>0;w.clearInterval=()=>{};
const scripts=[...w.document.querySelectorAll('script[src]')].map(e=>new URL(e.getAttribute('src'),origin)).filter(u=>u.origin===origin);
const fetched=await Promise.all(scripts.map(async u=>{const r=await fetch(u,{signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,u.href);const bytes=Buffer.from(await r.arrayBuffer());const local=readFileSync(new URL('../dist'+u.pathname,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),createHash('sha256').update(local).digest('hex'),'Deployed file differs: '+u.pathname);new vm.Script(bytes.toString('utf8'),{filename:u.pathname});return {url:u,code:bytes.toString('utf8')};}));
for(const s of fetched)vm.runInContext(s.code,dom.getInternalVMContext(),{filename:s.url.pathname});
const d=w.document;assert.equal(d.querySelector('#motion'),null);
assert(d.querySelector('.gp-growth-section'));assert.match(d.querySelector('.gp-growth-section').textContent,/One relationship/);
assert.equal(d.querySelectorAll('.ch-app-card:not([aria-hidden="true"])').length,34);
const pieces=[...d.querySelectorAll('[data-ag-piece]')];assert.equal(pieces.length,12);
for(const piece of pieces){const over=new w.Event('pointerover',{bubbles:true});over.pointerType='mouse';piece.dispatchEvent(over);assert.equal(d.querySelector('[data-ag-context-title]').textContent,piece.querySelector('strong').textContent);assert(d.querySelector('[data-ag-context-copy]').textContent.trim());assert.equal(piece.getAttribute('aria-pressed'),'true');}
pieces[0].focus();assert.equal(d.querySelector('[data-ag-context-title]').textContent,'CRM');
pieces[1].click();assert.equal(d.querySelector('[data-ag-context-title]').textContent,'Sales Tools');
const stages=[...d.querySelectorAll('[data-growth-stage]')];assert.equal(stages.length,5);for(const b of stages){b.click();assert.equal(b.getAttribute('aria-pressed'),'true');}
assert.deepEqual(errors,[]);
console.log(JSON.stringify({scriptsVerified:fetched.length,syntax:'pass',exactBytes:'pass',puzzleHover:12,puzzleFocus:'pass',puzzleClick:'pass',growthStages:5,appLogos:34,headerMotionButton:'removed',noindex:true}));
dom.window.close();
