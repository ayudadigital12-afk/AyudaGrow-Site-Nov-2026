/* Clean, directly readable routes. The private preview must remain non-indexable. */
(function () {
  'use strict';
  const origin = 'https://ayudagrow.com';
  const aliases = {
    'platform/unified-conversations':'inbox', 'platform/follow-up-automation':'follow-up',
    'platform/customer-reactivation':'reactivation', 'platform/crm-sales-pipeline':'crm',
    'platform/lead-capture':'lead-capture', 'platform/appointments':'appointments',
    'platform/reputation-reviews':'reputation', 'platform/reporting-forecasting':'reporting',
    'who-its-for':'use-cases', 'who-its-for/b2b':'consultative-sales',
    'who-its-for/b2c':'appointments', 'how-it-works':'support', 'free-trial':'get-started'
  };
  const descriptions = {
    home:'Explore AyudaGrow’s AI, CRM, automation, setup and training approach for connected customer journeys in Jamaica and the Caribbean.',
    platform:'Connect conversations, customer records, follow-up and reporting. Explore AyudaGrow’s illustrative AI-centered growth platform and agreed setup process.',
    solutions:'Explore how AyudaGrow connects customer enquiries, follow-up, appointments, sales opportunities and reviews through an agreed workflow.',
    inbox:'Bring supported customer conversations into a shared inbox with context, ownership and human handoff. Channel availability and setup must be confirmed.',
    ai:'Explore an AI assistant grounded in approved business knowledge, configured actions and human handoff. Capabilities depend on the agreed setup.',
    'ai-concepts':'Private creative review of three illustrative treatments for AyudaGrow’s AI assistant. These are design concepts, not published customer services.',
    crm:'Connect customer records, opportunity stages, responsibilities and next actions. Explore CRM views for sales teams, managers and business owners.',
    appointments:'Explore connected appointment enquiries, scheduling, changes and follow-up. Illustrative workflows require agreed calendar and channel configuration.',
    'consultative-sales':'Connect enquiries, discovery, quotations and follow-up for consultative sales. People lead advice, negotiation and customer commitments.',
    'use-cases':'Explore illustrative appointment-driven and consultative business journeys. AyudaGrow adapts connected workflows around how a business sells and serves.',
    'lead-capture':'Connect forms, campaigns and supported enquiries to a customer record, source and responsible owner. Configure permissions and follow-up around your process.',
    'follow-up':'Organise quotation, enquiry and appointment follow-up with owners, reminders and clear next actions. Customer messages require agreed permissions and setup.',
    reactivation:'Explore relevant ways to reconnect with eligible past customers and older enquiries while respecting permissions, preferences and stop conditions.',
    automation:'Explore configured workflow steps that connect customer information, tasks and follow-up. Agree the rules, exceptions and human responsibilities first.',
    reporting:'Use current CRM and activity data to review pipeline, sources and expected revenue. Forecasts support planning and do not guarantee business results.',
    reputation:'Explore review workflows and scoped Google Business Profile support. Invite honest feedback and agree profile access, eligibility and service responsibilities.',
    integrations:'Explore documented connection methods, mobile access and business tools. Confirm account eligibility, permissions and setup before activating an integration.',
    marketing:'Connect content and campaigns to customer enquiries and useful follow-up. Publishing, permissions, delivery and advertising scope must be agreed.',
    commerce:'Explore invoices, estimates, payment links and connected order workflows. Provider access, regional availability, fees and responsibilities must be confirmed.',
    learning:'Explore course, membership and community tools as part of a customer relationship. Content, moderation and access configuration are separately scoped.',
    support:'Learn how AyudaGrow approaches assessment, setup, training and ongoing support. Agree a practical starting point, responsibilities and service scope.',
    pricing:'Compare AyudaGrow plans from US$149 per month: shared CRM, inbox, calendars, pipelines and workflows, with separate AI allowances, setup and usage. Private pricing review.',
    privacy:'Review the draft privacy notice for AyudaGrow’s planned contact-only website, including confirmed contact links and the facts still needed before launch.',
    'get-started':'Get in touch with AyudaGrow by email at admin@ayudagrow.com or phone on +1 876-480-0413 to discuss your business and a practical next step.',
    contact:'Contact AyudaGrow at admin@ayudagrow.com or +1 876-480-0413 to discuss customer enquiries, follow-up and your business workflow.',
    'growth-assessment':'Explore questions about customer enquiries, follow-up and business growth. This is an informational guide, not a working online assessment.',
    learn:'Learn what a CRM is and how shared customer records, conversation context, pipeline stages and next actions can support your team’s daily work.',
    'solutions/book-more-appointments':'Explore how connected enquiries, booking details and reminders can support an appointment journey. Examples are illustrative and results are not guaranteed.',
    'solutions/convert-more-leads':'Explore a clearer path from new enquiry to useful response, qualification and follow-up. Agree ownership and measure the actual customer outcome.',
    'solutions/generate-more-reviews':'Explore appropriate review invitations, honest customer feedback and thoughtful responses. Tools and managed profile services have separate agreed scopes.',
    'solutions/improve-customer-communication':'Connect customer conversation context, team ownership and agreed responses across supported channels. Availability depends on the configured setup.',
    'solutions/improve-sales-follow-up':'Explore clear sales follow-up with owners, due dates, shared context and appropriate reminders. Customer permissions and stop conditions matter.',
    'solutions/manage-sales-opportunities':'Explore sales stages, current opportunity records and meaningful next actions. Use reporting for management visibility without promising sales outcomes.',
    'solutions/reactivate-customers':'Explore relevant follow-up for eligible past customers and paused enquiries. Respect communication preferences and give interested replies a clear owner.'
  };
  function read(url = new URL(location.href)) {
    const legacy = url.hash.startsWith('#/');
    const raw = legacy ? url.hash.slice(1) : url.pathname + url.search;
    const parsed = new URL(raw, url.origin);
    let key = parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/\/index\.html$/, '') || 'home';
    if(key === 'index.html') key = 'home';
    key = aliases[key] || key;
    return {key, path:key === 'home' ? '/' : '/' + key, search:parsed.search, hash:legacy ? '' : url.hash};
  }
  const key = () => read().key;
  const route = () => {const current = read();return current.path + current.search;};
  function normalizeLocation() {
    const current = read();
    // Fragments from saved review links migrate locally. They never reach an HTTP server.
    const path = current.path + current.search + current.hash;
    if(location.pathname + location.search + location.hash !== path) history.replaceState(history.state, '', path);
  }
  function cleanLinks(root = document) {
    root.querySelectorAll('a[href^="#/"]').forEach(link => {
      const target=read(new URL(link.getAttribute('href'),location.origin + '/'));
      link.setAttribute('href',target.path + target.search);
    });
    const skip=document.querySelector('.skip');
    const skipTarget=location.pathname + location.search + '#main';
    if(skip && skip.getAttribute('href')!==skipTarget)skip.setAttribute('href',skipTarget);
  }
  function setMeta(selector,attributes) {
    let element=document.head.querySelector(selector);
    if(!element){element=document.createElement(selector.startsWith('link')?'link':'meta');document.head.append(element);}
    Object.entries(attributes).forEach(([name,value])=>element.setAttribute(name,value));
  }
  function apply(currentKey, title) {
    const missing=currentKey === 'not-found';
    const description=missing?'The requested AyudaGrow preview page was not found. Explore the platform, solutions or homepage.':descriptions[currentKey];
    const canonical=origin + (currentKey==='home'?'/':'/'+currentKey);
    document.title=title;
    setMeta('meta[name="robots"]',{name:'robots',content:'noindex,nofollow'});
    setMeta('meta[name="description"]',{name:'description',content:description || 'Private AyudaGrow website preview. Content and service scope remain subject to review.'});
    const image=origin+'/assets/logo.webp';
    for(const [property,content] of Object.entries({'og:type':'website','og:site_name':'AyudaGrow','og:title':title,'og:description':description,'og:image':image,'og:image:alt':'AyudaGrow logo','og:locale':'en_US'}))setMeta('meta[property="'+property+'"]',{property,content:content||''});
    for(const [name,content] of Object.entries({'twitter:card':'summary','twitter:title':title,'twitter:description':description,'twitter:image':image,'twitter:image:alt':'AyudaGrow logo'}))setMeta('meta[name="'+name+'"]',{name,content:content||''});
    document.head.querySelector('#ayuda-structured-data')?.remove();
    if(missing){document.head.querySelector('link[rel="canonical"]')?.remove();document.head.querySelector('meta[property="og:url"]')?.remove();}
    else {
      setMeta('link[rel="canonical"]',{rel:'canonical',href:canonical});
      setMeta('meta[property="og:url"]',{property:'og:url',content:canonical});
      const label=title.replace(/^AyudaGrow \| /,'');
      const graph=[
        {'@type':'Organization','@id':origin+'/#organization',name:'AyudaGrow',url:origin+'/',logo:image},
        {'@type':'WebSite','@id':origin+'/#website',name:'AyudaGrow',url:origin+'/',publisher:{'@id':origin+'/#organization'}},
        {'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,isPartOf:{'@id':origin+'/#website'}}
      ];
      if(currentKey!=='home'){
        const crumbs=[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'}];
        if(currentKey.startsWith('solutions/'))crumbs.push({'@type':'ListItem',position:2,name:'Solutions',item:origin+'/solutions'});
        crumbs.push({'@type':'ListItem',position:crumbs.length+1,name:label,item:canonical});
        graph.push({'@type':'BreadcrumbList','@id':canonical+'#breadcrumb',itemListElement:crumbs});
        graph[2].breadcrumb={'@id':canonical+'#breadcrumb'};
      }
      // Deliberately no ratings, prices, postal address, contacts, legal name or guaranteed availability.
      const script=document.createElement('script');script.id='ayuda-structured-data';script.type='application/ld+json';script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});document.head.append(script);
    }
    cleanLinks();
  }
  function notFound(){return '<section class="page-hero"><div class="wrap"><span class="eyebrow">Page not found</span><h1>That page is not here.</h1><p>The address may have changed, or this page may not be part of the private preview.</p><div class="actions"><a class="button" href="/">Go to Home</a><a class="textlink" href="/platform">Explore the platform →</a></div></div></section>';}
  window.AyudaSearch={origin,aliases,descriptions,read,key,route,normalizeLocation,cleanLinks,apply,notFound};
  normalizeLocation();
  // New controls can insert legacy links. Make their native open-in-new-tab targets clean too.
  new MutationObserver(records=>{if(records.some(record=>record.type==='childList'||record.attributeName==='href'))cleanLinks();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
})();
