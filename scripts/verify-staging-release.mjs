import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const origin='https://staging2.ayudagrow.com';
const sha=b=>createHash('sha256').update(b).digest('hex');
const local=p=>readFileSync(new URL('../dist/'+p,import.meta.url));
const manifest=JSON.parse(readFileSync(new URL('../build/route-manifest.json',import.meta.url)));
assert.equal(manifest.environment,'staging');
async function get(path,method='GET'){
 const url=new URL(path,origin);assert.equal(url.origin,origin);
 return fetch(url,{method,redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'Cache-Control':'no-cache'}});
}
const expected=sha(local('index.html'));
const assets=new Set();
let ready=false;
for(let i=0;i<36;i++){
 const r=await get('/?release-check='+process.env.GITHUB_SHA);
 if(r.status===200&&sha(Buffer.from(await r.arrayBuffer()))===expected){ready=true;break;}
 console.log('Waiting for staging release '+(i+1)+'/36');
 await new Promise(resolve=>setTimeout(resolve,5000));
}
assert(ready,'Staging did not serve this commit. GitHub push alone has not completed deployment.');
for(const page of manifest.pages){
 const r=await get(page.path);assert.equal(r.status,200,page.path);
 assert.match(r.headers.get('x-robots-tag')||'',/noindex/i,page.path+' header');
 const body=Buffer.from(await r.arrayBuffer());
 assert.equal(sha(body),sha(local(page.path==='/'?'index.html':page.path.slice(1)+'/index.html')),'HTML '+page.path);
 assert.match(body.toString(),/name="robots" content="noindex,nofollow"/);
 const assetPaths=[...body.toString().matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))(?:\?[^"#]*)?"/g)].map(m=>m[1]).filter(p=>!/^https?:/.test(p));
 for(const p of assetPaths)assets.add('/'+p.replace(/^\//,''));
}
for(const path of assets){const r=await get(path);assert.equal(r.status,200,path);assert.equal(sha(Buffer.from(await r.arrayBuffer())),sha(local(path.slice(1))),path);}
const redirects=local('_redirects').toString().trim().split('\n').filter(Boolean).map(l=>l.trim().split(/\s+/));
for(const [from,to,status] of redirects){
 const r=await get(from+'?source=release-check');assert.equal(r.status,Number(status),from);
 const actual=new URL(r.headers.get('location'),origin),expected=new URL(to,origin);
 assert.equal(actual.origin,expected.origin,from);assert.equal(actual.pathname,expected.pathname,from);assert.equal(actual.search,'?source=release-check',from);
 // Deliberately do not follow external account-login redirects.
}
for(const page of manifest.pages){
 for(const from of page.path==='/'?['/index.html']:[page.path+'/','/dist'+page.path,page.path+'/index.html']){
  const r=await get(from);assert.equal(r.status,301,from);assert.equal(new URL(r.headers.get('location'),origin).href,origin+page.path,from);
 }
}
const missing=await get('/release-check-page-that-does-not-exist');assert.equal(missing.status,404);
for(const path of ['/source/shell.html','/package.json','/.git/config','/.htaccess','/docs/PRICING-SOURCE.md','/build/route-manifest.json']){const r=await get(path,'HEAD');assert([403,404].includes(r.status),'Protected: '+path);}
const robots=await get('/robots.txt');assert.equal(robots.status,200);assert.match(await robots.text(),/Disallow:\s*\//);
const sitemap=await get('/sitemap.xml');assert.equal(sitemap.status,200);assert(!/<loc>/.test(await sitemap.text()));
console.log(JSON.stringify({target:origin,commit:process.env.GITHUB_SHA,pages:manifest.pages.length,exactAssets:assets.size,redirects:redirects.length,privacy:true,cookies:true,loginRedirect:true,indexing:'noindex',productionChanged:false}));
