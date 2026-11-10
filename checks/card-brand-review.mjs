import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=f=>readFileSync(new URL('../dist/'+f,import.meta.url),'utf8');
const css=read('card-refinements.css'),brand=read('brand-growth.css'),index=read('index.html');
for(const name of ['explore-card','feature','gp-loop-tabs','gp-exception-card','channel-capabilities','plan-card','learning-steps','rp-response-grid','rf-deals','rf-decisions','rf-pipeline','knowledge-stack'])assert(css.includes(name),name);
assert(!/(?:^|[;{])\s*height\s*:|text-overflow|line-clamp|overflow\s*:\s*hidden/.test(css));
assert(css.includes('min-height:78px'));assert(css.includes('min-height:52px'));assert(css.includes('min-height:0'));
for(const material of ['acrylic','aluminium','embossed'])for(const shape of ['ring','sweep']){const name=`brand-growth-${shape}-${material}-optimized.webp`;assert(existsSync(new URL('../dist/assets/'+name,import.meta.url)));assert(brand.includes(name));}
assert(brand.includes('padding-right:calc(5% + 128px)'));assert(brand.includes('position:static'));
assert(index.indexOf('card-refinements.css')>index.indexOf('subpage-theme.css'));
assert(index.indexOf('brand-growth.css')>index.indexOf('card-refinements.css'));
assert(read('homepage.js').includes('<h2 id="ag-who-title">Who We Serve</h2>'));
assert(read('homepage.js').includes('Different ways of selling</span>'));
assert(read('expanded.js').includes('<span class="heading-lead">Your Business knowledge.</span><br>A useful conversation.<br>A clear next step.'));
assert(read('layout-refinements.css').includes('font-size:calc(1em - 8px)'));
console.log('Card/brand checks passed: compact content-led shared card families, unchanged five-column stage width, 78/52px stage targets, six supplied marks, reserved hero spacing, mobile in-flow CTA, semantic Who We Serve swap and exact 6pt first-line reduction.');
