/* Resource metadata for stable image layout across static and client navigation. */
(function(){
 const dimensions = {"/assets/mascot-laptop.webp":[1049,1500],"/assets/danielle.webp":[1536,1024],"/assets/logo.webp":[500,167],"/assets/rasheed-training.webp":[1122,1402],"/assets/aisha-portrait-natural.webp":[1024,1536],"/assets/brand-growth-ring-embossed-optimized.webp":[1254,1254],"/assets/mascot-phone.webp":[983,1600],"/assets/mascot-wave.webp":[1132,1390],"/assets/brand-growth-sweep-embossed-optimized.webp":[1254,1254],"/assets/star-secondary.webp":[1182,1330],"/assets/brand-growth-sweep-acrylic-optimized.webp":[1254,1254],"/assets/logo-white.webp":[2048,684],"/assets/marcus-20261110.webp":[1448,1086],"/assets/elena.webp":[1448,1086],"/assets/marcus-portrait-natural.webp":[1024,1536],"/assets/rasheed.webp":[1122,1402],"/assets/star-primary.webp":[1182,1330],"/assets/brand-growth-ring-aluminium-optimized.webp":[1254,1254],"/assets/ribbon-mark.webp":[800,800],"/assets/aisha-20261110.webp":[1536,1024],"/assets/brand-mark.webp":[1254,1254],"/assets/brand-growth-sweep-aluminium-optimized.webp":[1254,1254],"/assets/growth-mark.webp":[800,800],"/assets/brand-growth-ring-acrylic-optimized.webp":[1254,1254],"/assets/owner.webp":[259,318],"/assets/integrations/whatsapp-business-official.png":[240,240]};
 function apply(root=document){
  root.querySelectorAll('img[src]').forEach(img=>{
   const url=new URL(img.getAttribute('src'),document.baseURI);
   const size=dimensions[url.pathname];
   if(size){if(!img.hasAttribute('width'))img.setAttribute('width',size[0]);if(!img.hasAttribute('height'))img.setAttribute('height',size[1]);}
   if(!img.hasAttribute('decoding'))img.setAttribute('decoding','async');
   if(!img.hasAttribute('loading'))img.setAttribute('loading',img.closest('header,.hero,.page-hero,.rp-hero')?'eager':'lazy');
  });
 }
 window.AyudaResources={apply};
})();
