/* Illustrative business-tool connection examples.
 * These logos do not claim that an account has every connection enabled.
 * Provider-supplied marks are served unchanged; trademarks remain with their owners.
 * Exact asset provenance is recorded in source/integration-logo-provenance.json.
 */
const connectedApps = [
  [
    "Google Calendar",
    "googlecalendar"
  ],
  [
    "Google",
    "google"
  ],
  [
    "Facebook",
    "facebook"
  ],
  [
    "LinkedIn",
    "linkedin"
  ],
  [
    "TikTok Messaging",
    "tiktok"
  ],
  [
    "TikTok Lead Ads",
    "tiktok"
  ],
  [
    "WhatsApp Business",
    "whatsapp"
  ],
  [
    "Instagram",
    "instagram"
  ],
  [
    "Google Ads",
    "googleads"
  ],
  [
    "Xero",
    "xero"
  ],
  [
    "QuickBooks",
    "quickbooks"
  ],
  [
    "Wave",
    "wave"
  ],
  [
    "Slack",
    "slack"
  ],
  [
    "Clio",
    "clio"
  ],
  [
    "Canva",
    "canva"
  ],
  [
    "Google Business Profile",
    "googlemybusiness"
  ],
  [
    "WooCommerce",
    "woocommerce"
  ],
  [
    "Shopify",
    "shopify"
  ],
  [
    "Printful",
    "printful"
  ],
  [
    "Printify",
    "printify"
  ],
  [
    "Google Merchant Center",
    "merchant"
  ],
  [
    "Shippo",
    "shippo"
  ],
  [
    "ShipStation",
    "shipstation"
  ],
  [
    "ClickUp",
    "clickup"
  ],
  [
    "Notion",
    "notion"
  ],
  [
    "Airtable",
    "airtable"
  ],
  [
    "Google Contacts",
    "contacts"
  ],
  [
    "Asana",
    "asana"
  ],
  [
    "Basecamp",
    "basecamp"
  ],
  [
    "Typeform",
    "typeform"
  ],
  [
    "Jotform",
    "jotform"
  ],
  [
    "Meta Ads",
    "meta"
  ],
  [
    "ChatGPT",
    "openai"
  ],
  [
    "Claude",
    "claude"
  ]
];
/* Exact provider-supplied marks. Source provenance: source/integration-logo-provenance.json. */
const connectionLogoAssets = {
  "googlecalendar": [
    "/assets/integrations/googlecalendar-official.svg",
    192,
    192
  ],
  "google": [
    "/assets/integrations/google-official.png",
    40,
    40
  ],
  "facebook": [
    "/assets/integrations/facebook-official.ico",
    60,
    60
  ],
  "linkedin": [
    "/assets/integrations/linkedin-official.png",
    114,
    114
  ],
  "tiktok": [
    "/assets/integrations/tiktok-official.png",
    3052,
    3251
  ],
  "whatsapp": [
    "/assets/integrations/whatsapp-business-official.png",
    240,
    240
  ],
  "instagram": [
    "/assets/integrations/instagram-official.webp",
    180,
    180
  ],
  "googleads": [
    "/assets/integrations/googleads-official.svg",
    192,
    192
  ],
  "xero": [
    "/assets/integrations/xero-official.svg",
    144,
    144
  ],
  "quickbooks": [
    "/assets/integrations/quickbooks-official.png",
    152,
    152
  ],
  "wave": [
    "/assets/integrations/wave-official.png",
    256,
    256
  ],
  "slack": [
    "/assets/integrations/slack-official.png",
    35,
    34
  ],
  "clio": [
    "/assets/integrations/clio-official.svg",
    64,
    64
  ],
  "canva": [
    "/assets/integrations/canva-official.png",
    180,
    180
  ],
  "googlemybusiness": [
    "/assets/integrations/googlemybusiness-official.svg",
    192,
    192
  ],
  "woocommerce": [
    "/assets/integrations/woocommerce-official.png",
    192,
    192
  ],
  "shopify": [
    "/assets/integrations/shopify-official.png",
    120,
    120
  ],
  "printful": [
    "/assets/integrations/printful-official.png",
    32,
    32
  ],
  "printify": [
    "/assets/integrations/printify-official.png",
    301,
    300
  ],
  "merchant": [
    "/assets/integrations/merchant-official.svg",
    192,
    192
  ],
  "shippo": [
    "/assets/integrations/shippo-official.png",
    256,
    256
  ],
  "shipstation": [
    "/assets/integrations/shipstation-official.svg",
    180,
    180
  ],
  "clickup": [
    "/assets/integrations/clickup-official.png",
    192,
    192
  ],
  "notion": [
    "/assets/integrations/notion-official.png",
    512,
    512
  ],
  "airtable": [
    "/assets/integrations/airtable-official.ico",
    48,
    48
  ],
  "contacts": [
    "/assets/integrations/contacts-official.png",
    240,
    240
  ],
  "asana": [
    "/assets/integrations/asana-official.png",
    240,
    240
  ],
  "basecamp": [
    "/assets/integrations/basecamp-official.svg",
    32,
    32
  ],
  "typeform": [
    "/assets/integrations/typeform-official.png",
    256,
    256
  ],
  "jotform": [
    "/assets/integrations/jotform-official.png",
    180,
    180
  ],
  "meta": [
    "/assets/integrations/meta-official.svg",
    32,
    32
  ],
  "openai": [
    "/assets/integrations/openai-official.svg",
    180,
    180
  ],
  "claude": [
    "/assets/integrations/claude-official.svg",
    248,
    248
  ]
};
function connectionLogo(key) {
 const asset=connectionLogoAssets[key];
 if(!asset) throw new Error(`Missing verified connection logo: ${key}`);
 const [src,width,height]=asset;
 return `<img src="${src}" width="${width}" height="${height}" alt="" aria-hidden="true" decoding="async" loading="lazy">`;
}

function appCarouselCards(duplicate=false) {
 return connectedApps.map(([name,asset],index)=>`<article class="ch-app-card ch-brand-${asset}" ${duplicate?'aria-hidden="true" inert':`role="group" aria-roledescription="slide" aria-label="${index+1} of ${connectedApps.length}: ${name}"`}><div class="ch-app-brand"><span class="ch-app-logo">${connectionLogo(asset,(duplicate?'copy-':'original-')+index)}</span><h4>${name}</h4></div></article>`).join('');
}
let connectionCarouselCleanup=()=>{};
const carouselPriorWiring=wireExpanded;
wireExpanded=function(){
 connectionCarouselCleanup();
 carouselPriorWiring();
 const mount=document.getElementById('ch-app-carousel');
 if(!mount)return;
 mount.innerHTML=`<section class="ch-apps" aria-roledescription="carousel" aria-label="Business tool connection examples"><div class="ch-apps-head"><div><span class="eyebrow">Connections that fit your workflow</span><h3>Bring familiar tools into the picture.</h3></div><div class="ch-apps-controls"><button class="ch-app-pause" type="button" data-app-pause aria-controls="ch-app-cards" aria-pressed="false"><span aria-hidden="true">?</span> Pause carousel</button><button type="button" data-app-prev aria-label="Previous connection examples" aria-controls="ch-app-cards"></button><button type="button" data-app-next aria-label="Next connection examples" aria-controls="ch-app-cards"></button></div></div><div class="ch-app-viewport" id="ch-app-cards" tabindex="0" aria-label="Scroll through ${connectedApps.length} connection examples" aria-describedby="ch-app-help"><div class="ch-app-track">${appCarouselCards()}${appCarouselCards(true)}</div></div><div class="ch-apps-footer"><p id="ch-app-help">Scroll, swipe or use the arrows to explore.</p><span class="ch-app-progress" data-app-count aria-live="off">1 of ${connectedApps.length}</span><span class="ch-app-sr" data-app-status aria-live="polite"></span></div><p class="micro">Connection examples, not a claim that every app is enabled in your account. Logos identify the services; they do not imply endorsement.</p></section>`;
 const carousel=mount.querySelector('.ch-apps'),viewport=mount.querySelector('.ch-app-viewport'),track=mount.querySelector('.ch-app-track');
 const pause=mount.querySelector('[data-app-pause]'),count=mount.querySelector('[data-app-count]'),status=mount.querySelector('[data-app-status]');
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let userPaused=false,hovered=false,inView=false,frame=0,lastTime=0,position=0,destroyed=false,focused=false,resumeTimer=0,interacting=false;
 const globalPaused=()=>document.body.classList.contains('paused');
 const distance=()=>track.children[connectedApps.length].offsetLeft-track.children[0].offsetLeft;
 const step=()=>track.children[1].offsetLeft-track.children[0].offsetLeft;
 const active=()=>!destroyed&&inView&&!userPaused&&!hovered&&!focused&&!interacting&&!media.matches&&!globalPaused()&&!document.hidden;
 const updateButton=()=>{const locked=media.matches||globalPaused();pause.disabled=locked;pause.setAttribute('aria-pressed',String(locked||userPaused));pause.innerHTML=locked?'<span aria-hidden="true">?</span> Motion paused':userPaused?'<span aria-hidden="true">?</span> Resume carousel':'<span aria-hidden="true">?</span> Pause carousel';};
 const updateCount=()=>{const width=step();if(!width)return;const n=(Math.round(viewport.scrollLeft/width)%connectedApps.length)+1;count.textContent=`${n} of ${connectedApps.length}`;};
 const tick=time=>{frame=0;if(!mount.isConnected){cleanup();return;}if(!active()){lastTime=0;return;}if(lastTime){position+=Math.min(time-lastTime,60)*.026;const loop=distance();if(loop&&position>=loop)position-=loop;viewport.scrollLeft=position;updateCount();}lastTime=time;frame=requestAnimationFrame(tick);};
 const schedule=()=>{updateButton();if(active()&&!frame){position=viewport.scrollLeft;lastTime=0;frame=requestAnimationFrame(tick);}else if(!active()&&frame){cancelAnimationFrame(frame);frame=0;lastTime=0;}};
 const stop=()=>{interacting=true;clearTimeout(resumeTimer);schedule();resumeTimer=setTimeout(()=>{interacting=false;schedule();},6000);};
 const show=(n)=>{stop();const target=((n%connectedApps.length)+connectedApps.length)%connectedApps.length;viewport.scrollTo({left:target*step(),behavior:media.matches||globalPaused()?'auto':'smooth'});status.textContent=`${connectedApps[target][0]}, ${target+1} of ${connectedApps.length}`;};
 pause.addEventListener('click',()=>{userPaused=!userPaused;interacting=false;clearTimeout(resumeTimer);schedule();});
 mount.querySelector('[data-app-prev]').addEventListener('click',()=>show(Math.round(viewport.scrollLeft/step())-Math.max(1,Math.floor(viewport.clientWidth/step()))));
 mount.querySelector('[data-app-next]').addEventListener('click',()=>show(Math.round(viewport.scrollLeft/step())+Math.max(1,Math.floor(viewport.clientWidth/step()))));
 carousel.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovered=true;schedule();}});
 carousel.addEventListener('pointerleave',()=>{hovered=false;schedule();});
 carousel.addEventListener('focusin',e=>{focused=e.target!==pause;schedule();});
 carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget)){focused=false;schedule();}});
 viewport.addEventListener('pointerdown',stop,{passive:true});
 viewport.addEventListener('wheel',stop,{passive:true});
 viewport.addEventListener('scroll',updateCount,{passive:true});
 viewport.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const current=Math.round(viewport.scrollLeft/step());show(e.key==='Home'?0:e.key==='End'?connectedApps.length-1:current+(e.key==='ArrowRight'?1:-1));}});
 const visibility=()=>schedule();document.addEventListener('visibilitychange',visibility);
 const motion=()=>schedule();media.addEventListener('change',motion);
 const observer=new MutationObserver(schedule);observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 const intersection=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.2});intersection.observe(viewport);
 const resize=new ResizeObserver(()=>{position=viewport.scrollLeft;updateCount();});resize.observe(viewport);
 function cleanup(){destroyed=true;clearTimeout(resumeTimer);cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();resize.disconnect();media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);}
 connectionCarouselCleanup=cleanup;
 updateButton();
};
render();
