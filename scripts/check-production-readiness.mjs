import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from './render-page.mjs';
// Independent release gate. Staging checks remain strict about noindex.
// Approval flags record verified decisions; they do not supply missing terms or authorize deployment.
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const config=JSON.parse(read('source/release-readiness.json'));
const manifest=JSON.parse(read('dist/route-manifest.json'));
const issues=[];
if(config.mode!=='production')issues.push('Build is still configured for staging.');
if(config.publicLaunchApproved!==true)issues.push('Public release has not been approved.');
for(const key of ['privacy','commercialTerms','hostingAndRollback','legacyBookingAndLogin','canonicalHost','productionIndexing','mobilePerformance','measurementPlan']){
 if(config.approvals?.[key]!==true)issues.push(`Required decision is pending: ${key}.`);
}
if(manifest.publicLaunchApproved!==true||manifest.mode!=='production')issues.push('Generated manifest is not production-approved.');
if(manifest.origin!==config.canonicalOrigin)issues.push('Configured and generated canonical origins differ.');
if(manifest.pages.some(p=>p.indexable!==true))issues.push('Canonical pages are still marked non-indexable.');
const robots=read('dist/robots.txt');
if(/^Disallow:\s*\/\s*$/m.test(robots))issues.push('robots.txt still blocks all crawling.');
if(/noindex|nofollow/i.test(read('dist/_headers')))issues.push('Candidate response headers still block indexing.');
if(/noindex|nofollow/i.test(read('dist/.htaccess')))issues.push('Apache staging configuration still blocks indexing.');
const sitemap=new JSDOM(read('dist/sitemap.xml'),{contentType:'application/xml'});
const urls=new Set([...sitemap.window.document.querySelectorAll('loc')].map(n=>n.textContent));sitemap.window.close();
if(urls.size!==manifest.pages.length||manifest.pages.some(p=>!urls.has(p.canonical)))issues.push('Sitemap does not contain exactly the approved canonical pages.');
const stagingCopy=/complete privacy notice is being prepared|not a complete privacy notice|inclusion to confirm|allowance to confirm|terms remain to be confirmed|hard cap is not yet verified/i;
const shell=read('source/shell.html');
for(const page of manifest.pages){
 const html=read(page.path==='/'?'dist/index.html':`dist${page.path}/index.html`);
 for(const [label,dom] of [['static',new JSDOM(html)],['runtime',renderPage(shell,config.canonicalOrigin,page.path)]]){
  const d=dom.window.document;
  if(/noindex|nofollow/i.test(d.querySelector('meta[name="robots"]')?.content||''))issues.push(`${page.path} ${label} metadata still blocks indexing.`);
  if(stagingCopy.test(d.querySelector('main')?.textContent||''))issues.push(`${page.path} ${label} retains unresolved privacy or commercial content.`);
  assert.equal(d.querySelector('link[rel="canonical"]')?.href,page.canonical,`${page.path} canonical consistency`);
  dom.window.close();
 }
}
if(issues.length){
 console.error('PRODUCTION RELEASE BLOCKED\n'+[...new Set(issues)].map(x=>' - '+x).join('\n'));
 process.exitCode=1;
}else console.log('Production artifact checks passed. Verify the exact deployed host, approval evidence and rollback before release.');
