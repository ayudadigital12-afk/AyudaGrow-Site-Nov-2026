/* Plan summaries follow the approved retail matrix. The embedded form owns submission. */
(() => {
  'use strict';
  const forms = {
    essentials:'CkmLMXN55hD2X9hCfO4j',
    core:'65wBICRDMlJ7RTZPK3dG',
    build:'XidHogjcgDQ48zVVZKSz',
    scale:'abrMomyu1JJgrxPvWYLh'
  };
  const features = {
    essentials:['Up to 5 team members','Unlimited contacts','3 calendars and 3 sales pipelines','Email, web chat and social inbox','AI website and workflow builders','2 hours of guided setup in your first paid month'],
    core:['Unlimited team members, contacts and pipelines','10 calendars','Everything in Essentials','AI writing and content tools','Email campaigns and social planner','3 hours of guided setup in your first paid month'],
    build:['Unlimited team members, calendars and pipelines','Everything in Core','1,000 AI text responses per month across 4 channels','AI review replies and Google Business Profile tools','Custom reports','5 hours of guided setup in your first paid month'],
    scale:['Unlimited team members, calendars and pipelines','Everything in Build','Unlimited AI text responses, subject to fair use','Voice AI on web chat and eligible WhatsApp calls','Online store, webinars and quizzes','5 hours of guided setup in your first paid month']
  };
  const lock='<svg width="16" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 6v2"/></svg>';
  for (const p of window.AyudaPlans.plans) {
    const formId=forms[p.id], formUrl='https://grow.ayudagrow.com/widget/form/'+formId;
    pages['signup/'+p.id]=()=>`<section class="ag-purchase" data-signup-plan="${p.id}"><div class="wrap">
      <a class="ag-purchase-back" href="/pricing">&#8592; Back to plans</a>
      <ol class="ag-purchase-steps" aria-label="Signup steps"><li aria-current="step"><b>1</b> Your details</li><li><b>2</b> Stripe checkout</li><li><b>3</b> Next steps</li></ol>
      <div class="ag-purchase-grid">
        <aside class="ag-purchase-summary" aria-label="Your selected plan">
          <div class="ag-purchase-badges"><span class="ag-purchase-pill">${p.name}</span>${p.id==='build'?'<span class="ag-purchase-popular">Most popular</span>':''}</div>
          <h2>A stronger next step<br>for your business.</h2><p class="ag-purchase-purpose">${p.purpose}</p>
          <p class="ag-purchase-price"><strong>US$${p.price}</strong><span>/month</span></p><p class="ag-purchase-billing">Monthly subscription. Billed in US dollars.</p>
          ${p.trialDays?'<div class="ag-purchase-trial"><span class="ag-purchase-pill">7-day free trial</span><p>Card required. Then US$99/month unless cancelled before the trial ends. Check the trial and amount due on Stripe before confirming.</p></div>':''}
          <ul class="ag-purchase-features">${features[p.id].map(f=>'<li><span aria-hidden="true">&#10003;</span>'+f+'</li>').join('')}</ul>
          <div class="ag-purchase-inclusions"><b>Practical support included</b><p>1 hour of basic support per month, subject to fair use. Configure supported tools yourself or use your guided setup hours.</p></div>
          <p class="ag-purchase-small">${p.id==='essentials'?'WhatsApp is optional at US$19/month.':'WhatsApp connection included.'} Billable messages, email delivery and optional services are separate.${p.id==='essentials'||p.id==='core'?' Customer-facing chatbot and Voice AI are not included.':''}${p.id==='build'?' At the AI limit, choose to pause or continue with paid overages. Confirm usage settings before activation.':''}</p>
          <p class="ag-purchase-trust">Monthly subscription &middot; Review cancellation terms before checkout</p>
          <img class="ag-purchase-mark" src="/assets/brand-growth-ring-acrylic-optimized.webp" alt="" width="140" height="140">
        </aside>
        <div class="ag-purchase-form-card">
          <span class="eyebrow">Your details</span><h1>Start your ${p.name} plan.</h1><p class="ag-purchase-intro">Tell us about you and your business. You&rsquo;ll complete checkout on Stripe next.</p>
          <p class="ag-purchase-email-note">Use the same email here and at checkout so we can match your payment to your signup.</p>
          <iframe src="${formUrl}" style="width:100%;height:560px;border:none;" id="inline-${formId}" data-layout="{'id':'INLINE'}" data-trigger-type="alwaysShow" data-activation-type="alwaysActivated" data-deactivation-type="neverDeactivate" data-form-id="${formId}" title="${p.name} Checkout Sign-up" referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <p class="ag-purchase-secure">${lock}<span>Secure checkout powered by Stripe</span></p>
          <p class="ag-purchase-privacy">We use these details to handle your signup and account setup. <a href="/privacy">Privacy information</a>. Don&rsquo;t enter card details in this form.</p>
          <details class="ag-purchase-help"><summary>Form not loading?</summary><p><a href="${formUrl}" target="_blank" rel="noopener">Open the ${p.name} signup form in a new tab</a>, or email <a href="mailto:admin@ayudagrow.com">admin@ayudagrow.com</a> for help.</p></details>
          <div class="ag-purchase-next"><h2>What happens next?</h2><p>Submit your details, then review your subscription on Stripe. After checkout, keep your confirmation and look out for your account setup instructions.</p><p class="ag-purchase-small">Submitting this form alone doesn&rsquo;t activate a paid account.</p></div>
        </div>
      </div>
    </div></section>`;
  }
  // Full document navigation at checkout boundaries gives the supplied embed a clean lifecycle.
  // No customer details or payment state are persisted by this page.
  function loadEmbed(){
    if(!document.querySelector('[data-signup-plan]')||document.querySelector('script[src^="https://grow.ayudagrow.com/js/form_embed.js"]'))return;
    const script=document.createElement('script');script.src='https://grow.ayudagrow.com/js/form_embed.js';script.defer=true;document.body.append(script);
  }
  document.addEventListener('DOMContentLoaded',loadEmbed,{once:true});
  render();
})();
