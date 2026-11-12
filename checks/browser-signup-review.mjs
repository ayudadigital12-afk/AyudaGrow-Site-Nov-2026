/* Isolated CI browser. Read-only checks: never fill or submit a form or payment. */
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,openSync} from 'node:fs';
const root=process.cwd();mkdirSync('qa',{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{windowsHide:true,stdio:'ignore'});
const chrome=spawn(process.env.CHROME_BIN||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--remote-debugging-port=9334','--user-data-dir='+root+'/qa/signup-chrome-profile','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-extensions','--disable-sync','--disable-component-update','--disable-gpu','about:blank'],{windowsHide:true,stdio:['ignore','ignore',openSync('qa/signup-chrome.log','w')]});
let sock,seq=0;const pending=new Map(),results=[],external=[];
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function command(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});sock.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(new Error('Timeout '+method));}},20000).unref();});}
const evaluate=async expression=>{const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
async function visit(url){await command('Page.navigate',{url});for(let i=0;i<120;i++){try{if(await evaluate('location.href.startsWith('+JSON.stringify(url)+') && document.readyState!=="loading" && !!document.body'))return;}catch{}await delay(250);}throw Error('Page not ready '+url);}
const forms={essentials:'CkmLMXN55hD2X9hCfO4j',core:'65wBICRDMlJ7RTZPK3dG',build:'XidHogjcgDQ48zVVZKSz',scale:'abrMomyu1JJgrxPvWYLh'};
const stripe={essentials:'9B68wP6kD7pBdHf1yb0480l',core:'eVq5kDaAT25hgTr5Or0480m',build:'bJe14ngZh4dpeLjgt50480n',scale:'eVq14neR9aBNgTrccP0480o'};
try{
 let tabs;for(let i=0;i<100;i++){try{tabs=await fetch('http://127.0.0.1:9334/json').then(r=>r.json());break;}catch{await delay(200);}}
 assert(tabs);sock=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>sock.addEventListener('open',r,{once:true}));
 sock.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}});
 await command('Page.enable');await command('Runtime.enable');await command('Network.enable');await command('Network.setBlockedURLs',{urls:['https://widgets.leadconnectorhq.com/*']});
 for(const [plan,id] of Object.entries(forms)){
  for(const width of [1440,390]){
   await command('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
   await visit('http://127.0.0.1:4173/signup/'+plan);
   for(let i=0;i<120;i++){if(await evaluate('(()=>{const f=document.querySelector("iframe[data-iframe-resizer-initialized]");return !!f&&getComputedStyle(f).visibility!=="hidden"&&f.getBoundingClientRect().height>100})()'))break;await delay(250);}
   await evaluate('document.fonts.ready.then(()=>true)');
   const data=await evaluate(`(()=>{const f=document.querySelector('iframe'),r=f.getBoundingClientRect(),s=document.querySelector('.ag-purchase-summary').getBoundingClientRect(),c=document.querySelector('.ag-purchase-form-card').getBoundingClientRect();return {title:document.title,bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,src:f.src,frameHeight:r.height,frameWidth:r.width,frameVisible:getComputedStyle(f).visibility!=='hidden'&&r.height>100,initialized:f.getAttribute('data-iframe-resizer-initialized'),loaderCount:document.querySelectorAll('script[src^="https://grow.ayudagrow.com/js/form_embed.js"]').length,columns:s.right<=c.left+1,stacked:s.bottom<=c.top+1,h1:document.querySelector('h1').textContent}})()`);
   assert(data.bodyWidth<=width+1,plan+' page overflow');assert(data.src.includes(id));assert.equal(data.loaderCount,1);assert(width<600?data.stacked:data.columns);
   const metrics=await command('Page.getLayoutMetrics');const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.min(metrics.cssContentSize.height,2200),scale:1}});writeFileSync(`qa/signup-${plan}-${width}.png`,Buffer.from(shot.data,'base64'));results.push({plan,width,...data});
  }
 }
 // Exercise actual pricing navigation using a full document load into the chosen form.
 await visit('http://127.0.0.1:4173/pricing');await evaluate('document.querySelector("[data-select-plan=build]").click()');
 for(let i=0;i<60;i++){if(await evaluate('location.pathname==="/signup/build" && !!document.querySelector("[data-signup-plan=build]")'))break;await delay(200);}
 assert.equal(await evaluate('document.querySelector("iframe").dataset.formId'),forms.build);
 for(const [plan,id] of Object.entries(forms)){
  await command('Emulation.setDeviceMetricsOverride',{width:1100,height:900,deviceScaleFactor:1,mobile:false});
  await visit('https://grow.ayudagrow.com/widget/form/'+id);await delay(2200);
  external.push({plan,type:'form',...(await evaluate('({url:location.href,text:document.body.innerText.slice(0,3000),fields:[...document.querySelectorAll("input")].map(x=>({type:x.type,name:x.name,required:x.required,placeholder:x.placeholder}))})'))});
  await visit('https://buy.stripe.com/'+stripe[plan]);
  for(let i=0;i<70;i++){if(await evaluate('document.body.innerText.length>100'))break;await delay(300);}
  external.push({plan,type:'stripe',...(await evaluate('({url:location.href,title:document.title,text:document.body.innerText.slice(0,7000)})'))});
  const shot=await command('Page.captureScreenshot',{format:'png'});writeFileSync('qa/stripe-'+plan+'.png',Buffer.from(shot.data,'base64'));
 }
 console.log(JSON.stringify({results,external},null,2));
 for(const r of results){assert(r.frameVisible,r.plan+' visible form at '+r.width);assert.equal(r.initialized,'true',r.plan+' embed initialised');}
}finally{
 writeFileSync('qa/signup-browser-results.json',JSON.stringify({results,external},null,2));sock?.close();chrome.kill();server.kill();
}
