/* AyudaGrow illustrative capability visuals. No live connections or external requests. */
(function () {
  'use strict';
  const channels = [
    { key:'whatsapp', name:'WhatsApp', person:'Maya Reed', initials:'MR', hue:'#25d366', avatar:'#b4f0dc', question:'Hi! Can I book a consultation?', reply:'Of course, Maya. What day works best for you?', detail:'Consultation enquiry' },
    { key:'instagram', name:'Instagram DM', person:'Alex Morgan', initials:'AM', hue:'#e358aa', avatar:'#edd8fc', question:'Hi, I saw your post. Could you tell me more?', reply:'Hi Alex! Happy to help. Which service caught your eye?', detail:'Service information' },
    { key:'messenger', name:'Messenger', person:'Jordan Blake', initials:'JB', hue:'#4e8aff', avatar:'#d5e7ff', question:'Do you help small businesses too?', reply:'Hi Jordan, yes. Tell us a little about your business.', detail:'Business enquiry' },
    { key:'email', name:'Email', person:'Taylor Quinn', initials:'TQ', hue:'#ebbd6e', avatar:'#ffedc8', question:'Hello, could you send a quote for our team?', reply:'Hello Taylor, happy to help. What does your team need?', detail:'Request for quotation' },
    { key:'webchat', name:'Webchat', person:'Sam Ellis', initials:'SE', hue:'#68d2db', avatar:'#cceff1', question:'Hello! Is someone available to help?', reply:'Hi Sam! Yes, how can we help you today?', detail:'Website enquiry' }
  ];
  let serial = 0;
  const instances = new Set();
  const escape = s => s.replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const icon = kind => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${kind==='mail'?'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>':'<path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-6 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h6"/>'}</svg>`;
  const controls = () => '<div class="av-controls"><button type="button" data-av-replay>Replay illustration <span aria-hidden="true">↻</span></button><button type="button" data-av-pause aria-pressed="false">Pause animation</button></div>';
  // Exact brand paths: Simple Icons 16.0.0 (CC0), https://github.com/simple-icons/simple-icons/tree/16.0.0/icons
  // Marks identify sample channels only. This is a recreated illustration, not a native app screenshot.
  const channelPaths = {"whatsapp": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z", "instagram": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077", "messenger": "M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"};
  const channelIcon = key => channelPaths[key]
    ? `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="av-brand-svg"><path d="${channelPaths[key]}"/></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="av-generic-svg">${key==='email'?'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6 8.5-6"/>':'<path d="M5 3.5h14a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5h-7l-5.5 3v-3H5A2.5 2.5 0 0 1 2.5 16V6A2.5 2.5 0 0 1 5 3.5Z"/><circle cx="7.5" cy="11" r=".7"/><circle cx="12" cy="11" r=".7"/><circle cx="16.5" cy="11" r=".7"/>'}</svg>`;
  const appIcon = kind => {
    const shapes={grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',people:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M5 16c0-4 6-4 6 0m3-7h4m-4 4h4"/>',flow:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v9h9m-6-12h9v9"/>',chart:'<path d="M3 3v18h18M7 16l5-6 4 3 5-8"/>',search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',send:'<path d="m3 10 18-7-7 18-3-8-8-3Zm8 3L21 3"/>',filter:'<path d="M3 5h18M6 11h12M9 17h6"/>',star:'<path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.4l-5.6 3 1.1-6.3-4.6-4.5 6.3-.9Z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',check:'<path d="m5 12 4 4L19 6"/>',inbox:'<path d="m5 4-3 9v6a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-6l-3-9H5ZM2 13h6l2 3h4l2-3h6"/>',user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>'};
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${shapes[kind]||shapes.grid}</svg>`;
  };
  function inbox() {
    const id = 'av-inbox-' + (++serial);
    return `<figure class="av-visual av-inbox" data-av-kind="inbox" data-av-channel-key="whatsapp" data-av-phase="0" data-av-running="false" aria-labelledby="${id}-title">
      <figcaption class="av-topline"><span id="${id}-title">FIVE CHANNELS. ONE SHARED INBOX.</span><span class="av-demo-label">Recreated product illustration</span></figcaption>
      <div class="av-inbox-channel-bar" aria-label="Choose a sample conversation channel">${channels.map((c,i)=>`<button class="av-inbox-channel ${i===0?'av-selected':''}" type="button" data-av-channel="${i}" aria-pressed="${i===0}"><span class="av-platform-mark av-mark-${c.key}">${channelIcon(c.key)}</span><span>${c.name}</span></button>`).join('')}</div>
      <div class="av-app-window" aria-label="Recreated AyudaGrow Conversations interface with fictional contacts">
        <div class="av-app-topbar"><strong>AyudaGrow</strong><span>CRM <i>›</i> Conversations <i>›</i> <b>Inbox</b></span><small>${appIcon('search')} Search</small></div>
        <div class="av-app-layout">
          <aside class="av-app-nav" aria-label="Illustrative app navigation"><small>WORKSPACE</small><div>${appIcon('grid')}<span>Dashboard</span></div><div><b class="av-nav-spark">✧</b><span>AI</span></div><div class="av-app-nav-selected">${appIcon('people')}<span>CRM</span></div><div>${appIcon('flow')}<span>Automations</span></div><div>${icon('chat')}<span>Marketing</span></div><div>${appIcon('grid')}<span>Sites</span></div><div>${appIcon('chart')}<span>Reporting</span></div><div class="av-app-nav-bottom">${appIcon('user')}<span>Your team</span></div></aside>
          <aside class="av-app-folders" aria-label="Illustrative inbox folders"><div class="av-new-conversation">${icon('chat')}<span>New conversation</span></div><div class="av-folder-search">${appIcon('search')}<span>Search</span></div><small>My inbox <span>⌃</span></small><div>${appIcon('inbox')} All</div><div>${appIcon('user')} Assigned to me</div><div>${appIcon('people')} Followed by me</div><div class="av-folder-selected">Team inbox</div><div>Internal chat</div><small class="av-views-label">Views <span>⌃</span></small><div class="av-create-view">+ Create view</div></aside>
          <div class="av-app-team"><div class="av-team-title"><strong>Team inbox</strong><span>${appIcon('filter')}</span></div><div class="av-team-tabs" aria-hidden="true"><span>${appIcon('inbox')}Unread</span><span class="av-team-tab-active">${appIcon('inbox')}All</span><span>${appIcon('clock')}Recent</span><span>${appIcon('star')}Starred</span></div><div class="av-list-heading"><span>□ Select all</span><span>Newest first ↓</span></div><div class="av-team-list" aria-label="Fictional example conversations">${channels.map((c,i)=>`<button type="button" class="av-contact-row ${i===0?'av-selected':''}" data-av-channel="${i}" aria-pressed="${i===0}" aria-label="View ${c.person} sample ${c.name} conversation"><span class="av-contact-avatar" style="--av-avatar:${c.avatar}">${c.initials}<i class="av-platform-mark av-mark-${c.key}">${channelIcon(c.key)}</i></span><span class="av-contact-copy"><strong><span>${c.person.split(' ')[0]}</span><span class="av-contact-surname"> ${c.person.split(' ').slice(1).join(' ')}</span></strong><small data-av-preview="${i}">${c.question}</small></span><span class="av-contact-meta"><time>Now</time><b>1</b></span></button>`).join('')}</div><div class="av-list-footnote">All contacts and messages are fictional.</div></div>
          <div class="av-app-conversation"><div class="av-conversation-tabs"><span>${icon('chat')} Conversations</span><small>${appIcon('clock')} Activity</small></div><div class="av-conversation-person"><span class="av-person-avatar" data-av-avatar>MR</span><div><strong data-av-person>Maya Reed</strong><small><span class="av-platform-mark av-mark-whatsapp" data-av-selected-mark>${channelIcon('whatsapp')}</span><span data-av-source>WhatsApp</span></small></div><span class="av-conversation-tools" aria-hidden="true">${appIcon('search')}${appIcon('star')}<b>⋯</b></span></div>
            <div class="av-conversation-history"><div class="av-conversation-date">Today</div><div class="av-new-message-label"><span>New message</span></div><div class="av-app-message av-app-message-in"><div class="av-message-email-subject">Subject: Request for quotation</div><span data-av-question>${channels[0].question}</span><small><span data-av-person>Maya Reed</span> · 10:42</small></div><div class="av-shared-context"><span>${appIcon('check')}</span> Assigned to your team <i>·</i> Context in one place</div><div class="av-app-message av-app-message-out"><span data-av-answer>${channels[0].reply}</span><small>Your team · 10:43 <b data-av-delivery>✓</b></small></div><div class="av-message-route"><span class="av-platform-mark av-mark-whatsapp" data-av-selected-mark>${channelIcon('whatsapp')}</span><span data-av-route-copy>Incoming via WhatsApp</span></div></div>
            <div class="av-app-composer"><div class="av-composer-channel"><span class="av-platform-mark av-mark-whatsapp" data-av-selected-mark>${channelIcon('whatsapp')}</span><strong>Reply via <span data-av-return>WhatsApp</span></strong><span>⌄</span><small>Sample reply</small></div><div class="av-composer-body"><span data-av-composer>Type a message…</span><span class="av-composer-send" aria-hidden="true">${appIcon('send')}</span></div><div class="av-composer-bottom"><span aria-hidden="true">＋ &nbsp; ♧ &nbsp; ☺</span><span>Same conversation. Same channel.</span></div></div>
          </div>
        </div>
      </div><div class="av-storyline" aria-live="polite"><span class="av-step-dot" aria-hidden="true"></span><span data-av-status>Choose a channel to follow an enquiry and its reply.</span></div>${controls()}<p class="av-disclaimer">Recreated illustration based on the AyudaGrow interface, with fictional contacts and messages. Not a live account or a screenshot of WhatsApp, Instagram or Messenger. Channel availability, permissions, response windows and setup must be confirmed; replies use the originating channel when supported and configured.</p>
    </figure>`;
  }
  function companion(kind) {
    const reactivate = kind === 'reactivation';
    const id = 'av-journey-' + (++serial);
    const steps = reactivate ? [ ['01','Select a suitable group','Review consent, history and relevance.'],['02','Give a useful reason','Prepare a relevant invitation to reconnect.'],['03','Welcome the response','Bring replies back into the conversation.'],['04','Let people follow through','A team member owns the next step.'] ] : [ ['01','A quotation is shared','Keep the opportunity and its context together.'],['02','Assign the next action','Give follow-up an owner and an agreed date.'],['03','Surface the reminder','Bring the task into the team’s daily view.'],['04','Follow through personally','Review, respond and record what happens next.'] ];
    return `<figure class="av-visual av-journey av-${kind}" data-av-kind="${kind}" data-av-phase="0" data-av-running="false" aria-labelledby="${id}-title"><figcaption class="av-topline"><span id="${id}-title">${reactivate?'OLD CONNECTIONS. A NEW CONVERSATION.':'A GOOD QUOTE DESERVES A NEXT STEP.'}</span><span class="av-demo-label">Illustrative workflow</span></figcaption><div class="av-journey-canvas"><div class="av-journey-intro"><div class="av-mini-records" aria-hidden="true"><span></span><span></span><span></span></div><span class="av-journey-kicker">${reactivate?'From dormant contact':'From open opportunity'}</span><strong>${reactivate?'Reconnect with relevance.':'Remember the follow-through.'}</strong><span class="av-journey-sub">${reactivate?'Human relationships, supported by thoughtful automation.':'AI and automation support the work. Your team owns the relationship.'}</span></div><ol class="av-journey-steps">${steps.map((s,i)=>`<li data-av-step="${i}" class="${i===0?'av-step-active':''}"><span class="av-step-number">${s[0]}</span><div><strong>${s[1]}</strong><span>${s[2]}</span></div><span class="av-step-check" aria-hidden="true">✓</span></li>`).join('')}</ol></div><div class="av-guardrail"><span aria-hidden="true">✓</span>${reactivate?'Respect opt-outs. Check permission. Keep the message relevant.':'Agreed timing. Clear ownership. People in control.'}</div><div class="av-storyline" aria-live="polite"><span class="av-step-dot" aria-hidden="true"></span><span data-av-status>${reactivate?'A dormant record can become a useful conversation.':'Follow the path from a shared quote to the next action.'}</span></div>${controls()}<p class="av-disclaimer">${reactivate?'Illustrative sequence, not a customer result. Only contact eligible recipients through permitted channels. No response, revenue or reactivation outcome is guaranteed.':'Illustrative sequence. Workflow timing, notifications and AI assistance depend on the agreed configuration. No automatic sending or guaranteed outcome is implied.'}</p></figure>`;
  }
  const aiChapters = [
    {label:'Approved knowledge',kicker:'START WITH YOUR BUSINESS',title:'Knowledge you approve.',text:'Services, policies and useful answers, reviewed by your team.',cardLabel:'BUSINESS KNOWLEDGE',cardTitle:'A reliable starting point',cardText:'Approved service information • Agreed policies • Clear boundaries',footer:'Configured knowledge source',status:'Your team selects and approves the business knowledge the AI can use.'},
    {label:'Customer question',kicker:'A CONVERSATION BEGINS',title:'A customer has a question.',text:'The configured chatbot receives the enquiry and its conversation context.',cardLabel:'SAMPLE CUSTOMER QUESTION',cardTitle:'“How do I arrange a consultation?”',cardText:'A practical question. A chance to give a useful next step.',footer:'Illustrative conversation',status:'A customer asks a question through a configured conversational channel.'},
    {label:'Answer or action',kicker:'USE THE AGREED KNOWLEDGE',title:'A useful response. A clear boundary.',text:'Draw on approved information. Use an action only when its tool and permissions are configured.',cardLabel:'ILLUSTRATIVE AI RESPONSE',cardTitle:'“I can explain the next steps.”',cardText:'“Would you like me to help with your enquiry?”',footer:'Grounded response • Configured actions only',status:'The AI uses approved knowledge to respond; any action depends on configured tools and permissions.'},
    {label:'Human handoff',kicker:'BRING IN THE RIGHT PERSON',title:'People take the lead when needed.',text:'Questions outside the agreed scope move to your team with useful context.',cardLabel:'HANDOFF TO YOUR TEAM',cardTitle:'“Let me bring in a colleague.”',cardText:'Customer question, conversation history and the reason for handoff stay together.',footer:'Human judgment • Shared context',status:'The conversation moves to a person when the agreed handoff rules call for it.'},
    {label:'Reviewed update',kicker:'IMPROVE WITH OVERSIGHT',title:'Review. Approve. Update.',text:'Your team reviews useful gaps, approves a change and updates the knowledge source.',cardLabel:'TEAM-REVIEWED KNOWLEDGE CHANGE',cardTitle:'A clearer answer for next time.',cardText:'Proposed improvement → Human approval → Published knowledge update',footer:'Reviewed updates, not autonomous learning',status:'Knowledge improves through a reviewed, approved update, not autonomous self-learning.'}
  ];
  function ai() {
    const chapters=aiChapters, id='av-ai-'+(++serial), c=chapters[0];
    const title='BUSINESS KNOWLEDGE, POWERING YOUR AI.';
    const commonCard=`<div class="av-ai-response"><span class="av-ai-card-label" data-av-ai="cardLabel">${c.cardLabel}</span><strong data-av-ai="cardTitle">${c.cardTitle}</strong><p data-av-ai="cardText">${c.cardText}</p><div class="av-ai-card-footer" data-av-ai="footer">${c.footer}</div></div>`;
    const scene=`<div class="av-ai-stage"><div class="av-ai-orbit" aria-hidden="true"><div class="av-ai-ring av-ai-ring-one"></div><div class="av-ai-ring av-ai-ring-two"></div><div class="av-ai-note av-ai-note-one"><span>✓</span> Approved knowledge</div><div class="av-ai-note av-ai-note-two"><span>✓</span> Your business rules</div><div class="av-ai-core"><span class="av-ai-core-star">✦</span><strong>Your AI</strong><small>Configured for your business</small></div><div class="av-ai-bridge"><span></span><span></span><span></span></div></div>${commonCard}</div><div class="av-ai-agent-row av-knowledge-channels"><div class="av-knowledge-heading"><strong>One approved knowledge source</strong><p>That powers your conversations across:</p></div><ul class="av-knowledge-bubbles" aria-label="Supported channels, subject to setup">${[['webchat','Website Chat'],['whatsapp','WhatsApp Chat'],['whatsapp','WhatsApp Voice Calls*'],['email','Emails'],['instagram','Instagram'],['messenger','Facebook Messenger']].map(([key,label])=>`<li><span class="av-platform-mark av-mark-${key}">${channelIcon(key)}</span><span>${label}</span></li>`).join('')}</ul><small>Attach the knowledge source and configure each chat or voice agent separately. *WhatsApp calling requires eligibility and setup. Features and usage depend on your plan.</small></div>`;
    return `<figure class="av-visual av-ai av-ai-knowledge" data-av-kind="ai" data-av-variant="knowledge" data-av-phase="0" data-av-running="false" aria-labelledby="${id}-title"><figcaption class="av-topline"><span id="${id}-title">${title}</span><span class="av-demo-label">Illustrative workflow</span></figcaption><div class="av-ai-chapters" aria-label="Explore the AI workflow">${chapters.map((x,i)=>`<button type="button" data-av-chapter="${i}" aria-pressed="${i===0}" class="${i===0?'av-chapter-active':''}"><span>0${i+1}</span>${x.label}</button>`).join('')}</div>${scene}<div class="av-ai-chapter-copy"><span data-av-ai="kicker">${c.kicker}</span><strong data-av-ai="title">${c.title}</strong><p data-av-ai="text">${c.text}</p></div><div class="av-storyline" aria-live="polite"><span class="av-step-dot" aria-hidden="true"></span><span data-av-status>${c.status}</span></div>${controls()}<p class="av-disclaimer">Illustration, not a live AI session. Knowledge can support separately configured chat and voice agents; availability and actions depend on setup. Voice AI is distinct from chat messaging. WhatsApp calling is conditional, not a universal capability. Knowledge changes require review and approval.</p></figure>`;
  }
  const messages = {
    inbox: [c=>`An enquiry arrives through ${c.name}.`, c=>'The shared inbox keeps context together for AI support and your team.', c=>`A response travels back through ${c.name}, the original channel.`, c=>`One conversation, with the reply returned through ${c.name}.`],
    reactivation: ['Review suitable contacts and communication permissions.','Prepare a relevant, approved reason to reconnect.','A response returns to the shared conversation.','A person takes the next step. Opt-outs remain respected.'],
    followup: ['A quotation is shared and its context stays visible.','Assign the follow-up to the right person.','Surface an agreed reminder so the task is not forgotten.','Your team follows through and records the outcome.']
  };
  function mount(container) {
    const scope = container || document;
    scope.querySelectorAll('.av-visual').forEach(el => {
      if (el.dataset.avMounted) return;
      el.dataset.avMounted='true';
      const state={el,kind:el.dataset.avKind,selected:0,phase:0,elapsed:0,last:0,visible:false,localPause:false,done:false,frame:0,disposed:false};
      const phaseCount=state.kind==='ai'?5:4, phaseMs=state.kind==='ai'?3600:2600, endMs=state.kind==='ai'?17000:9000;
      const media=window.matchMedia('(prefers-reduced-motion: reduce)');
      const blocked=()=> state.localPause || document.body.classList.contains('paused') || media.matches || document.hidden;
      const paint=phase=>{
        state.phase=phase;el.dataset.avPhase=String(phase);
        if(state.kind==='ai'){
          const chapter=aiChapters[phase];
          el.querySelectorAll('[data-av-ai]').forEach(n=>n.textContent=chapter[n.dataset.avAi]);
          el.querySelectorAll('[data-av-chapter]').forEach((n,i)=>{n.classList.toggle('av-chapter-active',i===phase);n.setAttribute('aria-pressed',String(i===phase))});
          el.querySelector('[data-av-status]').textContent=chapter.status;
        } else if(state.kind==='inbox'){
          const c=channels[state.selected];
          el.querySelectorAll('[data-av-source],[data-av-return]').forEach(n=>n.textContent=c.name);
          el.dataset.avChannelKey=c.key;
          el.querySelectorAll('[data-av-person]').forEach(n=>n.textContent=c.person);
          el.querySelector('[data-av-avatar]').textContent=c.initials;
          el.querySelector('[data-av-avatar]').style.setProperty('--av-avatar',c.avatar);
          el.querySelectorAll('[data-av-selected-mark]').forEach(n=>{n.className='av-platform-mark av-mark-'+c.key;n.innerHTML=channelIcon(c.key)});
          el.querySelector('[data-av-question]').textContent=c.question;
          el.querySelector('[data-av-answer]').textContent=c.reply;
          el.querySelector('.av-app-message-out').setAttribute('aria-hidden',String(phase<2));
          el.querySelector('[data-av-composer]').textContent=phase===1?'A sample reply is being prepared…':phase>=2?'Reply sent. Keep the conversation going…':'Type a message…';
          el.querySelector('[data-av-delivery]').textContent=phase===3?'✓✓':'✓';
          el.querySelector('[data-av-route-copy]').textContent=phase<2?'Incoming via '+c.name:'Reply returned via '+c.name;
          el.querySelectorAll('[data-av-preview]').forEach(n=>{const i=Number(n.dataset.avPreview);n.textContent=i===state.selected&&phase>=2?'You: '+c.reply:channels[i].question});
          el.querySelector('[data-av-status]').textContent=messages.inbox[phase](c);
        } else {
          el.querySelector('[data-av-status]').textContent=messages[state.kind][phase];
          el.querySelectorAll('[data-av-step]').forEach((n,i)=>{n.classList.toggle('av-step-active',i===phase);n.classList.toggle('av-step-complete',i<phase)});
        }
      };
      const stop=()=>{cancelAnimationFrame(state.frame);state.frame=0;state.last=0;el.dataset.avRunning='false'};
      const tick=now=>{
        if(state.disposed||!state.visible||blocked()||state.done){stop();return;}
        if(state.last)state.elapsed+=Math.min(now-state.last,200);
        state.last=now;
        const phase=Math.min(phaseCount-1,Math.floor(state.elapsed/phaseMs));
        if(phase!==state.phase)paint(phase);
        if(state.elapsed>=endMs){state.done=true;stop();return;}
        state.frame=requestAnimationFrame(tick);
      };
      const sync=()=>{
        const pause=el.querySelector('[data-av-pause]');
        pause.textContent=state.localPause?'Resume animation':'Pause animation';pause.setAttribute('aria-pressed',String(state.localPause));
        el.classList.toggle('av-reduced-motion',media.matches);
        if(media.matches){stop();if(!state.manualPhase)paint(phaseCount-1);state.done=true;return;}
        if(!state.visible||blocked()||state.done){stop();return;}
        if(!state.frame){el.dataset.avRunning='true';state.frame=requestAnimationFrame(tick);}
      };
      const restart=()=>{stop();state.elapsed=0;state.done=false;state.localPause=false;state.manualPhase=false;paint(media.matches?phaseCount-1:0);sync();};
      const onClick=e=>{
        const button=e.target.closest('button');if(!button||!el.contains(button))return;
        if(button.hasAttribute('data-av-chapter')){
          stop();state.manualPhase=true;state.elapsed=Number(button.dataset.avChapter)*phaseMs;state.done=false;state.localPause=true;paint(Number(button.dataset.avChapter));sync();
        } else if(button.hasAttribute('data-av-channel')){
          state.selected=Number(button.dataset.avChannel);
          el.querySelectorAll('[data-av-channel]').forEach(b=>{const selected=Number(b.dataset.avChannel)===state.selected;b.classList.toggle('av-selected',selected);b.setAttribute('aria-pressed',String(selected))});
          el.querySelectorAll('[data-av-route]').forEach((p,i)=>p.classList.toggle('av-selected-route',i===state.selected));
          restart();
        }else if(button.hasAttribute('data-av-replay'))restart();
        else if(button.hasAttribute('data-av-pause')){state.localPause=!state.localPause;sync();}
      };
      el.addEventListener('click',onClick);
      const observer=new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;sync();},{threshold:0.22});observer.observe(el);
      const bodyObserver=new MutationObserver(sync);bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
      const onVisibility=()=>sync();document.addEventListener('visibilitychange',onVisibility);
      media.addEventListener('change',sync);
      state.destroy=()=>{state.disposed=true;stop();observer.disconnect();bodyObserver.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',onVisibility);el.removeEventListener('click',onClick);delete el.dataset.avMounted;instances.delete(state);};
      instances.add(state);paint(media.matches?phaseCount-1:0);sync();
    });
  }
  function cleanup(){Array.from(instances).forEach(s=>s.destroy());}
  window.AyudaVisuals={ai,inbox,reactivation:()=>companion('reactivation'),followup:()=>companion('followup'),mount,cleanup};
})();
