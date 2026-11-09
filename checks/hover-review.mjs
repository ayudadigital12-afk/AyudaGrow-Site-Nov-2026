import assert from 'node:assert/strict';import{readFileSync}from'node:fs';
const css=readFileSync(new URL('../dist/layout-refinements.css',import.meta.url),'utf8').split('/* Who We Serve:')[1];
assert(css);for(const token of [':focus-visible','@media(hover:hover) and (pointer:fine)','@media(hover:none)','prefers-reduced-motion:reduce','body.paused','translateY(-2px)','scale(1.035)','translateX(4px)'])assert(css.includes(token),token);
assert(!css.includes('.ag-business-examples'));assert(!css.includes('.ag-business-category:hover'));assert(css.includes('transform:none!important'));
console.log('Hover checks passed: scoped journey links, keyboard parity, fine-pointer hover, touch feedback, reduced-motion and pause safeguards.');
