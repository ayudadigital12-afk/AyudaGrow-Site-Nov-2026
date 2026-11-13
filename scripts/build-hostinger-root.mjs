import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {apacheStagingRules} from './apache-rules.mjs';
const manifest=JSON.parse(readFileSync(new URL('../build/route-manifest.json',import.meta.url)));
const aliases=Object.fromEntries(readFileSync(new URL('../dist/_redirects',import.meta.url),'utf8').trim().split('\n').map(l=>l.trim().split(/\s+/)).filter(([a,b])=>!a.endsWith('/')&&!a.endsWith('.html')&&b.startsWith('/')).map(([a,b])=>[a.slice(1),b.slice(1)]));
let rules=apacheStagingRules(manifest.pages.map(p=>p.path),aliases);
rules=rules.replace('RewriteEngine On','<IfModule mod_passenger.c>\n  PassengerEnabled off\n</IfModule>\nRewriteEngine On\n# Hide build-directory URLs from visitors.\nRewriteCond %{THE_REQUEST} [[:space:]]/+dist(?:/|[[:space:]?]) [NC]\nRewriteRule ^dist(?:/(.*))?$ /$1 [R=301,L]');
rules=rules.replace(/(RewriteRule \S+ )([^ \n]+)( \[END\])/g,'$1dist/$2$3');
rules=rules.replace('RewriteCond %{REQUEST_FILENAME} !-f\nRewriteRule ^ - [R=404,L]', 'RewriteRule ^(?:\\.|source(?:/|$)|scripts(?:/|$)|checks(?:/|$)|node_modules(?:/|$)|dist(?:/|$)|deploy(?:/|$)) - [R=404,L]\nRewriteCond %{DOCUMENT_ROOT}/dist/$1 -f\nRewriteRule ^(.+)$ dist/$1 [END]\nRewriteRule ^ - [R=404,L]');
rules=rules.replace('ErrorDocument 404 /404.html','ErrorDocument 404 /dist/404.html').replace('RewriteEngine On','RewriteEngine On\nRewriteRule ^dist/404\\.html$ - [END]');
// These exact directory aliases cannot match an internal rewrite to */index.html.
// Do not depend on THE_REQUEST surviving a managed host's proxy handling.
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const directoryAliases=manifest.pages.filter(p=>p.path!=='/').map(p=>`RewriteRule ^dist${escape(p.path)}/?$ https://%{HTTP_HOST}${p.path} [R=301,L]`);
rules=rules.replace('# Hide build-directory URLs from visitors.', '# Redirect direct build-directory route aliases.\n'+directoryAliases.join('\n')+'\n# Hide build-directory URLs from visitors.');
mkdirSync(new URL('../deploy/',import.meta.url),{recursive:true});
writeFileSync(new URL('../deploy/hostinger-staging-root.htaccess',import.meta.url),rules);
writeFileSync(new URL('../.htaccess',import.meta.url),rules);
console.log('Generated Hostinger staging root configuration.');

