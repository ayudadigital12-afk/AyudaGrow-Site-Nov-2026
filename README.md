# AyudaGrow website

Editable source is in source/public and source/shell.html. dist is generated output; change source and rebuild instead of editing generated pages alone.

## Current staging release

The owner approved updating staging2 with the revised Privacy Policy, Cookie Policy and login redirect. Public AI chat and the four supplied signup forms are retained. GA4 and Meta are held. Production publication remains separate.

Fresh staging source e88ad31fc89bac01ad83d7dcfa1e0a26b094f8dc passed GitHub run 43379941684: build, artifact checks, all 25 non-browser regression suites, read-only browser signup regression, routing generation and output packaging. The generated output commit is 5e43aef94e28ba2f05bd3ac39e1a0da3b3673bba.

Build evidence: https://github.com/ayudadigital12-afk/AyudaGrow-Site-Nov-2026/actions/runs/43379941684

A successful build does not prove deployment. The main-branch Verify deployed staging workflow checks staging2 against the committed output after release. Its result is the hosted-release evidence.

## Build

Use Node 22.12 or later and npm ci. The release asset generator also uses sharp 0.35.5, installed without saving package changes by the release workflow. Run make-release-assets.cjs, scripts/offline-build.mjs, scripts/check-release-artifact.mjs and scripts/build-hostinger-root.mjs for the existing staging integration. scripts/package-release.mjs creates a generated-output-only package.

build/route-manifest.json is internal verification data. Do not expose it as a public URL. Read HOSTING.md before deploying.

## Preserve

Keep the approved design, forms, payment destinations and widget configuration. Provider disclosures on legal pages are intentional. Do not add analytics, invent commercial terms or claim verified onboarding, consent enforcement or operational deletion from policy text alone.
