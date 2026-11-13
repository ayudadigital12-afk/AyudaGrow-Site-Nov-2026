import {normaliseAssetNames} from '../scripts/normalise-asset-names.mjs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../dist/navigation.js',import.meta.url),'utf8');
const events={},documentEvents={},frames=[];
let serial=0,position=0,renders=0;
const entries=[{url:'https://example.test/#/',state:null}];
let buttons=[],details=[],renderedRoute;
const location={};
for(const key of ['href','hash','origin','pathname','search'])Object.defineProperty(location,key,{get:()=>new URL(entries[position].url)[key]});
const main={children:[{getBoundingClientRect:()=>({top:400-c.scrollY,bottom:2400-c.scrollY,height:2000})}],setAttribute(){},focus(){document.activeElement=this;},querySelectorAll(selector){
  if(selector==='details')return details;
  if(selector==='[data-growth-stage]')return (renderedRoute==='#/'||renderedRoute.startsWith('#/platform'))?buttons:[];
  if(selector==='a,button,summary,input,select,textarea,[tabindex]')return buttons;
  return [];
},querySelector(selector){return selector==='[data-route-landing]'&&renderedRoute==='#/platform?growth=convert-close'?{getBoundingClientRect:()=>({top:600-c.scrollY}),closest:()=>main.children[0],querySelector:()=>buttons[2]}:null;}};
const document={getElementById:()=>main,activeElement:null,addEventListener:(key,fn)=>documentEvents[key]=fn};
const history={scrollRestoration:'auto',get state(){return entries[position].state},replaceState(state){entries[position].state=structuredClone(state)},pushState(state,title,url){entries.splice(position+1);entries.push({url,state:structuredClone(state)});position++;}};
function render(){renders++;renderedRoute=location.hash;buttons=Array.from({length:5},(_,i)=>({pressed:i===(renderedRoute==='#/platform?growth=convert-close'?2:0),getAttribute(name){return name==='aria-pressed'?String(this.pressed):null},click(){buttons.forEach(b=>b.pressed=b===this)},focus(){document.activeElement=this}}));details=[{open:false}];}
const window={addEventListener:(key,fn)=>events[key]=fn,removeEventListener(){},scrollTo({left,top}){c.scrollX=left;c.scrollY=top}};
const c={window,document,history,location,crypto:{randomUUID:()=>String(++serial)},URL,Map,scrollX:0,scrollY:0,requestAnimationFrame:fn=>frames.push(fn),render};
function flush(){while(frames.length)frames.shift()();}
function click(hash,extra={}){const link={href:'https://example.test/'+hash,target:'',hasAttribute:()=>false};const event={defaultPrevented:false,button:0,target:{closest:()=>link},preventDefault(){this.defaultPrevented=true},...extra};documentEvents.click(event);return event;}
function travel(delta){position+=delta;events.popstate();events.hashchange();}
render();vm.runInNewContext(source,c);flush();
assert.equal(history.scrollRestoration,'manual');
buttons[2].click();details[0].open=true;document.activeElement=buttons[2];c.scrollY=950;
click('#/appointments');flush();assert.equal(c.scrollY,0);assert.equal(location.hash,'#/appointments');
c.scrollY=520;travel(-1);flush();assert.equal(c.scrollY,950);assert(buttons[2].pressed);assert(details[0].open);assert.equal(document.activeElement,buttons[2]);
const afterBack=renders;events.hashchange();assert.equal(renders,afterBack,'duplicate hashchange must not reset a restored page');
travel(1);flush();assert.equal(c.scrollY,520,'Forward restores the destination position');
click('#/');flush();assert.equal(c.scrollY,0);assert(buttons[0].pressed,'a new Home visit is distinct from the earlier Home entry');
travel(-1);flush();assert.equal(c.scrollY,520);
travel(-1);flush();assert.equal(c.scrollY,950);assert(buttons[2].pressed);
assert.equal(click('#/crm',{ctrlKey:true}).defaultPrevented,false,'modified clicks remain native');
assert.equal(click('#main').defaultPrevented,false,'non-route anchors remain native');
click('#/reporting');travel(-1);flush();assert.equal(c.scrollY,950,'rapid traversal cancels stale restoration frames');
assert(buttons[2].pressed);
const html=normaliseAssetNames(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'));assert(html.indexOf('navigation.js')>html.indexOf('subpage-theme.js'));
assert(!readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').includes('window.scrollTo(0,0)'));
console.log('Navigation checks passed: entry-specific Back/Forward, scroll, tabs, disclosures, focus, independent repeat visits, duplicate-event suppression, rapid traversal and native modified/anchor clicks.');

click('#/platform?growth=convert-close');flush();assert.equal(c.scrollY,576);assert(buttons[2].pressed);assert.equal(document.activeElement,buttons[2]);c.scrollY=900;travel(-1);flush();assert.equal(c.scrollY,950);travel(1);flush();assert.equal(c.scrollY,900,'Forward restores a saved position instead of reapplying the entry anchor');
console.log('Context landing checks passed: new stage entry selects/focuses its stage and scrolls to the loop; history returns retain the saved position.');

