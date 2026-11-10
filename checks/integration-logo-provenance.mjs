import assert from 'node:assert/strict';
import {readFileSync,statSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root));
const records=JSON.parse(read('source/integration-logo-provenance.json'));
assert.equal(records.length,33);assert.equal(new Set(records.map(r=>r.key)).size,33);
const context={wireExpanded:()=>{},render:()=>{}};vm.createContext(context);vm.runInContext(read('dist/integration-carousel.js').toString(),context);
const apps=vm.runInContext('connectedApps',context),assets=vm.runInContext('connectionLogoAssets',context);
assert.equal(apps.length,34);assert.equal(new Set(apps.map(a=>a[1])).size,33);
assert.deepEqual(Object.keys(assets).sort(),records.map(r=>r.key).sort());
for(const r of records){
 assert.equal(new URL(r.source_url).protocol,'https:');assert.equal(new URL(r.official_page).protocol,'https:');
 assert.equal(r.local_path,'source/public'+r.public_path);
 assert.deepEqual([...assets[r.key]],[r.public_path,r.width,r.height]);
 const original=read(r.local_path),built=read('dist'+r.public_path);
 assert.equal(createHash('sha256').update(original).digest('hex'),r.sha256,r.key+' recorded official bytes');
 assert.deepEqual(built,original,r.key+' unmodified hosted copy');assert.equal(original.length,r.bytes);
 assert(r.width>0&&r.height>0);assert(statSync(new URL('dist'+r.public_path,root)).isFile());
 if(r.public_path.endsWith('.svg'))assert(!/<script|<foreignObject|\bon\w+=|(?:xlink:)?href=["']https?:/i.test(original.toString()),r.key+' SVG has no active content/external resources');
}
assert.deepEqual(readdirSync(new URL('dist/assets/integrations/',root)).sort(),records.map(r=>r.public_path.split('/').at(-1)).sort(),'Only current verified integration assets are shipped');
console.log('Logo provenance passed: 33 unchanged provider-owned assets for 34 cards, exact checksums/dimensions, no active SVG content, no obsolete logo artwork in served output. Source provenance is not an endorsement or license grant.');
