// Apache 2.4 staging configuration. Actual host modules and TLS termination need verification.
export function apacheStagingRules(routes,aliases,config={production:false}){
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const lines=[
 config.production?'# PRODUCTION CANDIDATE: publish only after explicit approval.':'# STAGING ONLY: retain noindex.',
 'Options -Indexes -MultiViews',
 'DirectoryIndex index.html',
 'DirectorySlash Off',
 'ErrorDocument 404 /404.html',
 '<IfModule mod_headers.c>',
 ...(config.production?['  Header always unset X-Robots-Tag','  Header always set X-Robots-Tag "noindex, follow" "expr=%{REQUEST_URI} =~ m#^/(signup(?:/|$)|privacy(?:/|$)|cookies(?:/|$)|terms(?:/|$)|404\\.html)#"','  Header always set X-Robots-Tag "noindex, nofollow" "expr=%{HTTP_HOST} =~ m#^staging#"']:['  Header always set X-Robots-Tag "noindex, nofollow"']),
 '  Header always set X-Content-Type-Options "nosniff"',
 '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
 '  Header always set Content-Security-Policy "upgrade-insecure-requests; base-uri \'self\'; object-src \'none\'; frame-ancestors \'self\'"',
 '  Header always set Permissions-Policy "camera=(), geolocation=(), browsing-topics=(), microphone=(self)"',
 '  <FilesMatch "\\.(?:html|xml|txt|json)$">',
 '    Header set Cache-Control "no-cache, max-age=0, must-revalidate"',
 '  </FilesMatch>',
 '  <FilesMatch "\\.(?:css|js|webp|png|jpg|svg|woff2)$">',
 '    Header set Cache-Control "public, max-age=3600, must-revalidate"',
 '  </FilesMatch>',
 '  # A year of caching is safe only for genuinely content-fingerprinted filenames.',
 '  <FilesMatch "\\.[a-f0-9]{12}\\.(?:css|js|webp|png|jpg|svg|woff2)$">',
 '    Header set Cache-Control "public, max-age=31536000, immutable"',
 '  </FilesMatch>',
 '</IfModule>',
 '<IfModule mod_deflate.c>',
 '  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json application/xml text/xml image/svg+xml',
 '</IfModule>',
 'RewriteEngine On',
 '# User-confirmed staff and customer login. Fixed destination; query retained.',
 'RewriteRule ^login(?:/|/index\\.html)?$ https://app.ayudagrow.com/ [R=301,L]',
 '# Normalise direct build-directory requests at the served-directory level too.',
 'RewriteCond %{THE_REQUEST} \\s/+dist/([^\\s?]*) [NC]',
 'RewriteRule ^ https://%{HTTP_HOST}/%1 [R=301,L]',
 ...(config.production?['RewriteCond %{HTTP_HOST} ^www\\.ayudagrow\\.com$ [NC]','RewriteRule ^ https://ayudagrow.com%{REQUEST_URI} [R=301,L]']:[]),
 '# Resolve legacy and slash/index variants directly to an HTTPS final path; preserve the query.',
 ];
 for(const [from,to] of Object.entries(aliases))lines.push(`RewriteRule ^${escape(from)}(?:/|/index\\.html)?$ https://%{HTTP_HOST}/${to} [R=301,L]`);
 lines.push('RewriteRule ^index\\.html$ https://%{HTTP_HOST}/ [R=301,L]');
 for(const route of routes.filter(p=>p!=='/'))lines.push(`RewriteRule ^${escape(route.slice(1))}(?:/|/index\\.html)$ https://%{HTTP_HOST}${route} [R=301,L]`);
 lines.push('RewriteCond %{HTTPS} !=on','RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]');
 lines.push('# Do not expose host configuration or the fallback-host rule files.','RewriteRule ^(?:\\.htaccess|_(?:headers|redirects)|route-manifest\\.json|source(?:/|$)|scripts(?:/|$)|docs(?:/|$)|deploy(?:/|$)|build(?:/|$)|checks(?:/|$)|node_modules(?:/|$)|\\.git(?:/|$)|package(?:-lock)?\\.json|README\\.md|HOSTING\\.md) - [R=404,L]');
 for(const route of routes.filter(p=>p!=='/'))lines.push(`RewriteRule ^${escape(route.slice(1))}$ ${route.slice(1)}/index.html [END]`);
 lines.push('RewriteRule ^$ index.html [END]','RewriteCond %{REQUEST_FILENAME} !-f','RewriteRule ^ - [R=404,L]','');
 return lines.join('\n');
}

