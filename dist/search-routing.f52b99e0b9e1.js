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
    'who-its-for/b2c':'appointments', 'how-it-works':'support', 'free-trial':'signup/essentials', 'get-started':'pricing', 'book':'contact'
  };
  const titles = {
  "signup/essentials": "Start Your Essentials Plan | AyudaGrow",
  "signup/core": "Start Your Core Plan | AyudaGrow",
  "signup/build": "Start Your Build Plan | AyudaGrow",
  "signup/scale": "Start Your Scale Plan | AyudaGrow",
  "home": "CRM and AI Automation for Caribbean Businesses | AyudaGrow",
  "platform": "AI and CRM Platform for Business Growth | AyudaGrow",
  "solutions": "CRM and Automation Solutions for Business Growth | AyudaGrow",
  "inbox": "Unified Inbox for Customer Conversations | AyudaGrow",
  "ai": "Business AI Assistants with Human Handoff | AyudaGrow",
  "crm": "CRM & Sales Pipeline for Clearer Follow-Up | AyudaGrow",
  "appointments": "Appointment Booking and Follow-Up Workflows | AyudaGrow",
  "consultative-sales": "Consultative Sales and Quote Follow-Up | AyudaGrow",
  "use-cases": "CRM and AI Use Cases for Business Teams | AyudaGrow",
  "lead-capture": "Lead Capture for Enquiries and Follow-Up | AyudaGrow",
  "follow-up": "Sales Follow-Up and Reminders for Teams | AyudaGrow",
  "reactivation": "Customer Reactivation and Useful Follow-Up | AyudaGrow",
  "automation": "Workflow Automation for Customer Follow-Up | AyudaGrow",
  "reporting": "Reporting & Forecasting for Business Planning | AyudaGrow",
  "reputation": "Reputation and Google Business Profile Care | AyudaGrow",
  "integrations": "Business Integrations and Mobile Workflows | AyudaGrow",
  "marketing": "Marketing Tools for Campaigns and Enquiries | AyudaGrow",
  "commerce": "Commerce and Payment Workflows for Your Business | AyudaGrow",
  "learning": "Courses and Communities for Your Customers | AyudaGrow",
  "support": "CRM Setup, Training and Support for Teams | AyudaGrow",
  "pricing": "CRM and AI Plans from US$99 per Month | AyudaGrow",
  "privacy": "Privacy Policy | AyudaGrow",
  "cookies": "Cookie Policy | AyudaGrow",
  "contact": "Contact Our CRM, AI and Business Automation Team | AyudaGrow",
  "growth-assessment": "Business Growth Assessment and Follow-Up Guide | AyudaGrow",
  "learn": "What Is CRM? A Practical Business Guide | AyudaGrow",
  "solutions/book-more-appointments": "Book More Appointments with Connected Follow-Up | AyudaGrow",
  "solutions/convert-more-leads": "Convert More Leads with Clearer Follow-Up | AyudaGrow",
  "solutions/generate-more-reviews": "Generate More Reviews with Honest Feedback | AyudaGrow",
  "solutions/improve-customer-communication": "Improve Customer Communication and Context | AyudaGrow",
  "solutions/improve-sales-follow-up": "Improve Sales Follow-Up with Clear Owners | AyudaGrow",
  "solutions/manage-sales-opportunities": "Manage Sales Opportunities in a CRM Pipeline | AyudaGrow",
  "solutions/reactivate-customers": "Reactivate Customers with Relevant Follow-Up | AyudaGrow"
};
  const descriptions = {
  "signup/essentials": "Sign up for AyudaGrow Essentials at US$99 per month. Share your business details, then continue to Stripe to review and complete your subscription.",
  "signup/core": "Sign up for AyudaGrow Core at US$149 per month. Share your business details, then continue to Stripe to review and complete your subscription.",
  "signup/build": "Sign up for AyudaGrow Build at US$249 per month. Share your business details, then continue to Stripe to review and complete your subscription.",
  "signup/scale": "Sign up for AyudaGrow Scale at US$349 per month. Share your business details, then continue to Stripe to review and complete your subscription.",
  "home": "Explore CRM, AI and automation for your Caribbean business. Connect enquiries and follow-up with practical AyudaGrow setup, training and ongoing support.",
  "platform": "See how AI, CRM, conversations and workflows connect in one platform. Explore AyudaGrow’s approach to setup, customer context and practical team support.",
  "solutions": "Find tools for customer enquiries, follow-up, appointments and sales. Explore AyudaGrow capabilities and agree the workflow your business needs to grow.",
  "inbox": "Bring supported customer conversations into a shared inbox. Explore channel setup, team ownership and human handoff with AyudaGrow’s connected platform.",
  "ai": "Explore an AI assistant grounded in your approved business knowledge. Agree supported channels, useful tasks and human handoff with AyudaGrow before setup.",
  "crm": "Keep customer records, sales stages and next actions connected. Explore AyudaGrow CRM views that help sales teams and managers work with shared context.",
  "appointments": "Connect appointment enquiries, calendar rules and follow-up. See illustrative AyudaGrow workflows and discuss the setup your team and customers need.",
  "consultative-sales": "Keep enquiries, discovery, quotations and follow-up connected. Explore AyudaGrow workflows for consultative sales while your team leads the relationship.",
  "use-cases": "Explore appointment-driven and consultative business journeys. See how AyudaGrow can adapt CRM, AI and follow-up around the way your business sells.",
  "lead-capture": "Connect forms, campaigns and supported enquiries to a customer record. Explore how AyudaGrow helps organise sources, owners and the next useful action.",
  "follow-up": "Keep quotations, enquiries and appointments moving with clear owners and reminders. Explore AyudaGrow follow-up workflows shaped around your process.",
  "reactivation": "Find relevant ways to reconnect with eligible past customers and older enquiries. Explore AyudaGrow workflows that respect preferences and permissions.",
  "automation": "Connect repeatable tasks, customer information and follow-up with agreed rules. Explore practical AyudaGrow automation while keeping people responsible.",
  "reporting": "Review pipeline, sources and expected revenue using current CRM data. Explore AyudaGrow reporting examples, forecasting limits and practical setup needs.",
  "reputation": "Explore honest review workflows and Google Business Profile support. Agree access, eligibility and managed-service scope with AyudaGrow before starting.",
  "integrations": "Explore ways to connect business tools and mobile workflows. Discuss supported actions, account permissions and practical integration setup with AyudaGrow.",
  "marketing": "Connect content and campaigns to customer enquiries and follow-up. Explore AyudaGrow marketing tools, with publishing and delivery scope agreed first.",
  "commerce": "Explore invoices, estimates, payment links and connected orders. Agree available tools, regional access and service responsibilities with AyudaGrow first.",
  "learning": "Explore course, membership and community tools within your customer journey. Discuss content, moderation and access configuration with AyudaGrow’s team.",
  "support": "Turn a useful business priority into a practical setup. Learn how AyudaGrow approaches assessment, configuration, team training and ongoing support.",
  "pricing": "Compare four AyudaGrow plans at US$99, US$149, US$249 and US$349 per month. Explore the free 7-day Essentials trial, tools, AI allowances and setup.",
  "privacy": "How Ayuda Grow LLC handles personal information, AI chat, signup, payments, retention and privacy requests.",
  "cookies": "Learn about AyudaGrow navigation storage, embedded signup and AI chat, Stripe checkout, and your browser privacy choices.",
  "contact": "Contact AyudaGrow about customer enquiries, sales follow-up and your business workflow. Email or call the team to discuss where practical support can help.",
  "growth-assessment": "Use six questions to review enquiries, follow-up and business growth. Prepare for an AyudaGrow conversation with this guide, not an online assessment.",
  "learn": "Learn how CRM connects customer records, conversation history and next actions. Explore practical examples and a clear starting point for your business.",
  "solutions/book-more-appointments": "Explore how enquiries, booking details and reminders can support the appointment journey. Review illustrative AyudaGrow workflows and agree your setup.",
  "solutions/convert-more-leads": "Give new enquiries a useful response, a clear owner and a next step. Explore AyudaGrow workflows for qualification and follow-up without promised results.",
  "solutions/generate-more-reviews": "Make appropriate review invitations part of customer follow-up. Explore AyudaGrow tools and separately scoped support for honest feedback and reputation.",
  "solutions/improve-customer-communication": "Keep conversation history and team ownership connected across supported channels. Explore AyudaGrow workflows for useful replies and clear human handoff.",
  "solutions/improve-sales-follow-up": "Give sales follow-up a clear owner, due date and shared context. Explore AyudaGrow reminders that respect customer permissions and agreed stop conditions.",
  "solutions/manage-sales-opportunities": "Organise sales stages, opportunity records and meaningful next actions. Explore AyudaGrow CRM workflows and reporting for clearer management visibility.",
  "solutions/reactivate-customers": "Reconnect with eligible past customers and paused enquiries for a useful reason. Explore AyudaGrow follow-up that respects preferences and clear ownership."
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
    const description=missing?'The requested AyudaGrow page was not found. Explore the platform, solutions or homepage.':descriptions[currentKey];
    const canonical=origin + (currentKey==='home'?'/':'/'+currentKey);
    title=titles[currentKey]||title;
    document.title=title;
    setMeta('meta[name="robots"]',{name:'robots',content:(document.documentElement.dataset.environment==='production'&&!location.hostname.startsWith('staging')&&!missing&&!/^(signup\/|privacy$|cookies$|terms$)/.test(currentKey)?'index,follow':document.documentElement.dataset.environment==='production'&&!missing&&!location.hostname.startsWith('staging')?'noindex,follow':'noindex,nofollow')});
    setMeta('meta[name="description"]',{name:'description',content:description || 'Explore AyudaGrow’s AI, automation and practical support. Capabilities and service scope depend on the agreed setup.'});
    const image=origin+'/assets/share-default.png';
    for(const [property,content] of Object.entries({'og:type':'website','og:site_name':'AyudaGrow','og:title':title,'og:description':description,'og:image':image,'og:image:alt':'AyudaGrow. Connect. Automate. Grow. CRM and AI for your business.','og:image:type':'image/png','og:image:width':'1200','og:image:height':'630','og:locale':'en_US'}))setMeta('meta[property="'+property+'"]',{property,content:content||''});
    for(const [name,content] of Object.entries({'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,'twitter:image':image,'twitter:image:alt':'AyudaGrow logo'}))setMeta('meta[name="'+name+'"]',{name,content:content||''});
    document.head.querySelector('#ayuda-structured-data')?.remove();
    if(missing){document.head.querySelector('link[rel="canonical"]')?.remove();document.head.querySelector('meta[property="og:url"]')?.remove();}
    else {
      setMeta('link[rel="canonical"]',{rel:'canonical',href:canonical});
      setMeta('meta[property="og:url"]',{property:'og:url',content:canonical});
      const label=title.replace(/^AyudaGrow \| /,'').replace(/ \| AyudaGrow$/,'');
      const graph=[
        {'@type':'Organization','@id':origin+'/#organization',name:'AyudaGrow',url:origin+'/',logo:origin+'/assets/logo.webp',description:'CRM, AI and automation with practical setup and support for businesses in Jamaica and the Caribbean',founder:{'@type':'Person',name:'Rasheed Girvan'},areaServed:['Jamaica','Caribbean']},
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
    window.AyudaResources?.apply();
    cleanLinks();
  }
  function notFound(){return '<section class="page-hero"><div class="wrap"><span class="eyebrow">Page not found</span><h1>That page is not here.</h1><p>The address may have changed, or the page may no longer be available.</p><div class="actions"><a class="button" href="/">Go to Home</a><a class="textlink" href="/platform">Explore the platform →</a></div></div></section>';}
  window.AyudaSearch={origin,aliases,titles,descriptions,read,key,route,normalizeLocation,cleanLinks,apply,notFound};
  normalizeLocation();
  // New controls can insert legacy links. Make their native open-in-new-tab targets clean too.
  new MutationObserver(records=>{if(records.some(record=>record.type==='childList'||record.attributeName==='href'))cleanLinks();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
})();

