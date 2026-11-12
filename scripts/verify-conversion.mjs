import {spawnSync} from 'node:child_process';
const checks=['homepage-review','connections-carousel-review','navigation-review','pricing-review','signup-review','contact-privacy-review','search-readiness-review','technical-readiness-review','white-label-readiness'];
let failed=0;
for(const check of checks){console.log('Checking '+check);const r=spawnSync(process.execPath,['--import','./scripts/offline-guard.mjs','checks/'+check+'.mjs'],{stdio:'inherit'});if(r.status!==0)failed++;}
console.log('Verification finished: '+(checks.length-failed)+' passed; '+failed+' failed.');process.exitCode=failed?1:0;
