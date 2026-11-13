import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {JSDOM,VirtualConsole} from 'jsdom';
export function renderPage(html, origin, path, {navigation=false}={}) {
  const errors=[];
  const virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',error=>{if(error.type!=='not-implemented')errors.push(error.message);});
  const dom=new JSDOM(html,{url:origin+path,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
  const w=dom.window;
  w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  w.scrollTo=()=>{};
  w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.requestAnimationFrame=navigation?callback=>w.setTimeout(()=>callback(w.performance.now()),0):()=>0;
  w.cancelAnimationFrame=()=>{};
  w.IntersectionObserver=class{observe(){} unobserve(){} disconnect(){}};
  w.ResizeObserver=class{observe(){} unobserve(){} disconnect(){}};
  w.setInterval=()=>0;w.clearInterval=()=>{};
  const scriptNames=[...w.document.querySelectorAll('script[src]')].filter(s=>!["https://widgets.leadconnectorhq.com/loader.js","https://grow.ayudagrow.com/js/form_embed.js"].includes(s.getAttribute("src"))).map(s=>s.getAttribute('src').split('?')[0].replace(/^\//,''));
  for(const name of scriptNames){if(!navigation&&/^navigation(?:\.[a-f0-9]{12})?\.js$/.test(name))continue;vm.runInContext(readFileSync(new URL('../dist/'+name,import.meta.url),'utf8'),dom.getInternalVMContext(),{filename:name});}
  w.AyudaSearch.cleanLinks();
  if(errors.length)throw new Error(errors.join('\n'));
  return dom;
}
