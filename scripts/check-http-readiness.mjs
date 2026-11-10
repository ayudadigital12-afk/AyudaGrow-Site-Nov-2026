import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base=process.env.BASE_URL;
assert(base,'Set BASE_URL to the verified staging deployment or local preview URL.');
const origin=new URL(base).origin;
const manifest=JSON.parse(readFileSync(new URL('../dist/route-manifest.json',import.meta.url),'utf8'));
const redirects=readFileSync(new URL('../dist/_redirects',import.meta.url),'utf8').trim().split('\n').map(l=>l.split(/\s+/));
let requests=0;
async function read(path){
 const response=await fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(15000)});requests++;
 assert.match(response.headers.get('x-robots-tag')||'',/noindex/i,`${path}: staging response header`);
 return response;
}
for(const page of manifest.pages){
 for(const path of [page.path]){
  const r=await read(path);assert.equal(r.status,200,`${path}: direct route`);
  assert.match(r.headers.get('content-type')||'',/text\/html/);
  const html=await r.text();assert(html.includes('content="noindex,nofollow"'),`${path}: metadata safety`);
  assert(html.includes(`href="${page.canonical}"`),`${path}: canonical`);
 }
}
for(const page of manifest.pages){for(const variant of page.path==='/'?['/index.html']:[page.path+'/',page.path+'/index.html']){const r=await read(variant);assert.equal(r.status,301,variant);assert.equal(new URL(r.headers.get('location'),origin).pathname,page.path);}}
for(const [path,to,status] of redirects){
 const r=await read(path+'?source=readiness');assert.equal(r.status,Number(status),path);
 const target=new URL(r.headers.get('location'),origin);
 assert.equal(target.pathname,to);assert.equal(target.search,'?source=readiness');
 assert.equal((await read(to)).status,200,`${path}: target`);
}
for(const path of ['/ai-concepts','/ai-concepts/','/not-a-real-ayudagrow-route','/book','/login','/source/shell.html','/package.json','/node_modules/jsdom/package.json']){
 const r=await read(path);assert.equal(r.status,404,`${path}: must not expose removed/private/unsupported route`);
 assert.match(await r.text(),/That page is not here/);
}
const head=await fetch(origin+'/',{method:'HEAD',redirect:'manual'});requests++;
assert.equal(head.status,200);assert.equal(await head.text(),'');
console.log(`HTTP staging checks passed: ${requests} requests, 33 canonical routes and slash variants, 26 legacy 301s with queries preserved, 200 targets, actual 404s, root-source isolation and noindex headers at ${origin}.`);
