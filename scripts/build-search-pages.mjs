import {readFileSync,writeFileSync,mkdirSync,existsSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderPage} from './render-page.mjs';
const root=fileURLToPath(new URL('..',import.meta.url)),dist=join(root,'dist');
const shell=readFileSync(join(root,'source/shell.html'),'utf8');
const origin='https://ayudagrow.com';
const first=renderPage(shell,origin,'/');
const {descriptions,aliases}=first.window.AyudaSearch;
const routes=Object.keys(descriptions);
first.window.close();
const oldManifest=join(dist,'route-manifest.json');
if(existsSync(oldManifest))for(const item of JSON.parse(readFileSync(oldManifest,'utf8')).pages){if(item.path!=='/')rmSync(join(dist,item.path.slice(1)),{recursive:true,force:true});}
function save(path,dom){
  const document=dom.window.document;
  const main=document.querySelector('main');
  if(main.querySelectorAll('h1').length!==1||main.textContent.trim().length<40)throw new Error('Invalid rendered page: '+path);
  document.documentElement.dataset.renderedRoute=path;
  document.documentElement.dataset.privatePreview='true';
  const destination=path==='/'?join(dist,'index.html'):path==='/404.html'?join(dist,'404.html'):join(dist,path.slice(1),'index.html');
  mkdirSync(join(destination,'..'),{recursive:true});
  writeFileSync(destination,dom.serialize());
  dom.window.close();
}
const manifest={mode:'private-preview',origin,indexing:'noindex,nofollow',publicLaunchApproved:false,pages:[]};
for(const key of routes){
  const path=key==='home'?'/':'/'+key;
  const dom=renderPage(shell,origin,path);
  if(dom.window.AyudaSearch.key()!==key)throw new Error('Route mismatch: '+key);
  const document=dom.window.document;
  manifest.pages.push({path,title:document.title,description:document.querySelector('meta[name="description"]').content,canonical:document.querySelector('link[rel="canonical"]').href,indexable:false,launchReviewRequired:['ai-concepts','privacy','pricing','contact','get-started'].includes(key)});
  save(path,dom);
}
for(const [from,to] of Object.entries(aliases)){
  const dom=renderPage(shell,origin,'/'+from);
  dom.window.document.documentElement.dataset.legacyAlias=from;
  save('/'+from,dom);
}
save('/404.html',renderPage(shell,origin,'/this-page-does-not-exist'));
writeFileSync(oldManifest,JSON.stringify(manifest,null,2)+'\n');
writeFileSync(join(dist,'robots.txt'),'# Private design preview. Do not index or submit this host to search engines.\nUser-agent: *\nDisallow: /\n');
writeFileSync(join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<!-- Private preview: no URLs are approved for public indexing. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
writeFileSync(join(dist,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n');
writeFileSync(join(dist,'_redirects'),Object.entries(aliases).map(([from,to])=>`/${from} /${to} 301\n/${from}/ /${to} 301`).join('\n')+'\n');
console.log(`Built ${routes.length} complete HTML pages, ${Object.keys(aliases).length} legacy fallbacks, a 404 document, private metadata, robots, sitemap and redirect/header candidates.`);
