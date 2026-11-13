import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from '../scripts/render-page.mjs';
import {apacheStagingRules} from '../scripts/apache-rules.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const manifest=JSON.parse(read('build/route-manifest.json')),origin=manifest.origin;
const routeSet=new Set(manifest.pages.map(p=>p.path)),edges=new Map();
for(const p of manifest.pages){
 const file=p.path==='/'?'dist/index.html':`dist${p.path}/index.html`;
 const dom=new JSDOM(read(file),{url:origin+p.path}),d=dom.window.document;
 assert(p.title.length>=50&&p.title.length<=60,`${p.path} title length`);
 assert(p.title.endsWith(' | AyudaGrow'),`${p.path} topic-first title`);
 assert(p.description.length>=140&&p.description.length<=155,`${p.path} description length`);
 assert.equal(d.documentElement.lang,'en');
 for(const img of d.querySelectorAll('img')){
  assert(Number(img.getAttribute('width'))>0&&Number(img.getAttribute('height'))>0,`${p.path} image dimensions ${img.getAttribute('src')}`);
  assert(img.hasAttribute('alt'),`${p.path} image alternative`);
  assert(['eager','lazy'].includes(img.getAttribute('loading')),`${p.path} loading hint`);
 }
 for(const script of d.querySelectorAll('script[src]'))assert(script.defer,`${p.path} deferred script`);
 const fonts=d.querySelectorAll('link[rel="preload"][as="font"]');assert.equal(fonts.length,2);
 for(const font of fonts){assert(font.getAttribute('href').endsWith('.woff2'));assert(font.hasAttribute('crossorigin'));}
 let previous=0;
 for(const h of d.querySelectorAll('main h1,main h2,main h3,main h4,main h5,main h6')){
  const level=Number(h.tagName[1]);assert(level<=previous+1,`${p.path}: skipped heading level ${previous} to ${level}: ${h.textContent}`);previous=level;
 }
 const links=new Set([...d.querySelectorAll('a[href]')].map(a=>new URL(a.href)).filter(u=>u.origin===origin&&routeSet.has(u.pathname)).map(u=>u.pathname));edges.set(p.path,links);dom.window.close();
}
const distance=new Map([['/',0]]),queue=['/'];
while(queue.length){const path=queue.shift();for(const next of edges.get(path)||[]){if(!distance.has(next)){distance.set(next,distance.get(path)+1);queue.push(next);}}}
for(const p of routeSet)assert((distance.get(p)??Infinity)<=3,`${p}: more than three clicks from home`);
const shell=read('source/shell.html'),runtime=renderPage(shell,origin,'/');
const aliases=runtime.window.AyudaSearch.aliases;runtime.window.close();
assert.equal(read('dist/.htaccess'),apacheStagingRules([...routeSet],aliases));
for(const part of ['ErrorDocument 404 /404.html','DirectorySlash Off','Header always set X-Robots-Tag "noindex, nofollow"','AddOutputFilterByType DEFLATE','max-age=0','max-age=3600','[R=301,L]','%{HTTPS} !=on'])assert(read('dist/.htaccess').includes(part),part);
assert(!read('dist/.htaccess').includes('https://ayudagrow.com'),'Staging must not silently redirect to production');
for(const name of readdirSync(new URL('../source/public/',import.meta.url)).filter(n=>/\.(js|css)$/.test(n)))assert.equal(read('source/public/'+name),read('dist/'+name),name+' built from source');
const optimizations=JSON.parse(read('source/asset-optimization.json'));
for(const item of optimizations){
 assert(existsSync(new URL('../source/assets-originals/'+item.old,import.meta.url)),'Original source retained');
 assert(!existsSync(new URL('../dist/assets/'+item.old,import.meta.url)),'Original not shipped: '+item.old);
 assert.equal(statSync(new URL('../dist/assets/'+item.new,import.meta.url)).size,item.new_bytes);
}
assert(optimizations.reduce((s,x)=>s+x.new_bytes,0)<optimizations.reduce((s,x)=>s+x.old_bytes,0)*.25,'At least 75% smaller selected asset payload');
assert.equal(read('dist/assets/fonts/OFL.txt'),read('source/public/assets/fonts/OFL.txt'));
console.log('SEO/performance preparation passed: 33 topic-first titles/descriptions, no skipped main headings, image dimensions/loading, deferred scripts, WOFF2 preloads, three-click reachability, generated Apache staging rules, source/output consistency and >75% smaller selected assets. This is NOT a measured Core Web Vitals pass or a hosted Apache test.');
