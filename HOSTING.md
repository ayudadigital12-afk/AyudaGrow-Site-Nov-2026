# Hosting and launch checklist

## Current state

- Static site, no application backend.
- Intended domain references use `https://ayudagrow.com`; account-specific preview origins have been removed. These references do not connect the domain.
- All generated pages retain `noindex,nofollow`, `robots.txt` disallows crawling, the sitemap is intentionally empty, and `_headers` requests `X-Robots-Tag: noindex, nofollow`.
- No forms, chatbot, checkout or analytics tag are installed. Email and phone links open the visitor's own applications.
- The privacy notice and unresolved commercial terms are still review drafts. Current review banners and the `/ai-concepts` page are retained.

## Before public hosting

1. Finish the privacy notice from the actual practices: provider details, designated request handling, any onward use/sharing, retention/deletion, applicable rights, cookies/logging and an effective date. Do not assume the admin mailbox is connected to a CRM or used for marketing.
2. Finalize public commercial wording and remove internal review copy when approved. Keep truthful illustrative-persona and configured-capability limitations. Decide whether `/ai-concepts` belongs on the public website.
3. Verify hosting ownership, account/plan, deployment repository/branch, document root and rollback. Back up the existing site and any host-specific configuration before replacing it. Keep email/MX/TXT and ownership-verification records unchanged unless a specific change is intended.
4. Serve `dist/` only. If the host deploys repository files without a build step or publish-directory setting, prepare a separate release artifact/branch containing the contents of `dist/` at its root. Do not upload this full source ZIP as the public web root.
5. Verify clean URLs, direct reloads, HTTPS, one canonical apex/www host, permanent redirects and an HTTP 404 for missing routes. `_redirects` and `_headers` are host-specific conventions; their presence does not prove the selected host applies them. Configure equivalent rules for hosts that do not support them.
6. Review the legacy redirects in `dist/_redirects`. `/book` and `/login` are not functioning booking/account services in this build. Do not invent destinations for them.
7. Only for an approved release, implement the public indexing configuration consistently in `scripts/build-search-pages.mjs`, `dist/search-routing.js`, `source/shell.html`, generated HTML and real HTTP headers. Publish a sitemap of approved canonical pages and update the draft-specific tests accordingly. Never remove safeguards only to make a test pass.
8. Smoke-test the exact released artifact: navigation, mobile rendering, assets, email/phone links, privacy, status codes, canonical/social URLs and indexing. A previous artifact or revert commit is the rollback path; do not rewrite published history.

## Optional later integrations

- Add the specific approved GHL form/chatbot configuration later and verify receipt and handoff. Update privacy and consent before activating collection.
- Add GA4 only with the correct property/stream ID and collection/consent configuration. Verify page-view handling and avoid duplicate events. Tracking is not retroactive.
- Search Console can verify a domain with DNS or a URL-prefix property using an approved HTML tag/file. Preserve any existing verification, submit the canonical sitemap, and inspect representative URLs. It is not a visitor analytics script.
- Keep all tokens and provider credentials in the host's approved secret storage, not source control.

No live hosting, DNS, indexing or service integration changes are performed by these repository files.
