import {normaliseAssetNames} from '../scripts/normalise-asset-names.mjs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const c={pages:{appointments:()=>'<section>Appointment</section><section class="cta">Contact</section>'},section:(h,s='')=>`<section class="${s}">${h}</section>`,wireExpanded:()=>{},render:()=>{}};
vm.createContext(c);vm.runInContext(read('dist/reputation-page.js'),c);const h=c.pages.reputation();
assert.equal((h.match(/<h1>/g)||[]).length,1);assert.equal((h.match(/<details>/g)||[]).length,4);assert.equal((h.match(/data-reputation-mode=/g)||[]).length,2);
for(const s of ['Additional managed service','scope and fees agreed separately','before you claim or verify','Google decides the verification method and outcome','physical locations where needed and agreed','No incentives, pressure','No screening out unhappy customers','retains primary ownership','Keep verification codes private','not assumed to be 24/7','aria-live="polite"'])assert(h.includes(s),s);
assert(c.reputationPlan('multi').includes('Kingston, Mandeville and Montego Bay'));assert(c.reputationPlan('single').includes('One location.'));
const a=c.pages.appointments();assert(a.includes('href="#/reputation"'));assert(a.indexOf('reputation management')<a.indexOf('<section class="cta">'));
const css=read('dist/reputation-page.css');assert(css.includes('@media(max-width:640px)'));assert(css.includes('min-height:48px'));assert(read('dist/reputation-page.js').includes('prefers-reduced-motion'));
assert(normaliseAssetNames(read('dist/index.html')).indexOf('reputation-page.js')>normaliseAssetNames(read('dist/index.html')).indexOf('inbox-page.js'));
console.log('Reputation checks passed: dedicated route, appointment bridge, managed-service boundaries, policy qualifications, location selector, accessible controls and responsive rules.');

