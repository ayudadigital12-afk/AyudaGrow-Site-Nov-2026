/* Shared visual rhythm for every subpage; homepage and content decisions stay intact. */
const subpagePriorWiring=wireExpanded;
wireExpanded=function(){subpagePriorWiring();const main=document.querySelector('main');const isSubpage=!main.querySelector('.hero');main.classList.toggle('subpage-theme',isSubpage);if(!isSubpage)return;
 const route=window.AyudaSearch?.key()||location.hash.replace(/^#\//,'').split('?')[0]||'home';main.dataset.themeRoute=route;
 main.querySelectorAll('h2').forEach(h=>{if(h.closest('.cta')||h.querySelector('.heading-lead'))return;const parts=h.innerHTML.split(/<br\s*\/?\s*>/i);if(parts.length===2&&!/[.!?]$/.test(parts[0].replace(/<[^>]*>/g,'').trim()))h.innerHTML=parts.join(' ');});
 main.querySelectorAll('h1').forEach(h=>{if(h.querySelector('.subpage-heading-lead'))return;const parts=h.innerHTML.split(/<br\s*\/?\s*>/i);h.classList.toggle('subpage-title-multi',parts.length>2);if(parts.length===2){const firstText=parts[0].replace(/<[^>]*>/g,'').trim();if(/[.!?]$/.test(firstText))h.innerHTML=`<span class="subpage-heading-lead">${parts[0]}</span><br>${parts[1]}`;else h.innerHTML=parts.join(' ');}if(h.innerHTML.includes('follow-through.'))h.innerHTML=h.innerHTML.replace('follow-through.','<span class="subpage-keep-word">follow-through.</span>');});
};
render();
