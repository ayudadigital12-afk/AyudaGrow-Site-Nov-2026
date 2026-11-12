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

- Plan names remain Essentials, AI Starter, AI Growth, AI Unlimited pending the user's selection. Suggested ladder: Essentials, Assist, Engage, Scale.
- Google Business Messages is not advertised. Google confirms its former chat/API service ended in July 2024. This differs from the workbook's inbox row.
- The workbook's SMS add-on row has not been promoted on the website because the earlier explicit brand instruction excluded SMS. Confirm any desired change separately.
- First-month setup follows the primary comparison row: 2/3/5/5 hours. Other tabs recommend self-serve Tier 1; clarify trial-versus-paid setup before signup activation.
- Card requirements for the trial, automatic conversion, cancellation, usage rate card, fair use, support-block expiry, and final payment destinations require confirmation before checkout opens.
- The platform's documented spending controls are described as configurable, not as already enabled in an account.
- No supplier prices or internal quality-check entitlements are published.

## Verification

Passed: offline build of 33 canonical routes, 13 alias fallbacks and a 404; conversion-review (all routes, Pricing navigation, noindex, chatbot, 12 puzzle interactions, 3 problem selectors, keyboard, 5 Growth Loop stages, 34 app logos, 4 plan destinations, primary-sheet allowances and counts, metadata); existing puzzle, carousel, navigation, four-tier pricing and technical checks.

The broader run found two outdated test expectations: legacy homepage portraits and a 200-character minimum on the deliberately short Get started route. Assertions were revised for the new design. Reverification of these changes is pending.

Automatic approval review interrupted local preview and the broader offline checks due to an unexpected external Visual Studio telemetry request with an unknown payload. An offline network guard was added; the broader check was still blocked. No desktop/mobile browser screenshot or complete release-gate pass is claimed.

## Release and rollback

The GitHub review branch contains the source changes only; its tracked dist remains the base version. The updated artifact was built locally, but must be rebuilt and verified before release. This draft must not replace staging until outstanding verification is completed. Recheck main against the base SHA before merging. Preserve all unrelated changes if main has advanced. Deploy source and matching dist together, retaining the existing root .htaccess.

After deployment: verify all canonical routes and new assets, served script bytes, hover/focus/tap, selectors, growth stages, carousel controls, desktop/mobile overflow, pricing alignment, parameter retention, 404, protected source paths and noindex.

Rollback by reverting the eventual deployment commit, or making a new forward commit restoring the base tree. Do not reset published history or change production/DNS.
