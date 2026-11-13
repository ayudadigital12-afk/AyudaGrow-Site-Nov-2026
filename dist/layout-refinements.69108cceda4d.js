/* Requested typography and spacing refinements. Keep heading semantics and wording. */
const layoutPriorWiring=wireExpanded;
wireExpanded=function(){
 layoutPriorWiring();
 document.querySelectorAll('main h2').forEach(heading=>{
  if(heading.closest('.cta')||heading.querySelector('.heading-lead'))return;
  const pieces=heading.innerHTML.split(/<br\s*\/?\s*>/i);
  if(pieces.length===2&&/[.!?]$/.test(pieces[0].trim()))heading.innerHTML=`<span class="heading-lead">${pieces[0]}</span><br>${pieces[1]}`;
 });
 if(document.querySelector('.hero')){
  document.querySelector('.how-intro')?.closest('section').classList.add('home-workspace-section');
  const marcusHeading=document.querySelector('.paths .path-card:first-child h3');
  if(marcusHeading)marcusHeading.innerHTML='<span>From first</span> <span>enquiry to a</span> <span>confident yes.</span>';
  const aishaPortrait=document.querySelector('.paths .path-card:nth-child(2) .path-image svg');
  if(aishaPortrait)aishaPortrait.setAttribute('viewBox','392 20 326 462');
 }
};
render();
