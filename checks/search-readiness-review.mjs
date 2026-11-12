import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from '../scripts/render-page.mjs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const manifest=JSON.parse(read('dist/route-manifest.json'));
const origin=manifest.origin;
const routes=new Set(manifest.pages.map(p=>p.path));
const titles=new Set(),descriptions=new Set();
assert.equal(manifest.mode,'private-preview');assert.equal(manifest.publicLaunchApproved,false);
assert.equal(manifest.pages.length,37);
let linkCount=0;
for(const page of manifest.pages){
  const html=read(page.path==='/'?'dist/index.html':'dist'+page.path+'/index.html');
  // No script execution: these checks specifically verify the delivered document.
  const dom=new JSDOM(html,{url:origin+page.path});const d=dom.window.document;
  assert.equal(d.querySelectorAll('main h1').length,1,page.path);
  // Get started is deliberately a concise route chooser, with plan detail on Pricing.
  assert(d.querySelector('main').textContent.trim().length>(page.path==='/get-started'?100:200),page.path);
  assert.equal(d.querySelector('meta[name="robots"]').content,'noindex,nofollow');
  assert.equal(d.querySelector('link[rel="canonical"]').href,origin+page.path);
  assert.equal(d.querySelector('meta[property="og:url"]').content,origin+page.path);
  assert.equal(d.querySelector('meta[property="og:title"]').content,d.title);
  assert.equal(d.querySelector('meta[name="twitter:title"]').content,d.title);
  assert.equal(d.querySelector('meta[name="description"]').content,page.description);
  assert(page.description.length>70);titles.add(d.title);descriptions.add(page.description);
  assert.equal(d.querySelectorAll('a[href^="#/"]').length,0,page.path);
  assert.equal(d.querySelector('.skip').getAttribute('href'),page.path+'#main');
  const schema=JSON.parse(d.querySelector('#ayuda-structured-data').textContent);
  assert.equal(schema['@context'],'https://schema.org');
  assert(schema['@graph'].some(item=>item['@type']==='WebPage'&&item.url===page.canonical));
  for(const key of ['aggregateRating','review','offers','price','address','email','telephone','legalName','sameAs'])assert(!JSON.stringify(schema).includes('"'+key+'"'),key);
  for(const link of d.querySelectorAll('a[href]')){
    const url=new URL(link.href);if(url.origin!==origin)continue;
    assert(routes.has(url.pathname),page.path+' -> '+url.pathname);linkCount++;
  }
  for(const asset of d.querySelectorAll('script[src],link[rel="stylesheet"],img[src],image[href]')){
    const url=new URL(asset.getAttribute('src')||asset.getAttribute('href'),d.baseURI);
    if(asset.tagName==='SCRIPT'&&url.href==='https://widgets.leadconnectorhq.com/loader.js'){assert.equal(asset.dataset.widgetId,'6adbe6959f0ad5b6ad0a7a22');continue;}
    if(asset.tagName==='SCRIPT'&&url.href==='https://grow.ayudagrow.com/js/form_embed.js'){assert(page.path.startsWith('/signup/'));continue;}
    assert.equal(url.origin,origin);assert(existsSync(new URL('../dist'+url.pathname,import.meta.url)),page.path+' asset '+url.pathname);
  }
  dom.window.close();
}
assert.equal(titles.size,37);assert.equal(descriptions.size,37);
assert.match(read('dist/robots.txt'),/User-agent: \*\nDisallow: \/\n/);
assert(!read('dist/sitemap.xml').includes('<loc>'));
assert.match(read('dist/_headers'),/X-Robots-Tag: noindex, nofollow/);
const errorDom=new JSDOM(read('dist/404.html'));
assert.match(errorDom.window.document.querySelector('main').textContent,/That page is not here/);
assert(!errorDom.window.document.querySelector('link[rel="canonical"]'));
errorDom.window.close();
const shell=read('source/shell.html');
const aliases=renderPage(shell,origin,'/');
const aliasMap=aliases.window.AyudaSearch.aliases;aliases.window.close();
for(const [from,to] of Object.entries(aliasMap)){
  const dom=new JSDOM(read('dist/'+from+'/index.html'),{url:origin+'/'+from});
  assert.equal(dom.window.document.querySelector('link[rel="canonical"]').href,origin+'/'+to);
  assert(read('dist/_redirects').includes('/'+from+' /'+to+' 301'));
  dom.window.close();
}
for(const [entry,expected] of [['/platform?growth=convert-close','/platform?growth=convert-close'],['/platform/?growth=convert-close','/platform?growth=convert-close'],['/#/platform?growth=reactivate','/platform?growth=reactivate'],['/#/platform/unified-conversations','/inbox'],['/who-its-for/b2b','/consultative-sales'],['/crm/','/crm'],['/crm/index.html','/crm']]){
  const dom=renderPage(shell,origin,entry,{navigation:true});const {window:w}=dom;
  assert.equal(w.location.pathname+w.location.search,expected,entry);
  assert.equal(w.document.querySelector('link[rel="canonical"]').href,origin+expected.split('?')[0]);
  assert.equal(w.document.querySelectorAll('main h1').length,1);
  if(entry.includes('growth='))assert(w.document.querySelector('[data-route-landing]'));
  dom.window.close();
}
const live=renderPage(shell,origin,'/platform',{navigation:true}),w=live.window;
const wait=()=>new Promise(resolve=>setTimeout(resolve,120));
await wait();
let selected=w.document.querySelector('[data-growth-stage="2"]');selected.click();
const crmLink=w.document.querySelector('a[href="/crm"]');assert(crmLink);crmLink.click();await wait();
assert.equal(w.location.pathname,'/crm');assert.match(w.document.title,/CRM & Sales Pipeline/);
assert.equal(w.document.querySelector('meta[property="og:url"]').content,origin+'/crm');
w.history.back();await wait();assert.equal(w.location.pathname,'/platform');
assert.equal(w.document.querySelector('[data-growth-stage="2"]').getAttribute('aria-pressed'),'true');
w.history.forward();await wait();assert.equal(w.location.pathname,'/crm');
w.location.hash='#/reporting';await wait();assert.equal(w.location.pathname,'/reporting');assert.equal(w.location.hash,'');
assert.match(w.document.title,/Reporting & Forecasting/);
const fresh=renderPage(read('dist/reporting/index.html'),origin,'/reporting',{navigation:true});
assert.equal(fresh.window.document.querySelectorAll('main h1').length,1);fresh.window.close();
w.history.pushState(null,'','/missing-preview-route');w.dispatchEvent(new w.PopStateEvent('popstate'));await wait();
assert.match(w.document.querySelector('h1').textContent,/That page is not here/);assert(!w.document.querySelector('link[rel="canonical"]'));
live.window.close();
console.log(`Search checks passed: ${manifest.pages.length} no-JS documents, ${linkCount} clean internal links, all local assets, unique metadata, conservative schema, 13 legacy fallbacks, noindex safeguards, explicit 404, clean/hash direct entry, reload and Back/Forward state.`);
