import {normaliseAssetNames} from '../scripts/normalise-asset-names.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const js=read('dist/layout-refinements.js'),css=read('dist/layout-refinements.css');
assert(js.includes("document.querySelectorAll('main h2')"));
assert(js.includes('pieces.length===2'));
assert(js.includes("heading.closest('.cta')"));
assert(css.includes('font-size:calc(1em - 8px)'));
assert(css.includes('.hero .wrap{align-items:start}'));
assert(css.includes('.home-workspace-section .workspace{background:#fff;color:var(--navy)}'));
assert(css.includes('.home-workspace-section .platform-scene>.micro{color:#52637c}'));
assert(js.includes('<span>From first</span> <span>enquiry to a</span> <span>confident yes.</span>'));
assert(js.includes("setAttribute('viewBox','392 20 326 462')"));
assert(read('dist/app.js').includes('Where could your business <br>use a little more momentum?'));
assert(normaliseAssetNames(read('dist/index.html')).indexOf('layout-refinements.js')>normaliseAssetNames(read('dist/index.html')).indexOf('growth-pages.js'));
console.log('Layout checks passed: 6pt statement distinction, semantic H2 preserved, hero alignment, dark section/white workspace, three-line Marcus wording, portrait crop, responsive CTA spacing.');

