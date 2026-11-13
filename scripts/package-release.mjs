import {rmSync,cpSync,mkdirSync,readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('dist'),env=JSON.parse(readFileSync('build/route-manifest.json')).environment;
const forbidden=/(^|\/)(source|scripts|checks|docs|deploy|node_modules|\.git)(\/|$)|(^|\/)(package(?:-lock)?\.json|README\.md|HOSTING\.md|route-manifest\.json|release-readiness\.json)$/;
const entries=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name),name=file.slice(root.length+1).replaceAll('\\','/');if(forbidden.test(name))throw Error('Private file in public output: '+name);if(entry.isDirectory())walk(file);else entries.push({path:name,bytes:statSync(file).size,sha256:createHash('sha256').update(readFileSync(file)).digest('hex')});}}
walk(root);mkdirSync('build',{recursive:true});writeFileSync('build/public-output-checksums.json',JSON.stringify({environment:env,files:entries},null,2)+'\n');
if(!['staging','production'].includes(env))throw Error('Invalid environment');
const target=resolve('release',env);if(target!==resolve('release/'+env))throw Error('Unsafe target');
rmSync(target,{recursive:true,force:true});
cpSync('dist',`release/${env}`,{recursive:true});
console.log(`Verified ${entries.length} public files; copied generated output only to release/${env}.`);
