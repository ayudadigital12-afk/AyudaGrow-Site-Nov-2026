import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync,openSync,readFileSync} from 'node:fs';
const root=process.cwd();
mkdirSync(root+'/qa',{recursive:true});
const project=root;
const server=spawn(process.execPath,['--import','./scripts/offline-guard.mjs','scripts/serve.mjs'],{cwd:project,windowsHide:true,stdio:'inherit'});
const chromeLog=openSync(root+'/qa/chrome-startup.log','w');
const chrome=spawn(process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9333','--user-data-dir='+root+'/qa/chrome-profile','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-extensions','--disable-sync','--disable-component-update','--disable-gpu','--disable-features=OptimizationHints,MediaRouter','about:blank'],{windowsHide:true,stdio:['ignore','ignore',chromeLog]});
let sock,seq=0;const pending=new Map(),errors=[];
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function command(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});sock.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(new Error('Timeout '+method));}},15000).unref();});}
try{
 let tabs;for(let i=0;i<150;i++){try{tabs=await fetch('http://127.0.0.1:9333/json').then(r=>r.json());break;}catch{await delay(200);}}
 if(!tabs)throw new Error('Chrome startup unavailable: '+readFileSync(root+'/qa/chrome-startup.log','utf8'));
 sock=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>sock.addEventListener('open',r,{once:true}));
 sock.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(JSON.stringify(m.error))):p.resolve(m.result);}}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+m.params.exceptionDetails.exception?.description);});
 await command('Page.enable');await command('Runtime.enable');await command('Network.enable');
 await command('Network.setBlockedURLs',{urls:['https://*']});
 const evaluate=async expression=>{const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 const results=[];
 for(const test of [{path:'/',width:1366,height:768,name:'home-desktop'},{path:'/',width:390,height:844,name:'home-mobile'},{path:'/pricing',width:1440,height:900,name:'pricing-desktop'},{path:'/pricing',width:390,height:844,name:'pricing-mobile'},{path:'/get-started?plan=build',width:1366,height:768,name:'signup-growth'}]){
  await command('Emulation.setDeviceMetricsOverride',{width:test.width,height:test.height,deviceScaleFactor:1,mobile:test.width<600});
  const destination='http://127.0.0.1:4173'+test.path;
  const health=await fetch(destination);assert.equal(health.status,200,'Local preview HTTP response');
  const navigation=await command('Page.navigate',{url:destination});assert(!navigation.errorText,'Browser navigation failed: '+navigation.errorText);
  let ready=false;for(let attempt=0;attempt<100;attempt++){ready=await evaluate('location.href==='+JSON.stringify(destination)+' && document.readyState==="complete" && !!document.querySelector("main h1")');if(ready)break;await delay(200);}
  assert(ready,'The requested page did not finish loading');await evaluate('document.fonts.ready.then(()=>true)');
  const data=await evaluate(`(()=>{const rect=s=>{const n=document.querySelector(s);if(!n)return null;const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,width:r.width}};return {title:document.title,viewport:innerWidth,bodyWidth:document.documentElement.scrollWidth,head:rect('header'),hero:rect('.hero'),context:rect('.ag-service-context'),brokenImages:[...document.querySelectorAll('img')].filter(x=>x.loading!=='lazy'&&(!x.complete||!x.naturalWidth)).map(x=>x.src),sections:[...document.querySelectorAll('main>section')].map(x=>({class:x.className,height:Math.round(x.getBoundingClientRect().height)})),cards:[...document.querySelectorAll('.plan-card')].map(x=>({height:x.getBoundingClientRect().height,usageTop:x.querySelector('.pricing-usage').getBoundingClientRect().top})),text:document.querySelector('main h1')?.textContent}})()`);
  if(test.path==='/'){
   data.interactions=await evaluate(`(()=>{const pieces=[...document.querySelectorAll('[data-ag-piece]')];let ok=0;pieces.forEach(b=>{b.dispatchEvent(new PointerEvent('pointerover',{bubbles:true,pointerType:'mouse'}));if(document.querySelector('[data-ag-context-title]').textContent===b.querySelector('strong').textContent)ok++});document.querySelector('[data-problem="1"]').click();const follow=document.querySelector('#ag-problem-panel').textContent;document.querySelector('[data-problem="1"]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));const keyboard=document.activeElement.dataset.problem;let growth=0;document.querySelectorAll('[data-growth-stage]').forEach(b=>{b.click();if(b.getAttribute('aria-pressed')==='true')growth++});return {puzzleHover:ok,problemClick:follow.includes('A quote sent'),problemKeyboard:keyboard,growthStages:growth,apps:document.querySelectorAll('.ch-app-card:not([aria-hidden="true"])').length}})()`);
  }
  if(test.path==='/pricing'){
    data.pricing=await evaluate('(()=>{const initialGroups=[...document.querySelectorAll("[data-feature-group]")].map(g=>g.querySelectorAll("[data-feature-id]:not([hidden])").length);const exits=[...document.querySelectorAll("a[href]")].filter(a=>{const u=new URL(a.href);return a.getClientRects().length&&!a.href.startsWith("mailto:")&&!(u.origin===location.origin&&u.pathname===location.pathname&&u.hash);});const cells=[...document.querySelectorAll(".plan-table td")].filter(n=>n.getClientRects().length);return {initialGroups,exits:exits.map(a=>a.href),cellPadding:parseFloat(getComputedStyle(cells[0]).paddingTop)}})()');
    assert(data.pricing.initialGroups.every(n=>n<=4));assert.equal(data.pricing.exits.length,0);assert(data.pricing.cellPadding<=8);
    await evaluate('document.querySelector("[data-billing=annual]").click();document.querySelector("[data-select-plan=build]").click()');
    const annual=await evaluate('({prices:[...document.querySelectorAll(".plan-price strong")].map(n=>n.textContent),email:decodeURIComponent(document.querySelector("[data-signup-email]").href),path:location.pathname})');
    assert.deepEqual(annual.prices,['US$990','US$1,490','US$2,490','US$3,490']);assert(annual.email.includes('Build (annual)'));assert.equal(annual.path,'/pricing');
    await evaluate('document.querySelector("[data-select-trial]").click()');
    assert.equal(await evaluate('document.querySelector("[data-billing=monthly]").getAttribute("aria-pressed")'),'true');
    await evaluate('document.querySelector("[data-select-demo]").click()');
    assert((await evaluate('decodeURIComponent(document.querySelector("[data-signup-email]").href)')).includes('demo request'));
    await evaluate('document.querySelector("[data-group-toggle]").focus()');await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
    assert.equal(await evaluate('document.querySelector("[data-group-toggle]").getAttribute("aria-expanded")'),'true');
    await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await command('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    assert.equal(await evaluate('document.querySelector("[data-group-toggle]").getAttribute("aria-expanded")'),'false');
    await evaluate('document.querySelector("[data-open-privacy]").click()');assert.equal(await evaluate('document.querySelector("#ag-pricing-privacy").open'),true);
    assert.equal(await evaluate('document.querySelectorAll("main h1").length'),1);
    await evaluate('document.querySelector("[data-close-privacy]").click();document.querySelector("[data-select-plan=build]").click();document.activeElement?.blur()');
    const remaining=await evaluate('[...document.querySelectorAll("main a[href]")].filter(a=>a.getClientRects().length&&!a.href.startsWith("mailto:")).map(a=>a.href)');assert.deepEqual(remaining,[]);
    data.pricing.annualSignup=true;data.pricing.trial=true;data.pricing.demo=true;data.pricing.keyboard=true;data.pricing.privacy=true;
  }

  await evaluate('(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}window.scrollTo(0,0);await new Promise(r=>setTimeout(r,200));})()');
  await evaluate('Promise.all([...document.images].map(img=>{img.loading="eager";return img.decode().catch(()=>{});})).then(()=>{document.activeElement?.blur();return true;})');
  data.brokenImages=await evaluate('[...document.images].filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src)');
  data.logoSizes=await evaluate('[...document.querySelectorAll(".ch-app-logo img")].slice(0,3).map(img=>({naturalWidth:img.naturalWidth,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height}))');
  const metrics=await command('Page.getLayoutMetrics');const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:test.width,height:Math.min(metrics.cssContentSize.height,11000),scale:1}});writeFileSync(root+'/qa/'+test.name+'.png',Buffer.from(shot.data,'base64'));
  results.push({...test,...data});
 }
 const output={results,errors};writeFileSync(root+'/qa/browser-results.json',JSON.stringify(output,null,2));console.log(JSON.stringify(output));
 assert.equal(errors.length,0,'No browser runtime errors');
 for(const r of results){assert(r.bodyWidth<=r.viewport+1,r.name+' has horizontal page overflow');assert.equal(r.brokenImages.length,0,r.name+' has broken images');if(r.path==='/'){assert.equal(r.interactions.puzzleHover,12);assert.equal(r.interactions.problemKeyboard,'2');assert.equal(r.interactions.growthStages,5);assert.equal(r.interactions.apps,34);}if(r.name==='home-desktop')assert(r.context.bottom<=r.height,'Puzzle description should fit above the fold');if(r.name==='pricing-desktop')assert(Math.max(...r.cards.map(c=>c.usageTop))-Math.min(...r.cards.map(c=>c.usageTop))<=1,'Pricing usage panels align');}
 await command('Browser.close');
}catch(error){
 console.error('Browser exceptions:',JSON.stringify(errors));
 if(sock?.readyState===1){try{const state=await command('Runtime.evaluate',{expression:'JSON.stringify({url:location.href,title:document.title,text:document.body.innerText.slice(0,1500),scripts:[...document.scripts].map(s=>s.src)})',returnByValue:true});console.error('Browser state:',state.result.value);writeFileSync(root+'/qa/failure.html',(await command('Runtime.evaluate',{expression:'document.documentElement.outerHTML',returnByValue:true})).result.value);const s=await command('Page.captureScreenshot',{format:'png'});writeFileSync(root+'/qa/failure.png',Buffer.from(s.data,'base64'));}catch{}}
 throw error;
}finally{sock?.close();chrome.kill();server.kill();}
