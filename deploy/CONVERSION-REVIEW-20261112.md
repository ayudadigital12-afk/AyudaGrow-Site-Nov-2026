# Homepage and four-tier pricing draft

Base and rollback: 54d794aa301b33369ba6ee023ef47a50fd5c5825.
Target: staging2.ayudagrow.com only. Production and DNS are outside this change.

Source of truth: AyudaGrow_Pricing_and_Tier_Breakout_2026-11-11 claude.xlsx, Plan comparison tab. Other tabs conflict; their recommendations have not overridden that tab.

## Changes

- Problem-led hero beside the retained twelve-piece interactive puzzle.
- Coloured layered SVG icons alongside the approved robot mascot.
- Three accessible problem selectors with a shared problem/fix panel.
- Homepage order: hero, problems, who we serve, Growth Loop, AI knowledge, unified inbox, app carousel, onboarding overview, closing invitation.
- Compact spacing, industry icons, distributed decorative brand marks and smaller app cards. Motion respects reduced-motion preferences. The app carousel keeps its own pause control; the header motion button remains removed.
- Pricing navigation, four monthly USD plans (99, 149, 249, 349), seven-day Essentials trial, grouped entitlement table and plan-aware email enquiries.
- Monthly credit-card billing described as the intended service. No checkout, trial account creation, card capture, analytics or booking scheduler is activated.
- Shared closing links lead to Pricing rather than an assessment/support loop.

## Deliberate exceptions and decisions still needed

- Confirmed by the user: Essentials US$99, Core US$149, Build US$249, Scale US$349 per month. The free seven-day trial applies to Essentials only.
- Google Business Messages is not advertised. Google confirms its former chat/API service ended in July 2024. This differs from the workbook's inbox row.
- The workbook's SMS add-on row has not been promoted on the website because the earlier explicit brand instruction excluded SMS. Confirm any desired change separately.
- First-month setup follows the primary comparison row: 2/3/5/5 hours. Other tabs recommend self-serve Tier 1; clarify trial-versus-paid setup before signup activation.
- Card requirements for the trial, automatic conversion, cancellation, usage rate card, fair use, support-block expiry, and final payment destinations require confirmation before checkout opens.
- The platform's documented spending controls are described as configurable, not as already enabled in an account.
- No supplier prices or internal quality-check entitlements are published.

## Verification

Full release checks passed on GitHub run 43158999222, source commit 5c9604c3fb0e6f500f1dc9412cebbbc7f07775a9:

- Offline build: 33 canonical pages, 13 alias fallbacks and a 404.
- Eight regression suites: homepage, carousel, navigation, pricing, contact/privacy, search readiness, technical readiness, white-label readiness.
- Conversion review: all routes, plan names/prices/entitlements, plan-specific enquiries, twelve puzzle pieces, three selectors with keyboard, five Growth Loop stages and 34 app logos.
- Real Chrome: homepage at 1366x768 and 390x844; pricing at 1440x900 and 390x844; Build enquiry at 1366x768. No runtime errors, no horizontal page overflow, no broken images including all lazy-loaded assets. Desktop pricing usage panels align. The puzzle description ends at 732px within the 768px viewport.
- Desktop and mobile screenshots reviewed. Further tightened AI illustration spacing and removed duplicate setup-step counters. The connected logos render at 25px square.

Local Windows verification encountered a locked telemetry setting. Verification was completed instead in GitHub Actions. An initial Linux browser crash was resolved by removing a Windows-oriented testing flag. These are resolved verification environment issues, not remaining website failures.

## Deployment checks

The main-branch workflow checks only staging2. It waits for the matching homepage, verifies exact HTML for all 33 canonical routes and exact JavaScript/CSS bytes, then checks legacy redirects, 404 handling, protected source/config paths, robots and sitemap. Deployment results must be recorded after that workflow completes.

## Release and rollback

The release combines the reviewed source with the exact built files downloaded from the successful GitHub run. Recheck main against the base SHA before deployment. Preserve all unrelated changes if main has advanced. Retain the existing root .htaccess. No production or DNS changes are authorized.

After deployment: verify all canonical routes and new assets, served script bytes, hover/focus/tap, selectors, growth stages, carousel controls, desktop/mobile overflow, pricing alignment, parameter retention, 404, protected source paths and noindex.

Rollback by reverting the eventual deployment commit, or making a new forward commit restoring the base tree. Do not reset published history or change production/DNS.
