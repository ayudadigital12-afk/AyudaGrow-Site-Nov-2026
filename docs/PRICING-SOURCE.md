# Pricing source and decisions

Updated 12 November 2026. Supersedes the previous Plan comparison workbook.

Authoritative source: AyudaGrow Features Matrix, All Four Plans from GHL.xlsx. Full extracted workbook and private Developer Notes: pricing-matrix-20261112.json.
Library identity: libfile_fde3_f-c9e5c04ef4c88191929ba6e548e8c920_59a27f61de5081919553c4aa4c66cd85, version 0.

- Monthly USD: Essentials 99, Core 149, Build 249, Scale 349. Annual USD: 990, 1490, 2490, 3490. Annual billing is ten months for twelve. JMD display remains unapproved.
- Essentials trial: seven days, card required, automatic conversion to US$99/month unless cancelled. Self-service Start Here/video library only during trial. Guided hours start with the paid subscription. Trial converts to monthly billing regardless of the pricing toggle.
- Build: 1,000 text AI responses shared across web chat, Instagram DM, Facebook DM and WhatsApp. No Voice AI minutes. Additional responses cost US$0.028 each if pay-as-you-go is chosen. Hard stop is the alternative; account behaviour must be configured and checked before activation.
- Scale: unlimited text and Voice AI under fair use. Voice on web chat and WhatsApp calls was confirmed by account-holder testing. Phone-line AI remains unavailable pending a Jamaica route.
- Reviews AI and Google Business Profile optimisation belong to Build and Scale. Other entitlements follow the final matrix.
- WhatsApp is US$19/month optional on Essentials, included on Core/Build/Scale. Message usage remains separate. Do not publish unverified free-message windows or supplier rates.
- Setup hours: 2/3/5/5 in the first paid month. Basic support: one hour/month under fair use; internal allocation is private. Extra support: US$250/5 hours. Developer Notes say expiry/scope/rollover terms are still pending, so do not publish the conflicting 90-day statement as agreed.
- Hold managed agent runs and team-toolkit 2x/5x usage wording until approved. Automation packs are included but not yet built. Do not promise named workflows or completed installation.

## Source corrections and holds

Google Business messaging is excluded because Google retired Business Profile chat on 31 July 2024: https://support.google.com/business/answer/14919056

SMS/phone calling and phone-line Voice AI are withheld pending Jamaica routing/rates and preserve the user's prior channel restriction. Wholesale costs, margins and internal implementation notes stay private.

## Conversion behaviour

Primary journey: website to pricing to plan signup. Secondary: Essentials trial or sales/demo request. Pricing retains the same active main menu, linked home logo, mobile menu and full footer as the rest of the site. The user corrected the earlier instruction on 12 November 2026: only the pricing content CTAs should focus on signup, the Essentials trial and sales/demo enquiries. Do not add campaign or other browse-away CTAs to the pricing content. The shared footer retains its normal privacy link.

Each category initially shows four priority features. Hover expands; click, tap and keyboard can pin or collapse. Escape dismisses the hover expansion, and focus is preserved.

Checkout/trial/demo booking URLs have not been supplied. Keep selection on pricing and preserve plan and billing choices in the email request. Clearly state that no account, payment or booking is created. Do not collect cards, activate external forms, analytics or new integrations.

## Release

Staging only. Preserve root Apache rules and noindex. Production and DNS are out of scope. Rollback base: c5fd7a0b8e84cd5fa95701bc54970d4bb28d54aa.


## Navigation correction release

Restore shared header and footer on pricing, retaining prices, comparison categories and signup/trial/demo behaviour. Staging only. Rollback commit: 58a15dda4793b2e29ec9a4ef0241786a9f677d70. Preserve root Apache rules and noindex.
