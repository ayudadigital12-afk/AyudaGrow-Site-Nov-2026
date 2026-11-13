# Hosting and staging release

## Scope

Target: https://staging2.ayudagrow.com only. The user authorised its update through GitHub. Production, DNS, email and CRM configuration are outside this release.

The existing staging integration uses this repository's main branch and tracked root .htaccess to serve dist internally. Prior deployed-output verification succeeded at 449c38cc1448d7480fb1b59f26645d04c388900a. Hostinger's GitHub App is installed for the repository. No repository webhook is listed in GitHub settings; automatic host pickup has not been independently established. A push is not a deployment confirmation.

## Release procedure

1. Build and test source before changing main. Commit the matching dist, root .htaccess and internal build/route-manifest.json together for this existing integration.
2. Preserve the current main commit for rollback. rollback/staging-20261113-before-approved-update preserves 449c38cc1448d7480fb1b59f26645d04c388900a.
3. Update main using an expected-SHA guard. The main workflow verifies staging HTML/assets byte for byte, policy routes, login and other redirects, query retention, real 404s, protected source paths and noindex safeguards.
4. If the workflow says the host did not serve the new commit, report host pickup as pending. Do not claim success or change production as a workaround.
5. Restore the previous complete tree with a forward rollback commit if deployed routing, forms, assets or indexing regress. Verify the restored hosted output too.

## Public-output boundary

The existing root configuration denies source/configuration paths and routes requests into dist. Keep those rules and verify the denials. For a newly configured host, prefer the contents of release/staging as the document root, using its .htaccess. Do not upload source, tests, internal manifests, credentials or handoff documents as public content. Changing the existing integration's document root requires a separate confirmed host configuration change.

Staging remains noindex,nofollow, with robots Disallow and an empty sitemap. Canonical marketing URLs and sharing metadata are prepared in source; production activation uses a separately verified SITE_ENV=production build and separate publication authorisation.

## Approved services and outstanding production checks

Four supplied signup forms and the AI chat widget are installed. Signup/payment was user-confirmed; the read-only browser checks do not submit forms or payments. GA4 and Meta remain held. Privacy and Cookie Policy text is approved. Actual embedded-storage/consent behaviour, retention operations, commercial terms and downstream onboarding still need the relevant evidence before a production decision.
