import {readFileSync,writeFileSync,mkdirSync,existsSync,rmSync,cpSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPage} from './render-page.mjs';
import {apacheStagingRules} from './apache-rules.mjs';
import {releaseConfig,indexable,robots} from './release-config.mjs';
import {createHash} from 'node:crypto';
const config=releaseConfig();
const root=fileURLToPath(new URL('..',import.meta.url)),dist=join(root,'dist');
const shell=readFileSync(join(root,'source/shell.html'),'utf8').replace('data-environment="staging"','data-environment="'+config.env+'"');
const publicSource=join(root,'source/public');
if(!existsSync(publicSource))throw new Error('Missing runtime source directory: source/public');
// dist is a disposable artifact. Restore runtime files before rendering pages.
rmSync(dist,{recursive:true,force:true});
cpSync(publicSource,dist,{recursive:true});
const origin='https://ayudagrow.com';
const first=renderPage(shell,origin,'/');
const {descriptions,aliases}=first.window.AyudaSearch;
const routes=Object.keys(descriptions);
first.window.close();
mkdirSync(join(root,'build'),{recursive:true});
const manifestPath=join(root,'build/route-manifest.json');
const fingerprint=file=>{const bytes=readFileSync(join(dist,file));const ext=file.slice(file.lastIndexOf('.'));const name=file.slice(0,-ext.length)+'.'+createHash('sha256').update(bytes).digest('hex').slice(0,12)+ext;writeFileSync(join(dist,name),bytes);return name;};
const hashed=new Map();
for(const match of shell.matchAll(/(?:src|href)="\/?([^"?]+\.(?:js|css))"/g)){if(!hashed.has(match[1]))hashed.set(match[1],fingerprint(match[1]));}
function save(path,dom){
  const document=dom.window.document;
  const main=document.querySelector('main');
  if(main.querySelectorAll('h1').length!==1||main.textContent.trim().length<40)throw new Error('Invalid rendered page: '+path);
  document.querySelectorAll('script[src],link[rel=stylesheet]').forEach(el=>{const attr=el.tagName==='SCRIPT'?'src':'href',name=el.getAttribute(attr).replace(/^\//,'');if(hashed.has(name))el.setAttribute(attr,'/'+hashed.get(name));});
  document.documentElement.dataset.renderedRoute=path;
  document.documentElement.dataset.privatePreview=String(!config.production);
  document.querySelectorAll('script[src="https://grow.ayudagrow.com/js/form_embed.js"]').forEach(s=>s.remove());
  if(path.startsWith('/signup/')){const embed=document.createElement('script');embed.defer=true;embed.src='https://grow.ayudagrow.com/js/form_embed.js';document.body.append(embed);}
  const destination=path==='/'?join(dist,'index.html'):path==='/404.html'?join(dist,'404.html'):join(dist,path.slice(1),'index.html');
  mkdirSync(join(destination,'..'),{recursive:true});
  writeFileSync(destination,dom.serialize().replace('</body>',"<script defer src=\"https://widgets.leadconnectorhq.com/loader.js\" data-resources-url=\"https://widgets.leadconnectorhq.com/chat-widget/loader.js\" data-widget-id=\"6adbe6959f0ad5b6ad0a7a22\"></script>"+'</body>'));
  dom.window.close();
}
const manifest={mode:config.production?'production':'private-preview',environment:config.env,origin,indexing:config.production?'route-specific':'noindex,nofollow',publicLaunchApproved:false,pages:[]};
for(const key of routes){
  const path=key==='home'?'/':'/'+key;
  const dom=renderPage(shell,origin,path);
  if(dom.window.AyudaSearch.key()!==key)throw new Error('Route mismatch: '+key);
  const document=dom.window.document;
  manifest.pages.push({path,title:document.title,description:document.querySelector('meta[name="description"]').content,canonical:document.querySelector('link[rel="canonical"]').href,indexable:indexable(path,config),launchReviewRequired:['privacy','pricing'].includes(key)||key.startsWith('signup/')});
  save(path,dom);
}
for(const [from,to] of Object.entries(aliases)){
  const dom=renderPage(shell,origin,'/'+from);
  dom.window.document.documentElement.dataset.legacyAlias=from;
  save('/'+from,dom);
}
save('/404.html',renderPage(shell,origin,'/this-page-does-not-exist'));
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
writeFileSync(join(dist,'robots.txt'),robots(config));
writeFileSync(join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+manifest.pages.filter(p=>p.indexable).map(p=>'\n  <url><loc>'+p.canonical+'</loc></url>').join('')+'\n</urlset>\n');
writeFileSync(join(dist,'_headers'),config.production?'# Apache rules are authoritative. Apply equivalent route-specific policy on other hosts.\n':'/*\n  X-Robots-Tag: noindex, nofollow\n');
writeFileSync(join(dist,'_redirects'),Object.entries(aliases).map(([from,to])=>`/${from} /${to} 301\n/${from}/ /${to} 301`).join('\n')+'\n');
writeFileSync(join(dist,'.htaccess'),apacheStagingRules(manifest.pages.map(p=>p.path),aliases,config));
console.log(`Built ${routes.length} complete HTML pages, ${Object.keys(aliases).length} legacy fallbacks, a 404 document, private metadata, robots, sitemap and redirect/header candidates.`);
