# Privacy and Cookie Policy release changes

Rasheed approved AyudaGrow_Privacy_Policy_Revised.docx, Library version 2, on 13 November 2026. The candidate's /privacy page reproduces that approved text and adds a link to /cookies. Publication approval remains false.

## Launch decisions

- Public AI chat remains enabled with the existing widget ID.
- GA4 and Meta are held for launch. No analytics or advertising tags were added.
- Chat transcripts: 12 months after the conversation ends.
- Unsuccessful leads: 24 months after the last meaningful contact, excluding automated outbound messages as a clock reset.
- Closed-account operational data: 90 days, with separate treatment of billing/legal records and provider backups.
- Minimal marketing suppression records: indefinitely to honour preferences.

## Website implementation

- Replaced the incomplete privacy notice with the owner-approved public copy.
- Added /cookies, metadata, footer links and links beside the existing signup embeds.
- Kept the existing forms, Stripe destinations, chat widget and navigation implementation.
- Added a narrow white-label-check exception for named provider disclosures and exact policy links on the legal pages. Marketing pages retain the existing white-label restrictions.
- Applied the existing legal-page noindex policy consistently to /cookies in runtime metadata, production route configuration and Apache header generation. Staging remains non-indexable.
- Updated obsolete contact/privacy assertions that required the old incomplete-policy wording.

## Cookie evidence and limits

The first-party source writes sessionStorage key ayudaVisits:clean-v1 in source/public/navigation.js. It caches up to 100 visit records with route, scroll position and interface state. No separate first-party cookie write or localStorage write was found in the inspected runtime source.

The Cookie Policy describes embedded form/chat and Stripe storage separately. It does not present HighLevel's own website-cookie inventory as an AyudaGrow inventory, invent provider expiration periods, classify every embedded cookie as essential, or claim a working consent banner. Provider references are https://www.gohighlevel.com/cookies-policy and https://stripe.com/legal/cookies-policy, checked on 13 November 2026.

Clean-browser inspection of actual embedded cookies, storage and network requests remains outstanding. This document and the Cookie Policy do not establish whether optional provider technologies load before consent or whether consent enforcement is required for the final configuration. Actual controls must match the deployed services. The configured retention processes have not been independently tested.

## Verification

Passed source-level checks:

- JavaScript syntax for changed runtime modules, configuration and existing checks.
- Both policy rendering functions execute and produce one heading each.
- Every paragraph and retention-table cell in the approved Word policy is present in generated privacy content.
- Footer and signup policy links, route titles/descriptions, table caption and scoped headers.
- Production legal-page exclusions and Apache /cookies routing/header rule generation.
- Chat widget ID preserved, measurement remains disabled, publication approval remains false.

Full-site builds, the jsdom-based repository suite and visual browser checks were not run. The missing jsdom dependency could not be installed because registry.npmjs.org was unreachable (ENOTFOUND). Initial installation also encountered an external-store symlink permission error; a workspace-local store advanced to the network failure. These are verification limits, not passing build results.

Neither staging nor production was deployed. Rebuild from source and rerun the artifact, contact/privacy, search, white-label and production-readiness checks before deployment. The tracked older dist directory was not manually edited and is not the updated release artifact. Do not upload that directory without rebuilding.
