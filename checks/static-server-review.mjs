import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
// Exercise the actual local server handler without opening a second preview server.
// This is not a network/host verification.
const source=readFileSync(new URL('../scripts/serve.mjs',import.meta.url),'utf8');
let handler;
const context={http:{createServer:fn=>{handler=fn;return {listen(){}};}},readFileSync,statSync,resolve,extname,sep,fileURLToPath,URL,process:{env:{NORMALIZE_URLS:'1'}},console};
const executable=source.replace(/^import .*;\n/gm,'').replaceAll('import.meta.url',JSON.stringify(new URL('../scripts/serve.mjs',import.meta.url).href));
vm.runInNewContext(executable,context);
assert.equal(typeof handler,'function');
function request(url,method='GET'){
 const r={statusCode:200,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;},writeHead(code,headers={}){this.statusCode=code;for(const [k,v] of Object.entries(headers))this.setHeader(k,v);},end(body){this.body=body;this.ended=true;}};
 handler({url,method},r);assert(r.ended,url);assert.equal(r.headers['x-robots-tag'],'noindex, nofollow');return r;
}
const manifest=JSON.parse(readFileSync(new URL('../build/route-manifest.json',import.meta.url),'utf8'));
for(const p of manifest.pages){
 for(const path of [p.path]){
  const r=request(path);assert.equal(r.statusCode,200,path);assert.match(r.headers['content-type'],/text\/html/);assert(r.body.toString().includes(`href="${p.canonical}"`));
 }
}
for(const line of readFileSync(new URL('../dist/_redirects',import.meta.url),'utf8').trim().split('\n')){
 const [path,target,code]=line.split(/\s+/);const r=request(path+'?source=test');assert.equal(r.statusCode,Number(code));assert.equal(r.headers.location,target+'?source=test');assert.equal(request(target).statusCode,200);
}
for(const path of ['/ai-concepts','/ai-concepts/','/book','/login','/missing-route','/source/shell.html','/package.json','/node_modules/jsdom/package.json']){
 const r=request(path);assert.equal(r.statusCode,404,path);assert.match(r.body.toString(),/That page is not here/);
}
for(const p of manifest.pages){for(const variant of p.path==='/'?['/index.html']:[p.path+'/',p.path+'/index.html']){const r=request(variant+'?check=1');assert.equal(r.statusCode,301);assert.equal(r.headers.location,p.path+'?check=1');}}
const head=request('/','HEAD');assert.equal(head.statusCode,200);assert.equal(head.body,undefined);
assert.equal(request('/','POST').statusCode,405);
assert.equal(request('/%E0%A4%A').statusCode,400);
console.log('Static handler checks passed: 33 routes and slash variants, 26 query-preserving 301s, correct targets, 404/source isolation, HEAD, malformed URL and unsupported method. Network/hosting still requires separate verification.');
