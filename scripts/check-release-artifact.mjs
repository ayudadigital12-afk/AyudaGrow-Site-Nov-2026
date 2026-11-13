import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from './render-page.mjs';
const read=p=>readFileSync(p,'utf8');
const m=JSON.parse(read('build/route-manifest.json')),production=m.environment==='production';
assert(!existsSync('dist/route-manifest.json'),'Internal manifest must not ship');
const urls=new Set(m.pages.map(p=>p.path));
const redirects=new Map(read('dist/_redirects').trim().split('\n').map(l=>l.split(' ')));
const forms={essentials:'CkmLMXN55hD2X9hCfO4j',core:'65wBICRDMlJ7RTZPK3dG',build:'XidHogjcgDQ48zVVZKSz',scale:'abrMomyu1JJgrxPvWYLh'};
let links=0;
for(const page of m.pages){
 const file=page.path==='/'?'dist/index.html':`dist${page.path}/index.html`,html=read(file);
 for(const runtime of [false,true]){
  const dom=runtime?renderPage(html,m.origin,page.path,{navigation:true}):new JSDOM(html,{url:m.origin+page.path});
  const d=dom.window.document,expected=production?(page.indexable?'index,follow':'noindex,follow'):'noindex,nofollow';
  assert.equal(d.querySelector('meta[name="robots"]').content,expected,page.path+' indexing');
  assert.equal(d.querySelector('link[rel="canonical"]').href,m.origin+page.path);
  assert.equal(d.querySelector('meta[property="og:url"]').content,m.origin+page.path);
  assert.equal(d.querySelector('meta[name="twitter:card"]').content,'summary_large_image');
  assert.equal(d.querySelector('meta[property="og:image"]').content,m.origin+'/assets/share-default.png');
  assert.equal(d.querySelectorAll('main h1').length,1,page.path);
  for(const a of d.querySelectorAll('a[href]')){const u=new URL(a.href);if(u.origin===m.origin){assert(urls.has(u.pathname)||redirects.has(u.pathname),`${page.path} -> ${u.pathname}`);links++;}}
  if(page.path.startsWith('/signup/')){const plan=page.path.split('/').pop();assert.equal(d.querySelector('iframe[data-form-id]').dataset.formId,forms[plan]);assert.equal(d.querySelector('iframe').src,'https://grow.ayudagrow.com/widget/form/'+forms[plan]);}
  dom.window.close();
 }
}
const map=new JSDOM(read('dist/sitemap.xml'),{contentType:'text/xml'}),locs=[...map.window.document.querySelectorAll('loc')].map(x=>x.textContent);map.window.close();
assert.deepEqual(locs,m.pages.filter(x=>x.indexable).map(x=>x.canonical));
assert(locs.every(x=>x.startsWith('https://ayudagrow.com/')&&!x.includes('?')&&!x.includes('/signup/')));
assert.match(read('dist/.htaccess'),/X-Content-Type-Options "nosniff"/);
assert.equal(read('dist/.htaccess').includes('^www\\.ayudagrow'),production);
for(const p of ['favicon.ico','assets/favicon-32.png','assets/apple-touch-icon.png','assets/share-default.png'])assert(existsSync('dist/'+p),p);
console.log(JSON.stringify({environment:m.environment,pages:m.pages.length,staticAndRuntime:true,links,sitemapUrls:locs.length,forms:'4 unchanged',publicationApproved:false}));
