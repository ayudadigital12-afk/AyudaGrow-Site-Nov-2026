import {readFileSync,writeFileSync,mkdirSync,existsSync,rmSync,cpSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPage} from './render-page.mjs';
import {apacheStagingRules} from './apache-rules.mjs';
const root=fileURLToPath(new URL('..',import.meta.url)),dist=join(root,'dist');
const shell=readFileSync(join(root,'source/shell.html'),'utf8');
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
const manifestPath=join(dist,'route-manifest.json');
function save(path,dom){
  const document=dom.window.document;
  const main=document.querySelector('main');
  if(main.querySelectorAll('h1').length!==1||main.textContent.trim().length<40)throw new Error('Invalid rendered page: '+path);
  document.querySelectorAll('script[src],link[rel=stylesheet]').forEach(el=>{const attr=el.tagName==='SCRIPT'?'src':'href';el.setAttribute(attr,el.getAttribute(attr)+(el.getAttribute(attr)==='expanded.js'?'?v=20261110-review':'?v=20261110-review'));});
  document.documentElement.dataset.renderedRoute=path;
  document.documentElement.dataset.privatePreview='true';
  const destination=path==='/'?join(dist,'index.html'):path==='/404.html'?join(dist,'404.html'):join(dist,path.slice(1),'index.html');
  mkdirSync(join(destination,'..'),{recursive:true});
  writeFileSync(destination,dom.serialize().replace('</body>',"<script defer src=\"https://widgets.leadconnectorhq.com/loader.js\" data-resources-url=\"https://widgets.leadconnectorhq.com/chat-widget/loader.js\" data-widget-id=\"6adbe6959f0ad5b6ad0a7a22\"></script>"+'</body>'));
  dom.window.close();
}
const manifest={mode:'private-preview',origin,indexing:'noindex,nofollow',publicLaunchApproved:false,pages:[]};
for(const key of routes){
  const path=key==='home'?'/':'/'+key;
  const dom=renderPage(shell,origin,path);
  if(dom.window.AyudaSearch.key()!==key)throw new Error('Route mismatch: '+key);
  const document=dom.window.document;
  manifest.pages.push({path,title:document.title,description:document.querySelector('meta[name="description"]').content,canonical:document.querySelector('link[rel="canonical"]').href,indexable:false,launchReviewRequired:['privacy','pricing'].includes(key)});
  save(path,dom);
}
for(const [from,to] of Object.entries(aliases)){
  const dom=renderPage(shell,origin,'/'+from);
  dom.window.document.documentElement.dataset.legacyAlias=from;
  save('/'+from,dom);
}
save('/404.html',renderPage(shell,origin,'/this-page-does-not-exist'));
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
writeFileSync(join(dist,'robots.txt'),'# Staging build. Do not index or submit this host to search engines.\nUser-agent: *\nDisallow: /\n');
writeFileSync(join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<!-- Private preview: no URLs are approved for public indexing. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
writeFileSync(join(dist,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n');
writeFileSync(join(dist,'_redirects'),Object.entries(aliases).map(([from,to])=>`/${from} /${to} 301\n/${from}/ /${to} 301`).join('\n')+'\n');
writeFileSync(join(dist,'.htaccess'),apacheStagingRules(manifest.pages.map(p=>p.path),aliases));
console.log(`Built ${routes.length} complete HTML pages, ${Object.keys(aliases).length} legacy fallbacks, a 404 document, private metadata, robots, sitemap and redirect/header candidates.`);
