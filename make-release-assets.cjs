const fs=require('fs'),path=require('path'),sharp=require('sharp');
(async()=>{
 const base='source/public/assets';
 const logo=await sharp(base+'/logo.webp').resize(720,241,{fit:'contain'}).png().toBuffer();
 const canvas=Buffer.from('<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f5f8fc"/><rect x="90" y="80" width="1020" height="470" rx="32" fill="white"/><rect x="240" y="451" width="440" height="9" rx="4" fill="#1769e8"/><rect x="694" y="451" width="266" height="9" rx="4" fill="#39a935"/></svg>');
 await sharp(canvas).composite([{input:logo,left:240,top:168}]).png().toFile(base+'/share-default.png');
 for(const size of [32,180]) await sharp(base+'/logo.webp').resize(size,size,{fit:'contain',background:'#ffffff'}).png().toFile(base+'/'+(size===32?'favicon-32.png':'apple-touch-icon.png'));
 const png=fs.readFileSync(base+'/favicon-32.png'),header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=32;header[7]=32;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(png.length,14);header.writeUInt32LE(22,18);fs.writeFileSync('source/public/favicon.ico',Buffer.concat([header,png]));
 const variants={};
 for(const name of fs.readdirSync(base).filter(n=>n.endsWith('.webp')&&!/-w\d+\.webp$/.test(n)&&fs.statSync(base+'/'+n).size>90000)){
  const meta=await sharp(base+'/'+name).metadata();variants['/assets/'+name]=[];
  for(const width of [384,768].filter(w=>w<meta.width)){
   const file=name.replace('.webp','-w'+width+'.webp');await sharp(base+'/'+name).resize({width}).webp({quality:85,effort:5}).toFile(base+'/'+file);variants['/assets/'+name].push({src:'/assets/'+file,width});
  }
  variants['/assets/'+name].push({src:'/assets/'+name,width:meta.width});
 }
 let s=fs.readFileSync('source/public/resource-hints.js','utf8').replace(/ const responsive=.*;\r?\n/g,'').replace(/   if\(responsive\[url.pathname\]\).*\r?\n/g,'');s=s.replace(' function apply(root=document){',' const responsive='+JSON.stringify(variants)+';\n function apply(root=document){');s=s.replace('   const size=dimensions[url.pathname];','   const size=dimensions[url.pathname];\n   if(responsive[url.pathname]){img.srcset=responsive[url.pathname].map(v=>v.src+" "+v.width+"w").join(", ");img.sizes="(max-width: 600px) 90vw, (max-width: 1000px) 50vw, 640px";}');fs.writeFileSync('source/public/resource-hints.js',s);
 console.log(JSON.stringify({responsiveImages:Object.keys(variants).length,share:await sharp(base+'/share-default.png').metadata()}));
})();
