/* Restore a visit, not just a route: Back/Forward keep each history entry's place. */
(function () {
  'use strict';
  const stateKey = 'ayudaVisit';
  const main = document.getElementById('main');
  const cacheKey='ayudaVisits:clean-v1';
  let cached=[];
  try{cached=JSON.parse(sessionStorage.getItem(cacheKey)||'[]');}catch{}
  const visits = new Map(Array.isArray(cached)?cached.filter(item=>Array.isArray(item)&&item.length===2&&item[1]?.id===item[0]):[]);
  function saveCache(){try{sessionStorage.setItem(cacheKey,JSON.stringify([...visits].slice(-100)));}catch{}}
  const selectionAttributes = [
    'data-growth-stage', 'data-reporting-days', 'data-capability-filter',
    'data-crm-role', 'data-team-role', 'data-booking-moment',
    'data-connection-moment', 'data-reputation-mode', 'data-inbox-step',
    'data-demo', 'data-ag-piece', 'data-av-channel', 'data-av-chapter'
  ];
  const focusable = 'a,button,summary,input,select,textarea,[tabindex]';
  let activeId, renderedUrl = location.href, restoring = false, restoreVersion = 0;
  const route = () => window.AyudaSearch?.route() || location.hash || '#/';
  const newVisit = () => ({id:crypto.randomUUID(), route:route(), x:0, y:0});
  const write = visit => history.replaceState({...history.state, [stateKey]:visit}, '');
  const sections = () => [...main.children];

  function capture() {
    const selections = [];
    selectionAttributes.forEach(attribute => {
      main.querySelectorAll(`[${attribute}]`).forEach((button,index) => {
        if (button.getAttribute('aria-pressed') === 'true' || button.getAttribute('aria-selected') === 'true') selections.push({attribute,index});
      });
    });
    const blocks=sections();
    let anchor=null;
    blocks.forEach((element,index)=>{
      const bounds=element.getBoundingClientRect();
      if(bounds.top<=0&&bounds.bottom>0)anchor={index,offset:-bounds.top};
    });
    const appViewport=main.querySelector('.ch-app-viewport'),appCards=main.querySelector('.ch-app-track')?.children;
    const appStep=appCards?.[1]?.offsetLeft-appCards?.[0]?.offsetLeft;
    return {id:activeId,route:visits.get(activeId)?.route||route(),x:scrollX,y:scrollY,anchor,selections,
      details:[...main.querySelectorAll('details')].map(element=>element.open),
      appPage:appViewport?0:Math.floor((parseInt(main.querySelector('[data-app-count]')?.textContent)||1)/3),
      appIndex:appViewport&&appStep?appViewport.scrollLeft/appStep:null,
      appPaused:main.querySelector('[data-app-pause]')?.getAttribute('aria-pressed')==='true',
      exception:(parseInt(main.querySelector('[data-exception-count]')?.textContent)||1)-1,
      focus:[...main.querySelectorAll(focusable)].indexOf(document.activeElement)};
  }
  function remember(writeCurrent=false) {
    if(restoring)return;
    const visit=capture();visits.set(activeId,visit);
    if(writeCurrent&&history.state?.[stateKey]?.id===activeId)write(visit);
  }
  function cancelRestore(){restoreVersion++;restoring=false;}
  function restore(visit,shouldFocus) {
    const version=++restoreVersion;
    restoring=true;
    const restoreSelections=()=> (visit.selections||[]).forEach(({attribute,index})=>{
      if(!selectionAttributes.includes(attribute))return;
      const button=main.querySelectorAll(`[${attribute}]`)[index];
      if(button && button.getAttribute('aria-pressed')!=='true' && button.getAttribute('aria-selected')!=='true')button.click();
    });
    restoreSelections();
    const appViewport=main.querySelector('.ch-app-viewport'),appCards=main.querySelector('.ch-app-track')?.children;
    if(appViewport&&Number.isFinite(visit.appIndex)){
      const step=appCards?.[1]?.offsetLeft-appCards?.[0]?.offsetLeft;
      if(step)appViewport.scrollLeft=visit.appIndex*step;
      const pause=main.querySelector('[data-app-pause]');
      if(visit.appPaused&&pause?.getAttribute('aria-pressed')!=='true'&&!pause?.disabled)pause?.click();
    }else if(!appViewport)for(let i=0;i<(visit.appPage||0);i++)main.querySelector('[data-app-next]')?.click();
    for(let i=0;i<(visit.exception||0);i++)main.querySelector('[data-exception-next]')?.click();
    main.querySelectorAll('details').forEach((element,index)=>{element.open=Boolean(visit.details?.[index]);});
    if(shouldFocus){
      const target=visit.focus>=0?main.querySelectorAll(focusable)[visit.focus]:null;
      if(target)target.focus({preventScroll:true});
      else{main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}
      // Some controls also select themselves on focus; keep the saved selection.
      restoreSelections();
    }
    const place=()=>{
      if(version!==restoreVersion)return;
      const block=visit.anchor&&sections()[visit.anchor.index];
      const y=block?scrollY+block.getBoundingClientRect().top+Math.min(visit.anchor.offset,Math.max(0,block.getBoundingClientRect().height-1)):visit.y;
      window.scrollTo({left:visit.x||0,top:y||0,behavior:'instant'});
    };
    place();
    requestAnimationFrame(()=>{if(version!==restoreVersion)return;place();restoring=false;remember(true);});
    // Correct font/image layout shifts only until the visitor next interacts.
    document.fonts?.ready.then(place);
    main.querySelectorAll('img').forEach(image=>{if(!image.complete)image.addEventListener('load',place,{once:true});});
  }
  function prepareLanding(visit) {
    if(Array.isArray(visit.selections))return false;
    const landing=main.querySelector('[data-route-landing]');
    if(!landing)return false;
    const block=landing.closest('section');
    visit.y=Math.max(0,scrollY+landing.getBoundingClientRect().top-24);
    if(block)visit.anchor={index:sections().indexOf(block),offset:Math.max(0,landing.getBoundingClientRect().top-block.getBoundingClientRect().top-24)};
    const target=landing.querySelector('[aria-pressed="true"]');
    visit.focus=[...main.querySelectorAll(focusable)].indexOf(target);
    return true;
  }
  function show(visit,isReturn) {
    activeId=visit.id;visits.set(activeId,visit);renderedUrl=location.href;
    render();const hasLanding=prepareLanding(visit);restore(visit,isReturn||hasLanding);
  }
  function onHistory() {
    window.AyudaSearch?.normalizeLocation();
    if(renderedUrl===location.href&&history.state?.[stateKey]?.id===activeId)return;
    remember();saveCache();cancelRestore();
    const saved=history.state?.[stateKey];
    const isReturn=Boolean(saved&&saved.route===route()&&saved.id!==activeId);
    const visit=isReturn?(visits.get(saved.id)||saved):newVisit();
    if(!isReturn)write(visit);
    show(visit,isReturn);
  }

  if('scrollRestoration' in history)history.scrollRestoration='manual';
  window.removeEventListener('hashchange',render);
  const saved=history.state?.[stateKey];
  const initial=saved?.route===route()?(visits.get(saved.id)||saved):newVisit();
  activeId=initial.id;visits.set(activeId,initial);write(initial);
  restore(initial,prepareLanding(initial));
  window.addEventListener('popstate',onHistory);
  window.addEventListener('hashchange',onHistory);
  window.addEventListener('scroll',()=>remember(),{passive:true});
  window.addEventListener('pagehide',()=>{remember(true);saveCache();});
  ['pointerdown','keydown','wheel','touchstart'].forEach(type=>window.addEventListener(type,cancelRestore,{passive:true}));
  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest('a[href]');
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    let url=new URL(link.href,location.href);
    if(location.pathname.startsWith('/signup/')||url.pathname.startsWith('/signup/'))return;
    if(window.AyudaSearch && url.origin===location.origin && url.hash.startsWith('#/')){const target=window.AyudaSearch.read(url);url=new URL(target.path+target.search,location.origin);}
    if(window.AyudaSearch){
      if(url.origin!==location.origin||url.hash||(!url.hash.startsWith('#/')&&/\.[^/]+$/.test(url.pathname)))return;
    }else if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash.startsWith('#/'))return;
    event.preventDefault();
    if(url.href===location.href){window.scrollTo({top:0,left:0,behavior:'instant'});return;}
    remember(true);saveCache();cancelRestore();
    const visit={...newVisit(),route:window.AyudaSearch ? window.AyudaSearch.read(url).path+url.search : url.hash};
    history.pushState({[stateKey]:visit},'',url.href);
    show(visit,false);
    if(!main.querySelector('[data-route-landing]')){main.setAttribute('tabindex','-1');main.focus({preventScroll:true});}
  });
})();
