/** Artifact regression gate, NOT permission to publish. Run after npm run build.
 * No network/browser is used. Legal accuracy, service availability, pricing approval,
 * visual accessibility and production hosting still require separate human review.
 */
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,relative as nativeRelative,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM,VirtualConsole} from 'jsdom';
import vm from 'node:vm';
import {renderPage} from '../scripts/render-page.mjs';
const relative=(...args)=>nativeRelative(...args).split(sep).join('/');
const root=fileURLToPath(new URL('..',import.meta.url)),dist=resolve(root,'dist');
const read=p=>readFileSync(resolve(root,p),'utf8');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);
const failures=[];
function check(label,fn){try{fn();}catch(e){failures.push(label+': '+e.message);}}
const normalize=s=>s.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\s+/g,' ').trim();
const decoder=new JSDOM('<!doctype html><textarea></textarea>');
function decoded(s){
  const box=decoder.window.document.querySelector('textarea');
  for(let i=0;i<3;i++){
    box.innerHTML=s;s=box.value;
    s=s.replace(/\\u\{([\da-f]+)\}|\\u([\da-f]{4})|\\x([\da-f]{2})/gi,(_,a,b,c)=>String.fromCodePoint(parseInt(a||b||c,16)));
    s=s.replace(/(?:%[\da-f]{2})+/gi,t=>{try{return decodeURIComponent(t);}catch{return t;}});
  }
  return normalize(s);
}
// Also inspect raw bytes in otherwise binary assets for embedded labels/metadata.
const forbidden=[
  /go[\s_-]*high[\s_-]*level/i,/\bhigh[\s_-]*level\b/i,/\bghl\b/i,/lead[\s_-]*connector/i,
  /msgsndr\.(?:com|net)|gohighlevel\.(?:com|io)|highlevel\.com/i,
  /reviewbar|ai-concepts/i,
  /design concept\s*0?1|working copy|design concept,? not a live service|private creative review|private pricing review/i,
  /(?:privacy|pricing) review draft/i
];
const approvedWidget="<script defer src=\"https://widgets.leadconnectorhq.com/loader.js\" data-resources-url=\"https://widgets.leadconnectorhq.com/chat-widget/loader.js\" data-widget-id=\"6adbe6959f0ad5b6ad0a7a22\"></script>";
function clean(s,label){s=s.replaceAll(approvedWidget,'').replaceAll(approvedWidget.replace('<script defer ','<script defer="" '),'');for(const pattern of forbidden)assert(!pattern.test(s),`${label} contains ${pattern}`);}
// Guard the guard: encoded names, URL variants and split DOM text must be rejected.
for(const fixture of ['GHL','GoHighLevel','Go&#72;ighLevel','Go%48ighLevel','Go\\u0048ighLevel','High\u200BLevel','https://api.leadconnectorhq.com','/ai-concepts','reviewbar']){
  assert.throws(()=>clean(decoded(fixture),'fixture'),undefined,'Detector missed '+fixture);
}
clean(decoded('Illustrative conversations. Customer reviews. SIL OPEN FONT LICENSE.'),'allowed fixture');
const manifest=JSON.parse(read('build/route-manifest.json')),origin=manifest.origin;
const expected=['/signup/essentials','/signup/core','/signup/build','/signup/scale','/','/platform','/solutions','/inbox','/ai','/crm','/appointments','/consultative-sales','/use-cases','/lead-capture','/follow-up','/reactivation','/automation','/reporting','/reputation','/integrations','/marketing','/commerce','/learning','/support','/pricing','/privacy','/get-started','/contact','/growth-assessment','/learn','/solutions/book-more-appointments','/solutions/convert-more-leads','/solutions/generate-more-reviews','/solutions/improve-customer-communication','/solutions/improve-sales-follow-up','/solutions/manage-sales-opportunities','/solutions/reactivate-customers'];
const aliases={'platform/unified-conversations':'inbox','platform/follow-up-automation':'follow-up','platform/customer-reactivation':'reactivation','platform/crm-sales-pipeline':'crm','platform/lead-capture':'lead-capture','platform/appointments':'appointments','platform/reputation-reviews':'reputation','platform/reporting-forecasting':'reporting','who-its-for':'use-cases','who-its-for/b2b':'consultative-sales','who-its-for/b2c':'appointments','how-it-works':'support','free-trial':'get-started'};
const approvedFormAssets=new Set(['https://grow.ayudagrow.com/js/form_embed.js',...['CkmLMXN55hD2X9hCfO4j','65wBICRDMlJ7RTZPK3dG','XidHogjcgDQ48zVVZKSz','abrMomyu1JJgrxPvWYLh'].map(id=>'https://grow.ayudagrow.com/widget/form/'+id)]);
const routes=new Set(expected),approvedContacts=new Set(['mailto:admin@ayudagrow.com','tel:+18764800413']);
check('manifest',()=>{
  assert.equal(origin,'https://ayudagrow.com');assert.equal(manifest.pages.length,37);
  assert.deepEqual(manifest.pages.map(p=>p.path).sort(),[...expected].sort());
  assert.equal(manifest.mode,'private-preview');assert.equal(manifest.publicLaunchApproved,false);
  assert.equal(manifest.indexing,'noindex,nofollow');
  for(const p of manifest.pages){assert.equal(p.indexable,false);assert.equal(p.canonical,origin+p.path);}
});
const files=walk(dist);
for(const file of [...files,...walk(resolve(root,'source'))]){
  const label=relative(root,file),buffer=readFileSync(file);
  const textual=/\.(?:html|js|mjs|css|json|xml|svg|txt|map|webmanifest)$/i.test(file)||!extname(file);
  const data=textual?buffer.toString('utf8'):(buffer.toString('latin1').match(/[\x20-\x7e]{24,}/g)||[]).join('\n');
  check(label+' white label',()=>{clean(decoded(label),label);clean(decoded(data),label);});
  if(extname(file)==='.css'){
    for(const [,ref] of data.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi))check(label+' CSS asset '+ref,()=>asset(ref,origin+'/'+relative(file.startsWith(resolve(root,'source/public')+sep)?resolve(root,'source/public'):dist,file)));
  }
}
const pageFile=p=>p==='/'?'dist/index.html':`dist${p}/index.html`;
const expectedHtml=[...expected.map(p=>pageFile(p).slice(5)),...Object.keys(aliases).map(p=>p+'/index.html'),'404.html'].sort();
check('exact generated HTML inventory',()=>assert.deepEqual(files.filter(p=>extname(p)==='.html').map(p=>relative(dist,p)).sort(),expectedHtml));
function asset(ref,base){
  if(ref.startsWith('data:')){assert(/^data:image\//i.test(ref),'Only image data URLs are expected');return;}
  const url=new URL(ref,base);if(url.href==='https://widgets.leadconnectorhq.com/loader.js'||approvedFormAssets.has(url.href))return;assert.equal(url.origin,origin,'Unexpected remote asset '+url.href);
  const file=resolve(dist,'.'+decodeURIComponent(url.pathname));
  assert(file.startsWith(dist+sep),'Asset escapes dist');assert(existsSync(file)&&statSync(file).isFile(),'Missing asset '+url.pathname);
}
function inspect(d,path,canonical,{error=false}={}){
  const label=path;
  clean(decoded(d.documentElement.outerHTML),label+' HTML');clean(decoded(d.body.textContent),label+' decoded text');
  assert.equal(d.querySelectorAll('h1').length,1,label+' one h1');assert(d.querySelector('main h1'),label+' h1 is in main');
  assert(d.querySelector('main').textContent.trim().length>40);
  assert.equal(d.querySelectorAll('form,object,embed,[action],[formaction],input[type="password"],input[autocomplete^="cc-"]').length,0,label+' no native submission or card fields');
  const frames=[...d.querySelectorAll('iframe')];assert.equal(frames.length,canonical?.startsWith('/signup/')?1:0);frames.forEach(f=>assert(approvedFormAssets.has(f.src),'Only the four approved signup forms may be embedded'));
  assert.equal(d.querySelectorAll('meta[name="robots"]').length,1);assert.equal(d.querySelector('meta[name="robots"]').content,'noindex,nofollow');
  if(error){assert.equal(d.querySelectorAll('link[rel="canonical"]').length,0);}
  else{
    assert.equal(d.querySelectorAll('link[rel="canonical"]').length,1);assert.equal(d.querySelector('link[rel="canonical"]').href,origin+canonical);
    for(const selector of ['meta[property="og:title"]','meta[name="twitter:title"]'])assert.equal(d.querySelector(selector)?.content,d.title,label+' '+selector);
    assert.equal(d.querySelector('meta[property="og:url"]')?.content,origin+canonical);
    const page=manifest.pages.find(p=>p.path===canonical);assert(page);
    assert.equal(d.title,page.title);assert.equal(d.querySelector('meta[name="description"]')?.content,page.description);
    assert(page.description.length>70);
    const scripts=d.querySelectorAll('script[type="application/ld+json"]');assert.equal(scripts.length,1);
    const schema=JSON.parse(scripts[0].textContent);assert.equal(schema['@context'],'https://schema.org');
    assert(schema['@graph'].some(n=>n['@type']==='WebPage'&&n.url===origin+canonical));
    for(const key of ['aggregateRating','review','offers','price','address','email','telephone','legalName','sameAs'])assert(!JSON.stringify(schema).includes('"'+key+'"'),'Unsupported schema assertion '+key);
  }
  for(const a of d.querySelectorAll('a[href],area[href]')){
    const raw=a.getAttribute('href'),url=new URL(raw,d.baseURI);
    assert(!raw.startsWith('#/'),'Legacy hash link '+raw);
    if(['mailto:','tel:','sms:'].includes(url.protocol)){
      assert(approvedContacts.has(raw.split('?')[0]),'Unapproved contact '+raw);
      if(url.search)assert(url.protocol==='mailto:'&&[...url.searchParams.keys()].every(k=>['subject','body'].includes(k)),'Unexpected contact parameters');
    }
    else{
      assert(['https:','http:'].includes(url.protocol),'Unsafe link '+raw);
      if(url.origin===origin){
        assert(routes.has(url.pathname)||(error&&url.hash==='#main'),'Unknown internal route '+raw);
        if(url.hash&&url.pathname===canonical)assert(d.getElementById(decodeURIComponent(url.hash.slice(1))),'Missing fragment '+raw);
      }else assert(url.hostname==='support.google.com'||approvedFormAssets.has(url.href),'Unapproved outbound destination '+url.href);
    }
  }
  for(const el of d.querySelectorAll('[src],[poster],link[href],image[href],use[href],image[xlink\\:href],use[xlink\\:href]')){
    if(el.matches('link[rel="canonical"]'))continue;
    const ref=el.getAttribute('src')||el.getAttribute('poster')||el.getAttribute('href')||el.getAttribute('xlink:href');
    if(ref?.startsWith('#')){assert(d.getElementById(ref.slice(1)),'Missing SVG target '+ref);continue;}
    if(ref)asset(ref,d.baseURI);
  }
  for(const css of [...d.querySelectorAll('style')].map(el=>el.textContent).concat([...d.querySelectorAll('[style]')].map(el=>el.getAttribute('style')))){
    for(const [,ref] of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi))asset(ref,d.baseURI);
  }
  for(const el of d.querySelectorAll('[srcset]'))for(const candidate of el.getAttribute('srcset').split(','))asset(candidate.trim().split(/\s+/)[0],d.baseURI);
  assert.equal(d.querySelectorAll('#motion').length,0,'Header motion button must be removed');
  
}

// Mutate independent in-memory documents: the gate must reject plausible regressions
// rather than merely recognize today's copy. Nothing on disk is changed.
check('mutation rejection',()=>{
  const mutations=[
    d=>{d.querySelector('main').append(d.createElement('h1'));},
    d=>{d.querySelector('main').append(d.createElement('form'));},
    d=>{d.querySelector('main').insertAdjacentHTML('beforeend','<p>Go<span>High</span>Level</p>');},
    d=>{d.querySelector('main').insertAdjacentHTML('beforeend','<a href="/missing-route">Broken route</a>');},
    d=>{d.querySelector('main').insertAdjacentHTML('beforeend','<img src="/missing-image.webp" alt="Example">');},
    d=>{d.querySelector('main').insertAdjacentHTML('beforeend','<a href="mailto:other@example.com">Contact</a>');},
    d=>{d.querySelector('main').insertAdjacentHTML('beforeend','<a href="javascript:alert(1)">Bad link</a>');},
    d=>{d.querySelector('meta[name="robots"]').content='index,follow';},
    d=>{d.querySelector('link[rel="canonical"]').href=origin+'/crm';},
    d=>{d.querySelector('meta[property="og:title"]').content='Stale title';},
    d=>{const el=d.querySelector('script[type="application/ld+json"]'),v=JSON.parse(el.textContent);v['@graph'][0].offers={price:'149'};el.textContent=JSON.stringify(v);},
    d=>{const button=d.createElement('button');button.id='motion';d.body.append(button);}
  ];
  for(const [i,mutate] of mutations.entries()){
    const dom=new JSDOM(read('dist/index.html'),{url:origin+'/'});
    try{inspect(dom.window.document,'/','/');mutate(dom.window.document);assert.throws(()=>inspect(dom.window.document,'/','/'),undefined,'Mutation '+i+' escaped');}
    finally{dom.window.close();}
  }
});

const textMain=d=>normalize(d.querySelector('main').textContent);
const staticText=new Map();
for(const page of manifest.pages){
  const path=page.path;
  check(path+' static and hydrated',()=>{
    const html=read(pageFile(path)),staticDom=new JSDOM(html,{url:origin+path});
    let hydrated;
    try{
      inspect(staticDom.window.document,path,path);staticText.set(path,textMain(staticDom.window.document));
      hydrated=renderPage(html,origin,path,{navigation:true});
      inspect(hydrated.window.document,path,path);
      assert.equal(textMain(hydrated.window.document),staticText.get(path),'Hydration changed meaningful page content');
      assert.equal(hydrated.window.location.pathname,path);
    }finally{staticDom.window.close();hydrated?.window.close();}
  });
}
check('unique metadata',()=>{assert.equal(new Set(manifest.pages.map(p=>p.title)).size,37);assert.equal(new Set(manifest.pages.map(p=>p.description)).size,37);});
for(const [from,to] of Object.entries(aliases))check('alias '+from,()=>{
  const html=read('dist/'+from+'/index.html'),dom=new JSDOM(html,{url:origin+'/'+from});
  let live;
  try{inspect(dom.window.document,'/'+from,'/'+to);assert.equal(textMain(dom.window.document),staticText.get('/'+to));
    live=renderPage(html,origin,'/'+from,{navigation:true});assert.equal(live.window.location.pathname,'/'+to);assert.equal(textMain(live.window.document),staticText.get('/'+to));
    assert(read('dist/_redirects').split('\n').includes('/'+from+' /'+to+' 301'));
  }finally{dom.window.close();live?.window.close();}
});
check('staging safeguards',()=>{assert.match(read('dist/robots.txt'),/User-agent: \*\s+Disallow: \/\s/);assert(!read('dist/sitemap.xml').includes('<loc>'));assert.match(read('dist/_headers'),/X-Robots-Tag: noindex, nofollow/);});
check('404 fallback',()=>{const dom=new JSDOM(read('dist/404.html'),{url:origin+'/missing'});try{inspect(dom.window.document,'/missing',null,{error:true});assert.match(dom.window.document.querySelector('h1').textContent,/That page is not here/);}finally{dom.window.close();}});
check('font license retained',()=>assert.match(read('dist/assets/fonts/OFL.txt'),/SIL OPEN FONT LICENSE/i));
check('motion CSS',()=>{const css=files.filter(f=>extname(f)==='.css').map(f=>readFileSync(f,'utf8')).join('\n');assert.match(css,/@media\s*\(prefers-reduced-motion\s*:\s*reduce\)/);assert.match(css,/\.paused\s+\*\s*\{[^}]*animation-play-state\s*:\s*paused/);});
check('honest content boundaries',()=>{
  assert.match(staticText.get('/')||'',/illustrative/i);
  const privacy=staticText.get('/privacy')||'';
  assert.match(privacy,/not (?:yet )?(?:an? )?(?:effective |final |published )*production privacy notice|not a complete privacy notice|privacy notice.*(?:being finali[sz]ed|not yet final)|final privacy notice.*(?:pending|being prepared)/i,'Keep an explicit pending-notice boundary');
  assert.match(privacy,/confirm|finali[sz]|pending|not yet/i);
  assert(!/we (?:never|do not) (?:collect|store|share) (?:any )?(?:personal )?data/i.test(privacy),'Do not replace pending policy with invented guarantees');
  const pricing=staticText.get('/pricing')||'';assert.match(pricing,/confirm|agreed|scope/i);assert.match(pricing,/usage|allowance|additional|separate/i);
});

// The shared SSR helper intentionally forces reduced motion. This small equivalent
// runtime harness additionally exercises the ordinary interactive motion state.
function renderWithMotion(html,reduced){
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(e.type!=='not-implemented')errors.push(e.message);});
  const dom=new JSDOM(html,{url:origin+'/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window;
  const listeners=[];const preference={matches:reduced,addEventListener(type,fn){if(type==='change')listeners.push(fn);},removeEventListener(){}};
  w.matchMedia=()=>preference;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.requestAnimationFrame=fn=>w.setTimeout(()=>fn(w.performance.now()),0);w.cancelAnimationFrame=id=>w.clearTimeout(id);
  w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
  w.setInterval=()=>0;w.clearInterval=()=>{};
  for(const script of w.document.querySelectorAll('script[src]')){
    if(script.getAttribute('src')==='https://widgets.leadconnectorhq.com/loader.js')continue;
    const url=new URL(script.getAttribute('src'),w.location.href);asset(url.href,w.location.href);
    vm.runInContext(read('dist'+url.pathname),dom.getInternalVMContext(),{filename:url.pathname});
  }
  w.AyudaSearch.cleanLinks();assert.deepEqual(errors,[],'Runtime errors');
  dom.setReduced=value=>{preference.matches=value;for(const fn of listeners)fn({matches:value});};
  return dom;
}

const wait=()=>new Promise(r=>setTimeout(r,60));
let live;
try{
  live=renderWithMotion(read('dist/index.html'),false);const w=live.window;await wait();
  check('runtime aliases',()=>assert.deepEqual(JSON.parse(JSON.stringify(w.AyudaSearch.aliases)),aliases));
  const button=w.document.querySelector('#motion');
  check('header motion button removed',()=>assert.equal(button,null));
  // Match the deterministic reduced-motion SSR snapshot while traversing routes.
  live.setReduced(true);
  // Signup routes deliberately use full document navigation, covered by browser-signup-review.
  for(const path of expected.filter(p=>p!=='/'&&!p.startsWith('/signup/'))){
    const anchor=w.document.createElement('a');anchor.href=path;anchor.textContent='Regression navigation';w.document.body.append(anchor);anchor.click();anchor.remove();await wait();
    check(path+' SPA',()=>{assert.equal(w.location.pathname,path);inspect(w.document,path,path);assert.equal(textMain(w.document),staticText.get(path),'SPA content drift');assert.equal(w.document.querySelector('#motion'),button);assert(w.document.body.classList.contains('paused'));});
  }
  live.setReduced(false);
  check('ordinary motion',()=>assert(!w.document.body.classList.contains('paused')));
  check('device reduced motion preference',()=>{live.setReduced(true);assert(w.document.body.classList.contains('paused'));live.setReduced(false);assert(!w.document.body.classList.contains('paused'));});
  w.history.pushState(null,'','/ai-concepts');w.dispatchEvent(new w.PopStateEvent('popstate'));await wait();
  check('removed route is 404',()=>{assert.match(w.document.querySelector('h1').textContent,/That page is not here/);assert(!w.document.querySelector('link[rel="canonical"]'));});
}catch(e){failures.push('SPA runtime: '+e.stack);}finally{live?.window.close();decoder.window.close();}
if(failures.length){console.error('White-label artifact regressions ('+failures.length+'):\n'+failures.map(f=>' - '+f).join('\n'));process.exitCode=1;}
else console.log('White-label artifact PASS: 37 canonical pages, 13 aliases, 404, full shipped-file scan, clean links/assets/metadata/schema, static/hydrated/SPA parity, approved contacts, motion and noindex safeguards. NOT public-launch approval: privacy practices/final notice, pricing inclusions/terms, service claims, visual QA and hosting release remain separate review gates.');
