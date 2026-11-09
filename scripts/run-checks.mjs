import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const name of readdirSync(new URL('../checks/',import.meta.url)).filter(n=>n.endsWith('.mjs')).sort()){
 console.log('\nChecking '+name);const run=spawnSync(process.execPath,['checks/'+name],{cwd:root,stdio:'inherit'});if(run.status!==0)process.exit(run.status||1);
}
console.log('\nAll repository checks passed.');
