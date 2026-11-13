export const canonicalOrigin = 'https://ayudagrow.com';
export function releaseConfig(env = process.env.SITE_ENV || 'staging') {
  if (!['staging', 'production'].includes(env)) throw new Error('SITE_ENV must be staging or production');
  return {env, origin:canonicalOrigin, production:env==='production'};
}
export function indexable(path, config) {
  return config.production && !/^\/(?:signup(?:\/|$)|privacy$|cookies$|terms$|404\.html$)/.test(path);
}
export function robots(config) {
  if (!config.production) return '# Staging only. Not an access-control mechanism.\nUser-agent: *\nDisallow: /\n';
  return '# Public search crawling is permitted; no training opt-in is granted.\nUser-agent: GPTBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: '+canonicalOrigin+'/sitemap.xml\n';
}

