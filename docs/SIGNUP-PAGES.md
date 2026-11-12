# Monthly plan signup pages

Requested 12 November 2026. Staging only. Rollback baseline: `9831f906c69a8df4d5feaf33dc3f824646f7df9d`.

Four clean routes under `/signup/` use the supplied hosted forms. Pricing monthly buttons go to these pages. Annual requests remain on the existing email flow because annual checkout destinations were not provided. Standard header/footer navigation stays active on Pricing and the signup pages.

| Plan | Monthly USD | Route | Supplied form | Configured Stripe redirect |
|---|---:|---|---|---|
| Essentials | 99 | /signup/essentials | CkmLMXN55hD2X9hCfO4j | https://buy.stripe.com/9B68wP6kD7pBdHf1yb0480l |
| Core | 149 | /signup/core | 65wBICRDMlJ7RTZPK3dG | https://buy.stripe.com/eVq5kDaAT25hgTr5Or0480m |
| Build | 249 | /signup/build | XidHogjcgDQ48zVVZKSz | https://buy.stripe.com/bJe14ngZh4dpeLjgt50480n |
| Scale | 349 | /signup/scale | abrMomyu1JJgrxPvWYLh | https://buy.stripe.com/eVq14neR9aBNgTrccP0480o |

Public form configuration was read without submitting data. Each form has required first name, last name, phone, account email and business name; a Continue to payment button; and a distinct redirect action. The site does not recreate the forms, submit contact data itself, persist personal details, collect card data or add a direct payment bypass. The supplied embed loader handles resizing and submission redirects. Navigation into and out of signup pages uses full document loads so the embed has a clean lifecycle. A direct-form fallback is available if the embed fails.

## Entitlements

Use the approved final matrix referenced in PRICING-SOURCE.md. The new layout brief conflicts with that matrix on users, calendars, AI allowances and support. A clarification was offered with no answer received, so summaries preserve the explicitly approved source of truth. In particular: Essentials/Core have no customer chatbot; Build has 1,000 shared text responses; Scale text/voice is subject to fair use. No new SLA, priority support or unlimited-everything promise was added. The latest supplied cancellation trust line is retained.

## Payment and provisioning boundaries

Read-only Chrome inspection of all four live Stripe destinations confirmed Essentials: 7 days free then $99/month with payment details requested; Core: $149/month; Build: $249/month; Scale: $349/month. The embedded forms initialized and resized at 1440px and 390px. No contact or payment was submitted. Form configuration marks the five data fields required; their validation is implemented by the hosted form, not native HTML required attributes.

Reading redirect settings is not an end-to-end payment test. Confirm monthly prices, Essentials seven-day trial/card requirement, subscription renewal terms, after-payment destination, matching of signup contact to payment customer, failure/cancellation retries, webhook validation and idempotent account/user provisioning before production. Form submission alone must never be treated as successful payment or an activated subaccount. The same-email instruction helps matching but does not replace a verified backend link.

The supplied forms collect contact information. Account creation can require further business country, timezone and owner-access details, according to the provisioning implementation. The page makes no automatic provisioning guarantee. No workflow, Stripe configuration, production hostname, DNS or analytics was changed.

## Staging and rollback

Keep noindex/nofollow, robots disallow and the empty staging sitemap. Root Apache changes are restricted to four route mappings and their clean-URL normalisation. Preserve source/config protection and actual 404 behavior. Release only the tested build artifact. If needed, restore the source, generated dist and root routing files from baseline commit 9831f906 using a new revert commit; do not force-reset shared history or alter DNS.
