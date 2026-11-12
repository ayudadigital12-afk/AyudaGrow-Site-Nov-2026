import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const origin='https://staging2.ayudagrow.com';
const hash=b=>createHash('sha256').update(b).digest('hex');
const local=p=>readFileSync(new URL('../dist/'+p,import.meta.url));
async function get(path,method='GET'){
 const url=new URL(path,origin);assert.equal(url.origin,origin);
 return fetch(url,{method,redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'Cache-Control':'no-cache'}});
}
const expected=hash(local('index.html'));
let ready=false;
for(let i=0;i<30;i++){
 const r=await get('/?release-check='+process.env.GITHUB_SHA);
 if(r.status===200&&hash(Buffer.from(await r.arrayBuffer()))===expected){ready=true;break;}
 console.log('Waiting for Hostinger to serve the tested homepage ('+(i+1)+'/30).');
 await new Promise(resolve=>setTimeout(resolve,5000));
}
assert(ready,'Staging has not served the tested homepage within the deployment window.');
const manifest=JSON.parse(local('route-manifest.json'));
for(const {path} of manifest.pages){
 const r=await get(path);assert.equal(r.status,200,path);
 const body=Buffer.from(await r.arrayBuffer());
 const filename=path==='/'?'index.html':path.slice(1)+'/index.html';
 assert.equal(hash(body),hash(local(filename)),'Exact HTML: '+path);
 assert.match(body.toString(),/name="robots" content="noindex,nofollow"/);
}
console.log('PASS: all '+manifest.pages.length+' canonical staging URLs return 200 and match the tested noindex HTML byte for byte.');
const home=local('index.html').toString();
const assetPaths=[...home.matchAll(/(?:src|href)="([^"?]+(?:\.js|\.css))(?:\?[^"]*)?"/g)].map(m=>m[1]).filter(p=>!p.startsWith('https:'));
for(const path of new Set(assetPaths)){
 const r=await get('/'+path.replace(/^\//,''));assert.equal(r.status,200,path);
 assert.equal(hash(Buffer.from(await r.arrayBuffer())),hash(local(path.replace(/^\//,''))),'Exact asset: '+path);
}
console.log('PASS: '+new Set(assetPaths).size+' served JavaScript and CSS assets match the tested build.');
const redirects=local('_redirects').toString().trim().split('\n').map(l=>l.trim().split(/\s+/));
for(const [from,to] of redirects){const r=await get(from);assert.equal(r.status,301,from);const target=new URL(r.headers.get('location'),origin);assert.equal(target.origin,origin);assert.equal(target.pathname,to);}
console.log('PASS: '+redirects.length+' legacy URL forms redirect to clean staging destinations.');
const missing=await get('/release-check-page-that-does-not-exist');assert.equal(missing.status,404);
for(const path of ['/source/shell.html','/package.json','/.git/config','/.htaccess']){const r=await get(path,'HEAD');assert([403,404].includes(r.status),'Source protection: '+path+' '+r.status);}
const robots=await get('/robots.txt');assert.equal(robots.status,200);assert.match(await robots.text(),/Disallow:\s*\//);
const sitemap=await get('/sitemap.xml');assert.equal(sitemap.status,200);assert(!/<loc>/.test(await sitemap.text()));
console.log('PASS: genuine 404, four protected source/config paths, robots crawl block and empty staging sitemap.');
console.log('Staging verification complete. Production and DNS were not accessed.');
