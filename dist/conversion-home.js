/* Homepage sales journey. Reuses the approved puzzle, portraits and interactive scenes. */
(() => {
  'use strict';
  const shape={
    people:'<circle cx="24" cy="20" r="8" fill="url(#S)"/><circle cx="44" cy="23" r="6" fill="url(#G)"/><path d="M9 48v-6c0-9 6-14 15-14s16 5 16 14v6Z" fill="url(#B)"/><path d="M38 34c12-5 19 3 19 12v4H43" fill="url(#G)"/>',
    sales:'<rect x="10" y="35" width="9" height="18" rx="3" fill="url(#S)"/><rect x="25" y="27" width="9" height="26" rx="3" fill="url(#B)"/><rect x="40" y="16" width="9" height="37" rx="3" fill="url(#G)"/><path d="m11 28 14-10 10 2L52 6m-11 0h11v11" fill="none" stroke="#eafff8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    marketing:'<path d="M12 24h15L50 12v36L27 36H12Z" fill="url(#S)"/><path d="M29 23 50 12v36L29 37Z" fill="url(#B)"/><rect x="9" y="24" width="13" height="13" rx="5" fill="url(#G)"/><path d="m20 37 4 16h10l-6-16" fill="url(#B)"/><path d="m55 20 5-3m-5 13h6m-6 10 5 3" stroke="#a7f3c4" stroke-width="3" stroke-linecap="round"/>',
    inbox:'<path d="m14 16-7 24v13h50V40l-7-24Z" fill="url(#B)"/><rect x="20" y="11" width="24" height="29" rx="5" fill="url(#S)"/><path d="M25 20h14m-14 7h10" stroke="#2173d4" stroke-width="3" stroke-linecap="round"/><path d="M7 39h15l5 7h10l5-7h15v14H7Z" fill="url(#G)"/>',
    social:'<path d="m17 33 30-17m-30 17 30 16" stroke="#bbd9f9" stroke-width="5"/><circle cx="15" cy="33" r="11" fill="url(#B)"/><circle cx="48" cy="15" r="10" fill="url(#G)"/><circle cx="48" cy="49" r="10" fill="url(#S)"/>',
    calendar:'<rect x="10" y="12" width="44" height="43" rx="7" fill="url(#S)"/><path d="M17 12h30a7 7 0 0 1 7 7v8H10v-8a7 7 0 0 1 7-7" fill="url(#B)"/><path d="M21 8v12m22-12v12" stroke="#a4f4c3" stroke-width="5" stroke-linecap="round"/><path d="m23 40 6 6 13-14" fill="none" stroke="#0c9569" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
    flow:'<path d="M18 23v21h27M43 19H18m25 0v22" fill="none" stroke="#d9edff" stroke-width="4"/><rect x="7" y="8" width="22" height="19" rx="5" fill="url(#B)"/><rect x="35" y="35" width="22" height="21" rx="5" fill="url(#G)"/><circle cx="45" cy="18" r="8" fill="url(#S)"/>',
    web:'<rect x="7" y="11" width="50" height="43" rx="7" fill="url(#S)"/><path d="M14 11h36a7 7 0 0 1 7 7v7H7v-7a7 7 0 0 1 7-7" fill="url(#B)"/><circle cx="15" cy="18" r="2" fill="#b0f7d3"/><circle cx="22" cy="18" r="2" fill="white"/><rect x="14" y="32" width="15" height="14" rx="3" fill="url(#G)"/><path d="M35 34h14m-14 7h10" stroke="#4283c9" stroke-width="3" stroke-linecap="round"/>',
    star:'<path d="m32 6 8 15 18 3-13 13 3 19-16-9-16 9 3-19L6 24l18-3Z" fill="url(#G)" stroke="#d3ffeb" stroke-width="1.5"/><path d="m32 6 1 26 15 24-16-9-16 9 3-19L6 24l18-3Z" fill="url(#B)" opacity=".72"/>',
    payment:'<rect x="6" y="16" width="48" height="33" rx="6" fill="url(#S)"/><path d="M6 25h48v8H6Z" fill="url(#B)"/><rect x="13" y="39" width="11" height="4" rx="2" fill="#3087c7"/><circle cx="49" cy="46" r="12" fill="url(#G)"/><path d="m43 46 4 4 8-9" fill="none" stroke="#075b4b" stroke-width="3" stroke-linecap="round"/>',
    chart:'<rect x="7" y="8" width="49" height="46" rx="7" fill="url(#S)"/><rect x="15" y="33" width="7" height="13" rx="2" fill="url(#B)"/><rect x="28" y="24" width="7" height="22" rx="2" fill="url(#G)"/><rect x="41" y="16" width="7" height="30" rx="2" fill="url(#B)"/>',
    chat:'<path d="M8 12h48v32H33L19 55V44H8Z" fill="url(#S)"/><rect x="16" y="21" width="32" height="5" rx="2.5" fill="url(#B)"/><rect x="16" y="31" width="21" height="5" rx="2.5" fill="url(#G)"/>',
    heart:'<path d="M32 53 10 32C-3 14 20 2 32 18 44 2 67 14 54 32Z" fill="url(#G)"/><path d="M17 25h10l4-9 6 23 5-14h7" fill="none" stroke="#f3fff9" stroke-width="3" stroke-linecap="round"/>',
    scissors:'<circle cx="17" cy="43" r="9" fill="url(#G)"/><circle cx="45" cy="43" r="9" fill="url(#B)"/><path d="m20 37 26-27m-5 27L15 10" stroke="#e9f5ff" stroke-width="6" stroke-linecap="round"/>',
    home:'<path d="m6 29 26-22 26 22-6 7-4-3v23H16V33l-4 3Z" fill="url(#B)"/><path d="M16 29 32 15l16 14v27H16Z" fill="url(#S)"/><rect x="26" y="36" width="13" height="20" rx="3" fill="url(#G)"/>',
    fitness:'<path d="M19 32h26" stroke="#dfedff" stroke-width="7"/><rect x="6" y="18" width="12" height="28" rx="4" fill="url(#B)"/><rect x="18" y="12" width="8" height="40" rx="3" fill="url(#G)"/><rect x="38" y="12" width="8" height="40" rx="3" fill="url(#B)"/><rect x="46" y="18" width="12" height="28" rx="4" fill="url(#G)"/>',
    car:'<path d="m12 29 6-15h28l7 15 5 7v15H7V36Z" fill="url(#B)"/><path d="m21 19-4 11h30l-5-11Z" fill="url(#S)"/><rect x="12" y="38" width="10" height="5" rx="2" fill="#b0f3cb"/><rect x="43" y="38" width="10" height="5" rx="2" fill="#b0f3cb"/>',
    paw:'<ellipse cx="32" cy="42" rx="15" ry="13" fill="url(#B)"/><ellipse cx="12" cy="28" rx="6" ry="8" fill="url(#G)"/><ellipse cx="24" cy="16" rx="6" ry="9" fill="url(#S)"/><ellipse cx="40" cy="16" rx="6" ry="9" fill="url(#G)"/><ellipse cx="52" cy="28" rx="6" ry="8" fill="url(#S)"/>',
    briefcase:'<path d="M24 17V9h17v8" stroke="#b9f4d6" stroke-width="5" fill="none"/><rect x="6" y="17" width="52" height="37" rx="6" fill="url(#B)"/><path d="M6 26v9l26 7 26-7v-9" fill="url(#S)"/><rect x="28" y="31" width="9" height="12" rx="3" fill="url(#G)"/>',
    box:'<path d="m7 20 25-12 25 12v28L32 59 7 48Z" fill="url(#B)"/><path d="M7 20 32 32l25-12L32 8Z" fill="url(#S)"/><path d="M32 32v27l25-11V20Z" fill="url(#G)"/><path d="m20 14 24 12v10" fill="none" stroke="#3c88bf" stroke-width="4"/>',
    event:'<path d="M13 50 29 14l22 22Z" fill="url(#B)"/><path d="m13 50 7-16 13 11Z" fill="url(#G)"/><path d="m34 8 5 8m10-7-5 12m10 0 5 3M8 17l7 3m3-12-2 4" stroke="#a7edca" stroke-width="4" stroke-linecap="round"/>'
  };
  let serial=0;
  function art(key,cls='ag-dimension-icon'){
    const id='ag-art-'+(++serial),body=(shape[key]||shape.web).replaceAll('#S','#'+id+'s').replaceAll('#B','#'+id+'b').replaceAll('#G','#'+id+'g');
    return `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}s" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#dbeaff"/><stop offset="1" stop-color="#84a9d4"/></linearGradient><linearGradient id="${id}b" x2=".8" y2="1"><stop stop-color="#63b0ff"/><stop offset=".5" stop-color="#2174ed"/><stop offset="1" stop-color="#10428b"/></linearGradient><linearGradient id="${id}g" x2=".8" y2="1"><stop stop-color="#d7ffe9"/><stop offset=".5" stop-color="#7ceeb8"/><stop offset="1" stop-color="#148c73"/></linearGradient></defs><ellipse cx="32" cy="57" rx="22" ry="4" fill="#001f44" opacity=".18"/>${body}</svg>`;
  }
  const problems=[
    {label:'First response',icon:'chat',title:'Interest is fresh. Is your reply?',problem:'An enquiry arrives through WhatsApp, Instagram or your website, then waits for someone to notice.',fix:'Bring connected messages into one inbox. Assign an owner and use a configured AI assistant to answer approved questions when your plan includes it.',benefit:'Give every enquiry a clear next step.',route:'inbox'},
    {label:'Follow-through',icon:'flow',title:'A quote sent. Then what?',problem:'A promising conversation stalls because the follow-up lives in someone\'s memory.',fix:'Keep the conversation, opportunity and next action together. Agreed workflows prompt the right person to follow up.',benefit:'Keep good opportunities moving.',route:'follow-up'},
    {label:'Customer relationship',icon:'heart',title:'The first sale should open the next conversation.',problem:'Customers leave happy, then hear nothing until you need another sale.',fix:'Use customer history to plan relevant check-ins, review requests and rebooking or reactivation messages, with the right permissions.',benefit:'Give customers a reason to return.',route:'reactivation'}
  ];
  const panel=i=>{const p=problems[i];return `<div class="ag-problem-situation"><span class="eyebrow">Where business slips away</span><h3>${p.title}</h3><p>${p.problem}</p></div><div class="ag-problem-fix"><span class="eyebrow">How AyudaGrow helps</span><p>${p.fix}</p><a class="textlink" href="/${p.route}">${p.benefit} <span aria-hidden="true">&#8594;</span></a></div>`;};
  function problemSection(){return `<section class="section ag-problem-section" id="business-gaps"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Good opportunities deserve better</span><h2>Three places good business slips away.</h2></div></div><div class="ag-problem-selectors" role="tablist" aria-label="Explore a business problem">${problems.map((p,i)=>`<button type="button" role="tab" id="ag-problem-tab-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" aria-controls="ag-problem-panel" data-problem="${i}">${art(p.icon)}<span>${p.label}</span><b aria-hidden="true">&#8594;</b></button>`).join('')}</div><div class="ag-problem-panel" id="ag-problem-panel" role="tabpanel" aria-labelledby="ag-problem-tab-0" tabindex="0">${panel(0)}</div></div></section>`;}
  const mark=(file,position)=>`<img class="ag-section-mark ag-mark-${position}" src="/assets/${file}.webp" alt="" aria-hidden="true" loading="lazy">`;
  const previousHome=pages.home;
  pages.home=()=>{
    serial=0;
    const t=document.createElement('template');t.innerHTML=previousHome();const f=t.content;
    const hero=f.querySelector('.hero');hero.classList.add('ag-sales-hero');
    const copy=hero.querySelector('.wrap>div:first-child');
    copy.innerHTML=`<span class="eyebrow">Connect. Automate. Grow.</span><h1>Stop leaving money <em>on the table.</em></h1><p>Turn more enquiries into customers. Keep follow-ups moving. Give existing customers a reason to return.</p><div class="actions"><a class="button" href="/pricing">Find your plan <span aria-hidden="true">&#8594;</span></a><a class="textlink" href="/contact?intent=demo">Discuss a demo <span aria-hidden="true">&#8594;</span></a></div><p class="hero-note">Plans from US$99/month. Try Essentials free for 7 days.</p>`;
    const iconKeys=['people','sales','marketing','inbox',null,'social','calendar','flow','web','star','payment','chart'];
    hero.querySelectorAll('.ag-piece').forEach((p,i)=>{const old=p.querySelector('.ag-piece-icon');if(old)old.outerHTML=art(iconKeys[i]);});
    const who=f.querySelector('.ag-who');
    who.querySelector('.ag-who-intro>p').textContent='Built around how your customers book, buy and come back.';
    who.querySelector('.ag-category-overlap').textContent='Some businesses use both journeys. We shape the setup around yours. Danielle is an illustrative business persona.';
    who.querySelectorAll('.ag-category-intro h3')[1].textContent='Built around conversations.';
    const businessKeys=['scissors','heart','home','fitness','car','paw','briefcase','box','web','home','home','event'];
    who.querySelectorAll('.ag-business-examples li').forEach((li,i)=>{const title=li.querySelector('strong'),desc=li.querySelector('span');li.innerHTML=art(businessKeys[i])+`<div>${title.outerHTML}${desc.outerHTML}</div>`;});
    who.insertAdjacentHTML('beforeend',mark('star-secondary','right'));
    const loop=f.querySelector('.gp-growth-section');
    loop.querySelector('h2').textContent='One relationship. More than one opportunity.';
    loop.querySelector('.section-head>p').textContent='Explore five stages, the tools behind them and how they help your team move forward.';
    loop.querySelectorAll('[data-growth-stage]').forEach((b,i)=>b.insertAdjacentHTML('afterbegin',art(['web','chat','sales','heart','flow'][i])));
    loop.insertAdjacentHTML('beforeend',mark('brand-growth-sweep-aluminium-optimized','left'));
    const ai=f.querySelector('.ai-home');ai.querySelector('h2').textContent='Your business knowledge. Ready for the next question.';
    ai.querySelector('.section-head>p').textContent='Give your assistant approved answers, clear boundaries and a way to hand over to your team.';
    ai.insertAdjacentHTML('beforeend',mark('star-primary','right'));
    const inbox=f.querySelector('.inbox-home');inbox.querySelector('h2').textContent='Different channels. One connected conversation.';
    const more=inbox.querySelector('.visual-next');more.insertAdjacentHTML('beforeend','<a class="textlink" href="/platform">Explore the connected platform &#8594;</a>');
    const apps=`<section class="section ag-home-apps"><div class="wrap"><div id="ch-app-carousel"></div></div>${mark('brand-growth-ring-acrylic-optimized','left')}</section>`;
    const close=`<section class="section ag-start-strip"><div class="wrap"><div><span class="eyebrow">A useful first step</span><h2>Start with what your business needs next.</h2></div><ol><li><b>01</b><div><h3>Choose your plan</h3><p>Start with the tools and level of AI you need.</p></div></li><li><b>02</b><div><h3>Connect and configure</h3><p>Follow the setup steps, with help within your plan.</p></div></li><li><b>03</b><div><h3>Test and put it to work</h3><p>Check answers, follow-up and human handoff.</p></div></li></ol></div></section><section class="cta ag-home-close"><div class="wrap"><div><span class="eyebrow">Make your next opportunity count</span><h2>Find the right starting point.</h2><p>Four monthly plans, from US$99. Essentials includes a free 7-day trial.</p></div><div class="actions"><a class="button" href="/pricing">Compare plans &#8594;</a><a class="textlink" href="/contact?intent=demo">Discuss a demo &#8594;</a></div></div></section>`;
    return hero.outerHTML+problemSection()+who.outerHTML+loop.outerHTML+ai.outerHTML+inbox.outerHTML+apps+close;
  };
  const previousWiring=wireExpanded;
  wireExpanded=function(){previousWiring();
    const tabs=[...document.querySelectorAll('[data-problem]')],target=document.querySelector('#ag-problem-panel');if(!target)return;
    const choose=i=>{tabs.forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1;});target.innerHTML=panel(i);target.setAttribute('aria-labelledby',tabs[i].id);};
    tabs.forEach((b,i)=>{b.addEventListener('click',()=>choose(i));b.addEventListener('focus',()=>choose(i));b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!tabs.some(t=>t===document.activeElement))choose(i);});b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:-1)+3)%3;tabs[n].focus();choose(n);});});
  };
  render();
})();
