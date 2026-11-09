import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../dist/homepage.css',import.meta.url),'utf8');
for(const rule of ['grid-template-columns:repeat(6,minmax(0,1fr))','grid-auto-rows:1fr','grid-template-columns:repeat(3,minmax(0,1fr))','grid-template-columns:repeat(2,minmax(0,1fr))','margin:0 auto','justify-content:center','text-align:center','white-space:normal','overflow-wrap:anywhere'])assert(css.includes(rule),rule);
const js=readFileSync(new URL('../dist/visuals.js',import.meta.url),'utf8');
for(const label of ['Website Chat','WhatsApp Chat','WhatsApp Voice Calls*','Emails','Instagram','Facebook Messenger','*WhatsApp calling requires eligibility and setup.','Supported channels, subject to setup'])assert(js.includes(label),label);
assert(js.includes('<ul class="av-knowledge-bubbles"'));
assert(js.includes('av-platform-mark av-mark-${key}'));
console.log('Channel bubble checks passed: centred equal columns/rows, responsive 6/3/2 layout, wrapping, all labels/icons, list semantics and setup qualification retained.');
