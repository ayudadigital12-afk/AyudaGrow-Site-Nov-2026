import {readFileSync} from 'node:fs';
import './check-release-artifact.mjs';
const config=JSON.parse(readFileSync('source/release-readiness.json','utf8'));
const manifest=JSON.parse(readFileSync('build/route-manifest.json','utf8'));
const issues=[];
if(manifest.environment!=='production')issues.push('Build the production artifact before assessing publication.');
if(config.publicLaunchApproved!==true)issues.push('Explicit publication approval has not been recorded.');
for(const key of ['privacy','commercialTerms','hostingAndRollback','legacyBookingAndLogin','canonicalHost','productionIndexing','mobilePerformance','measurementPlan']){
 if(config.approvals?.[key]!==true)issues.push('Required decision or verification pending: '+key);
}
for(const page of manifest.pages){
 const html=readFileSync(page.path==='/'?'dist/index.html':'dist'+page.path+'/index.html','utf8');
 if(/complete privacy notice is being prepared|not a complete privacy notice|inclusion to confirm|allowance to confirm|terms remain to be confirmed|hard cap is not yet verified/i.test(html))issues.push(page.path+' contains unresolved release content.');
}
if(issues.length){console.error('PRODUCTION RELEASE BLOCKED\n'+[...new Set(issues)].map(x=>' - '+x).join('\n'));process.exitCode=1;}
else console.log('Artifact and recorded release prerequisites passed. Verify the deployed host and rollback before publication.');
