# Production-readiness checkpoint
Status: **Not ready for publication**. Work is incomplete. Neither staging nor production has been replaced. DNS, email, CRM configuration and payment links remain unchanged.

## Recovery and source
Authoritative repository: ayudadigital12-afk/AyudaGrow-Site-Nov-2026. Baseline main: 449c38cc1448d7480fb1b59f26645d04c388900a.
Recoverable branch: rollback/pre-readiness-20261112.
Candidate branch: codex/production-readiness-20261112.
A copy of the deployed staging dist directory was downloaded before edits. 65 deployed asset files matched the pinned repository Git hashes. Existing local working copies were left untouched.
Repository is public. Whether that is intentional remains unconfirmed. Do not change visibility until deployment authentication is checked.

## Verification evidence
First candidate commit: 37ea0bc94731ae77e4ac38e522da3559f72fe727.
Run: https://github.com/ayudadigital12-afk/AyudaGrow-Site-Nov-2026/actions/runs/43356004653
The staging build, static/rendered metadata checks and generated-output packaging passed.
The browser regression reached all four CRM forms at desktop and mobile dimensions. It failed at its USD checkout assertion because the runner received EUR currency conversion from Stripe. This is not evidence that the underlying USD offer is wrong.
Manual Stripe access was subsequently denied. Further automated checkout visits have been removed from this candidate test. No payment was made and no form was submitted.
Production build verification was skipped after the browser test failure. A successful build is not a completed deployment or full accessibility/security assessment.
Browser access was interrupted repeatedly. Local execution later failed before starting because its workspace permission configuration mixed Windows and Linux paths.

## Requirement status
| # | Requirement | Status | Evidence or remaining work |
|---|---|---|---|
|1|Current state and checkpoint|Implemented and verified.|Repository baseline, staging backup and remote rollback branch verified. Hosting settings beyond inspected file layout remain pending.|
|2|Signup and payment|User-confirmed.|User confirms working signup/payment. Form IDs and payment destinations preserved. Provisioning, onboarding and failure handling are separate and unverified.|
|3|Commercial offer|Implemented, verification pending.|Current four USD prices and 7-day monthly Essentials trial preserved. Approved matrix read; platform entitlement enforcement remains to verify.|
|4|Exposure and packaging|Implemented, verification pending.|Generated-output-only packaging check passed. Actual hosting still serves the existing repository-root arrangement. History secret scan, visibility intent and authenticated deployment dependency unresolved.|
|5|Environment indexing|Implemented, verification pending.|Staging checks passed. Production configuration prepared; production build and actual headers/DOM need verification.|
|6|Sitemap and canonical host|Implemented, verification pending.|Canonical production sitemap generator and hostname rules prepared. Production output and redirect-chain testing pending.|
|7|Migration redirects|Implemented, verification pending.|Map below prepared. Full live/campaign/Search Console inventory and hosted redirect verification remain pending. Login target is now user-confirmed.|
|8|Favicons and sharing|Implemented, verification pending.|Existing approved logo used for favicon set and 1200x630 PNG fallback. Artifact existence checks passed. Social platform previews and production image responses pending.|
|9|Security|Implemented, verification pending.|Header candidates prepared. Full CSP inventory, report-only test, host enforcement, HSTS/TLS coverage and hosting controls still pending. No claim of complete security.|
|10|Privacy and terms|Blocked by missing information or access.|Privacy Policy approved by Rasheed on 13 November 2026 and implemented in candidate, alongside a separate Cookie Policy at /cookies. Deployment, embedded-storage behaviour and retention operations remain unverified. October terms draft contains superseded pricing and assumptions; not approved for publication. Precise decisions below.|
|11|Cookies and consent|Blocked by missing information or access.|Cookie Policy added with verified first-party session-storage key and separate provider disclosures. Clean-session embedded request/storage attribution remains incomplete. No consent banner or consent-enforcement claim added.|
|12|Conversion regression|Implemented, verification pending.|Read-only form and layout observations captured. No successful submission, duplicate handling, provisioning, cancellation or failure-path verification claimed.|
|13|Annual/demo/contact|get-started and labels: Implemented, verification pending.|Annual CTA labels and monthly-only trial wording prepared; demo links standardised. Contact form exists in CRM but routing/calendar approval not verified.|
|14|Product consistency|Implemented, verification pending.|Approved matrix reviewed. Eligible WhatsApp voice wording preserved. Remaining cross-page/chatbot and usage enforcement reconciliation pending.|
|15|Identity and usefulness|Implemented, verification pending.|Founder/service-area schema additions prepared. Official profiles, legal relationship wording and full educational review pending.|
|16|Schema/crawlers|Implemented, verification pending.|Search crawling and training agents separated in production robots candidate. No ratings or LocalBusiness claims added. llms.txt is optional.|
|17|Local business eligibility|Blocked by missing information or access.|Qualifying in-person service/location and existing profile not established. No profile created.|
|18|Performance|Implemented, verification pending.|Responsive variants and hashed CSS/JS prepared. No lab LCP/CLS/INP or field Core Web Vitals result claimed.|
|19|Mobile/accessibility|Implemented, verification pending.|Targeted focus/text/control CSS prepared; form viewport observations recorded. Full WCAG/manual checks and mobile chat overlap remediation unfinished.|
|20|Measurement|Implemented, verification pending.|Owner instructed GA4 and Meta to remain on hold for launch; public AI chat remains enabled. Source remains without analytics/advertising tags. Embedded-provider behaviour, accounts, consent, success signals and deduplication remain to verify.|
|21|Final handover|Blocked by missing information or access.|This is a checkpoint, not the final release handover. Remaining verification and staging deployment required.|

## Redirect candidate
All mappings are permanent server-side candidates, retaining query parameters. Verify actual HTTP responses and avoid hostname/path chains before release.
| Existing path | Destination |
|---|---|
|/platform/unified-conversations|/inbox|
|/platform/follow-up-automation|/follow-up|
|/platform/customer-reactivation|/reactivation|
|/platform/crm-sales-pipeline|/crm|
|/platform/lead-capture|/lead-capture|
|/platform/appointments|/appointments|
|/platform/reputation-reviews|/reputation|
|/platform/reporting-forecasting|/reporting|
|/who-its-for|/use-cases|
|/who-its-for/b2b|/consultative-sales|
|/who-its-for/b2c|/appointments|
|/how-it-works|/support|
|/free-trial|/signup/essentials|
|/get-started|/pricing|
|/book|/contact|
|/login|https://app.ayudagrow.com/ (user-confirmed)|

The existing live /login was inspected and displayed a route placeholder. Rasheed subsequently confirmed https://app.ayudagrow.com as the staff and client email/password login. A fixed permanent redirect is prepared for /login, /login/ and /login/index.html; query parameters are retained. This is user-confirmed destination information, not an independently tested sign-in or deployed redirect. /book goes to the relevant contact journey; it is not a verified calendar booking experience. Genuine nonexistent routes must return HTTP 404.

## Indexing policy candidate
Staging: noindex,nofollow in source, runtime metadata and HTTP headers; robots disallows all. This is not access security.
Production: public marketing pages index,follow; signup and privacy/terms pages noindex,follow; errors noindex. Signup excluded from sitemap so pricing is the commercial search destination. No personal-data pages are included.
Sitemap uses absolute https://ayudagrow.com URLs without invented modification dates. Production robots references that sitemap, allows public search crawling, and blocks GPTBot, Google-Extended and ClaudeBot. Search and training controls are separate.
Production activation uses SITE_ENV=production, not a launch-day search-and-replace. Runtime navigation must retain the route policy.

## Decisions and access needed
- Confirm public repository intent and deployment authentication before considering private visibility.
- Deploy and verify the prepared login redirect to the user-confirmed destination. Approve a public consultation calendar if booking is to go beyond contact.
- Approve cancellation method, notice/timing, annual renewal rules, refund treatment, trial conversion presentation, support expiry/rollover and additional-charge disclosures.
- Confirm operating entity/contact details, AYUDA Digital relationship, privacy provider contracts/roles, processing locations, retention/deletion practice, rights-request process and effective date.
- Verify actual cookies/storage and target audiences before deciding consent controls.
- Verify CRM provisioning/onboarding triggers, payment matching, duplicate handling and failed-payment/cancellation configuration without sending customer messages.
- Verify AI allowance enforcement and paid overages against account configuration.
- Restore reliable local/browser access for deployment, clean-browser investigation, mobile/manual accessibility and performance measurements.
- Confirm analytics/Search Console account access and the agreed measurement plan.

## Deployment checklist, only after explicit publication approval
1. Finish candidate checks in both environments, review unresolved content, and obtain publication approval separately.
2. Export current hosting files/configuration to a dated backup outside the web root; record exact rollback paths and test restoration on staging.
3. Build staging with SITE_ENV=staging and production with SITE_ENV=production. Publish only verified dist contents. Never upload source/docs/checks/manifests or credentials.
4. Update staging first. Verify direct loads, refreshes, raw headers, rendered metadata, canonical tags, redirects with attribution queries, 404s, forms and chat.
5. After approval, deploy the production artifact to the approved apex website only. Do not modify unrelated subdomains, email, CRM or CMS services.
6. Verify apex HTTPS and www redirects, public-page indexing, transactional exclusions, sitemap, assets, share previews, signup/payment links, chat and measurement deduplication.
7. Confirm staging remains non-indexable. Submit only the production sitemap through authorised Search Console access.

## Rollback
Stop if critical routing, assets, forms, chat or indexing regress. Restore the exact previous public-output directory and its matching .htaccess/hosting configuration from the predeployment backup; clear only relevant website caches; repeat HTTP, forms and metadata smoke checks. Retain the failed release and logs for diagnosis. Do not use source rollback alone as proof that the deployed files were restored. No DNS rollback should be necessary because DNS changes are not authorised.

## Optional post-launch work
Additional educational articles, genuine approved case studies, llms.txt, extra accurate schema and new social profiles are not release blockers.

Recommendation: **Not ready for publication**. Technical verification, staging deployment and the unresolved policy/customer-access decisions above remain.

