import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const expanded=read('dist/expanded.js');
const context={pages:{},section:(body,cls)=>`<section class="${cls||''}">${body}</section>`,scopeNote:copy=>copy,cta:()=>''};
vm.createContext(context);
vm.runInContext(read('dist/catalogue-data.js')+'\n'+expanded.match(/const capabilityRoutes=.*?;/)[0]+'\n'+expanded.slice(expanded.indexOf('const outcomes='),expanded.indexOf('const secondaryCapabilities=')),context);
const html=context.pages.solutions();
const catalogue=vm.runInContext('capabilityCatalogue',context), outcomes=vm.runInContext('outcomes',context);
assert.equal((html.match(/class="ag-card-heading"/g)||[]).length,20);
assert.equal((html.match(/class="ag-card-benefit"/g)||[]).length,20);
assert.equal((html.match(/<details /g)||[]).length,20);
assert.equal((html.match(/<summary aria-label=/g)||[]).length,20);
assert.equal((html.match(/data-capability=/g)||[]).length,13);
assert.equal((html.match(/name="ag-capability-detail"/g)||[]).length,13);
assert.equal((html.match(/name="ag-outcome-detail"/g)||[]).length,7);
for(const c of catalogue){assert(html.includes(c.copy));assert(html.includes(c.cost));c.tools.forEach(t=>assert(html.includes(t)));assert(html.includes(`data-capability="${c.id}"`));}
for(const o of outcomes){assert(html.includes(o[1]));assert(html.includes(o[2]));o[3].forEach(t=>assert(html.includes(t)));assert(html.includes(`href="#/solutions/${o[0]}"`));}
assert(html.includes('assets/mascot-laptop.png'));
assert(html.includes('Availability, setup and charges depend on your plan and agreed scope.'));
assert(!html.includes('plus more'));
for(const route of ['crm','lead-capture','inbox','appointments','consultative-sales','automation','marketing','reputation','commerce','learning','reporting','ai','integrations'])assert(html.includes(`href="#/${route}"`));
const css=read('dist/puzzle-refinement.css');
assert(css.includes('.ag-scan-card summary:focus-visible'));
assert(css.includes('min-height:44px'));
assert(css.includes('@media(prefers-reduced-motion:reduce){.ag-scan-card'));
console.log('Capabilities review checks passed: 20 consistent cards, native accessible detail controls, all 13 capability areas, 7 outcomes, original content/scope/links preserved, brand robot and reduced-motion styles.');
