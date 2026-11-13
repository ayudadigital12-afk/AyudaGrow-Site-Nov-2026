/* Homepage interactions, November 2026. Capability labels map to the existing catalogue. */
(function () {
  'use strict';
  const items = [
    ['crm', 'CRM', '(Customer Database)', 'people', 'Keep customer details, conversations and next steps together.'],
    ['consultative-sales', 'Sales Tools', '', 'sales', 'Track opportunities, proposals and the next follow-up.'],
    ['marketing', 'Marketing Tools', '', 'marketing', 'Plan campaigns and turn attention into enquiries.'],
    ['inbox', 'Unified Inbox', '', 'inbox', 'See connected conversations and reply with context.'],
    ['ai', 'AI Assistants', '', 'ai', 'Answer and act using knowledge approved by your business.'],
    ['integrations', 'Social Connections', '', 'social', 'Connect supported social channels to your customer workflow.'],
    ['appointments', 'Appointments', '', 'calendar', 'Bring bookings, follow-ups and reminders together.'],
    ['automation', 'Automation & Workflows', '', 'flow', 'Let agreed triggers move repeatable work forward.'],
    ['lead-capture', 'Websites & Funnels', '', 'web', 'Give visitors a clear path from interest to enquiry.'],
    ['reputation', 'Google Reviews', '', 'star', 'Request honest reviews and manage your responses.'],
    ['commerce', 'Payments & Commerce', '', 'payment', 'Connect invoices, payment links and online sales.'],
    ['reporting', 'Reporting & Insights', '', 'chart', 'See activity, spot gaps and decide what needs attention.']
  ];
  const icons={people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v2"/>',sales:'<path d="M4 4v16h16M7 15l4-4 4 2 5-7m-5 0h5v5"/>',marketing:'<path d="M3 9v6h5l11 5V4L8 9H3Zm4 6 2 6h4l-2-5M22 9v6"/>',inbox:'<path d="m5 4-3 9v7h20v-7l-3-9H5ZM2 13h6l2 3h4l2-3h6"/>',ai:'<rect x="3" y="7" width="18" height="13" rx="4"/><path d="M12 3v4M8 12v2m8-2v2m-8 3h8"/><circle cx="12" cy="2" r="1"/>',social:'<circle cx="5" cy="12" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="19" cy="19" r="3"/><path d="m8 10 8-4m-8 8 8 4"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M7 2v6m10-6v6m-10 7h3m4 0h3m-10 4h3"/>',flow:'<rect x="2" y="2" width="7" height="7" rx="2"/><rect x="15" y="15" width="7" height="7" rx="2"/><path d="M6 9v9h9M9 5h9v10"/>',web:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20M6 5.5h.1m3 0h.1m3 0h.1M6 12h12m-12 4h7"/>',star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',payment:'<rect x="2" y="5" width="20" height="15" rx="3"/><path d="M2 10h20M6 15h5"/>',chart:'<path d="M3 3v18h18M7 16v-4m5 4V7m5 9V4"/>'};
  const icon=k=>`<svg class="ag-piece-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[k]}</svg>`;
  // Every shared edge has the same curve, reversed on its neighbour, so the pieces truly interlock.
  const piecePath=(col,row)=>{
    let d='M0 0';
    d+=row===0?'H180':'H72 C72 0 67 20 90 20 C113 20 108 0 108 0 H180';
    d+=col===2?'V130':'V50 C180 50 200 45 200 65 C200 85 180 80 180 80 V130';
    d+=row===3?'H0':'H108 C108 130 113 150 90 150 C67 150 72 130 72 130 H0';
    d+=col===0?'V0':'V80 C0 80 20 85 20 65 C20 45 0 50 0 50 V0';
    return d+'Z';
  };
  function heroPuzzle(){return `<div class="ag-offering" aria-labelledby="ag-offering-title"><div class="ag-offering-heading"><div class="ag-puzzle-brand"><img src="assets/logo.webp" alt="AyudaGrow"><span>CONNECTED FOR GROWTH</span></div><h2 id="ag-offering-title">What is AyudaGrow?</h2><p>Hover, focus or tap a piece to explore.</p><img src="assets/star-primary.webp" alt="" class="ag-puzzle-star"></div><div class="ag-puzzle" role="group" aria-label="Choose an AyudaGrow service">${items.map(([route,label,detail,key,context],i)=>`<button type="button" class="ag-piece ag-piece-${i} ${i===0?'ag-piece-selected':''}" data-ag-piece="${i}" aria-pressed="${i===0}" aria-controls="ag-service-context" style="--i:${i};--enter-x:${i%3===0?-30:i%3===2?30:0}px;--enter-y:${i<6?-24:24}px" aria-label="${label}${detail?' '+detail:''}: ${context}"><span class="ag-piece-surface"><svg class="ag-piece-shape" viewBox="-1 -1 202 152" preserveAspectRatio="none" aria-hidden="true"><path d="${piecePath(i%3,Math.floor(i/3))}"/></svg><span class="ag-piece-content">${key==='ai'?'<img class="ag-piece-robot" src="assets/mascot-laptop.webp" alt="">':icon(key)}<strong>${label}</strong>${detail?`<small>${detail}</small>`:''}</span></span></button>`).join('')}</div><div id="ag-service-context" class="ag-service-context" aria-live="polite" aria-atomic="true"><div><strong data-ag-context-title>CRM</strong><a data-ag-context-link href="#/crm">Explore CRM <span aria-hidden="true">→</span></a></div><p data-ag-context-copy>${items[0][4]}</p></div><div class="ag-puzzle-bottom"><p>Choose the services you need.<br><strong>Bring them together to grow.</strong></p><div class="ag-puzzle-links"><a href="#/solutions">Explore All Capabilities <span aria-hidden="true">→</span></a><button type="button" data-ag-replay>Replay puzzle <span aria-hidden="true">↻</span></button></div><small>Features, AI agents and usage depend on your plan and agreed setup.</small></div></div>`;}
  const businessExamples={
    appointments:[
      ['Salons & spas','Hair, beauty, massage and wellness sessions.'],
      ['Medical & dental offices','Enquiries, bookings, reminders and rescheduling.'],
      ['Home services','Cleaning, pest control, maintenance and scheduled service visits.'],
      ['Fitness, coaching & lessons','Personal training, coaching sessions and one-on-one classes.'],
      ['Vehicle care','Servicing, inspections, detailing and repair appointments.'],
      ['Pet care','Grooming, daycare visits and appointment coordination.']
    ],
    consultation:[
      ['Professional services','Consultants, accountants, advisers and training providers.'],
      ['B2B suppliers','Office supplies, equipment and wholesale enquiries that lead to a quote.'],
      ['Agencies & creative studios','Marketing, design and digital projects with discovery and proposals.'],
      ['Property & insurance','Viewings, needs conversations, quotations and adviser-led decisions.'],
      ['Home improvement projects','Renovations, solar installations and larger jobs needing an assessment and estimate.'],
      ['Events & catering','Date checks, requirements, proposals and booking decisions.']
    ]
  };
  const exampleList=kind=>`<div class="ag-business-examples"><h4>Examples include</h4><ul>${businessExamples[kind].map(([name,description])=>`<li><strong>${name}</strong><span>${description}</span></li>`).join('')}</ul></div>`;
  function whoServe(){return `<section class="ag-who" aria-labelledby="ag-who-title"><div class="wrap ag-who-layout"><div class="ag-who-intro"><span class="ag-who-float"><img src="assets/star-secondary.webp" alt="">Different ways of selling</span><h2 id="ag-who-title">Who We Serve</h2><p>From a booked appointment to a considered decision, connect the tools around the way your business works.</p></div><div class="ag-who-cards"><article class="ag-business-category" aria-label="Businesses that sell by appointment"><a class="ag-person-card" href="#/appointments"><figure><div class="ag-portrait-frame"><svg viewBox="424 350 200 250" role="img" aria-label="Danielle, illustrative salon owner, in her salon" preserveAspectRatio="xMidYMid slice"><image href="assets/danielle.webp" width="1536" height="1024"/></svg></div><figcaption>Danielle - Sale by Appointment</figcaption></figure><div class="ag-category-intro"><h3>Built around bookings.</h3><p>For businesses where customers reserve a time, visit or scheduled service.</p><span class="ag-person-link">Explore appointment-driven businesses <b aria-hidden="true">→</b></span></div></a>${exampleList('appointments')}<p class="ag-category-note">Healthcare examples cover administrative scheduling and communication only.</p></article><article class="ag-business-category" aria-label="Businesses that sell by consultation"><a class="ag-person-card" href="#/consultative-sales"><figure><div class="ag-portrait-frame"><img src="assets/rasheed.webp" alt="Rasheed Girvan, AyudaGrow founder" loading="lazy"></div><figcaption>Rasheed - Sale by Consultation</figcaption></figure><div class="ag-category-intro"><h3>Built around a conversation.</h3><p>For businesses where customers discuss their needs before choosing a service, proposal or quote.</p><span class="ag-person-link">Explore consultative selling <b aria-hidden="true">→</b></span></div></a>${exampleList('consultation')}<p class="ag-category-note">Your team leads advice and decisions, with the context and follow-up kept together.</p></article></div><p class="ag-category-overlap">Some businesses use both journeys. We shape the setup around how you sell and serve.</p></div></section>`;}
  let dispose = () => {};
  function cleanup(){dispose();dispose=()=>{};}
  function mount(container){
    cleanup();
    const puzzle=container.querySelector('.ag-puzzle');if(!puzzle)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let played=false;
    const start=()=>{puzzle.classList.remove('ag-assembling');void puzzle.offsetWidth;if(!reduced.matches&&!document.body.classList.contains('paused'))puzzle.classList.add('ag-assembling');played=true;};
    const replay=container.querySelector('[data-ag-replay]');
    replay.onclick=start;
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!played){start();observer.disconnect();}},{threshold:0.3});
    observer.observe(puzzle);
    const onPreference=()=>{if(reduced.matches)puzzle.classList.remove('ag-assembling');};
    reduced.addEventListener('change',onPreference);
    const buttons=Array.from(puzzle.querySelectorAll('[data-ag-piece]'));
    const select=index=>{
      const [route,label,,,context]=items[index];
      buttons.forEach((button,i)=>{button.classList.toggle('ag-piece-selected',i===index);button.setAttribute('aria-pressed',String(i===index));});
      container.querySelector('[data-ag-context-title]').textContent=label;
      container.querySelector('[data-ag-context-copy]').textContent=context;
      const link=container.querySelector('[data-ag-context-link]');link.href='#/'+route;link.textContent='Explore '+label+' →';
    };
    const onOver=e=>{const b=e.target.closest('[data-ag-piece]');if(b&&puzzle.contains(b)&&e.pointerType!=='touch')select(Number(b.dataset.agPiece));};
    const onFocus=e=>{const b=e.target.closest('[data-ag-piece]');if(b)select(Number(b.dataset.agPiece));};
    const onClick=e=>{const b=e.target.closest('[data-ag-piece]');if(b)select(Number(b.dataset.agPiece));};
    const onKey=e=>{const b=e.target.closest('[data-ag-piece]');if(!b)return;const step={ArrowRight:1,ArrowLeft:-1,ArrowDown:3,ArrowUp:-3}[e.key];if(step){e.preventDefault();buttons[(Number(b.dataset.agPiece)+step+buttons.length)%buttons.length].focus();}};
    puzzle.addEventListener('pointerover',onOver);puzzle.addEventListener('focusin',onFocus);puzzle.addEventListener('click',onClick);puzzle.addEventListener('keydown',onKey);
    dispose=()=>{observer.disconnect();reduced.removeEventListener('change',onPreference);replay.onclick=null;puzzle.removeEventListener('pointerover',onOver);puzzle.removeEventListener('focusin',onFocus);puzzle.removeEventListener('click',onClick);puzzle.removeEventListener('keydown',onKey);};
  }
  window.AyudaHomepage={heroPuzzle,whoServe,mount,cleanup};
})();
