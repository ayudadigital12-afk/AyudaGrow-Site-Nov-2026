# AyudaGrow Site — November 2026

Editable source and generated static files for the AyudaGrow website.

**Repository-ready, not yet launch-approved.** Indexing is disabled. This package does not configure hosting, DNS, GitHub Pages, automatic deployment, forms, payments or analytics.

## Quick start

Use Node.js 24 LTS (Node 22.12+ also meets the dependency requirements).

```sh
npm ci
npm run build
npm test
npm start
```

Open http://127.0.0.1:4173/. Stop with Ctrl+C. `npm run dev` runs the same local server. `PORT` and `HOST` can override its local defaults. The preview server is a development tool, not a production hosting recommendation.

The checked-in `dist/` is already built, so `npm start` works before installing build dependencies. Building and testing require `npm ci`. There are no account credentials or runtime secrets required for the current static site.

## Editing

- `dist/*.js`, `dist/*.css` and `dist/assets/`: editable application modules, styles and served images/fonts.
- `source/shell.html`: shared page shell, navigation and footer.
- `scripts/build-search-pages.mjs`: generates complete HTML documents for 34 canonical pages, legacy fallbacks, 404, metadata and crawl-control files.
- `scripts/render-page.mjs`: renders the page modules with jsdom during the build.
- `checks/`: automated content, interaction, route, asset and draft-safety checks.
- `dist/*/index.html`: generated pages. Change their source modules, then rebuild; do not edit these copies alone.

This build uses the files in `dist/` as both runtime source and generated output. Do not delete `dist/` before building. Run `npm run build` and `npm test` after each change, then commit both source changes and regenerated pages.

## What is included

The latest approved homepage portrait replacements, current WhatsApp Business icon, current plan comparison, working email/telephone contact links, and the latest privacy review draft.

Confirmed public contact: admin@ayudagrow.com, +1 876-480-0413. The privacy draft identifies Ayuda Grow LLC, registered in Florida, and the supplied address of 7901 Fourth Street North, St. Petersburg, Florida. No suite or ZIP has been invented.

## Public repository notice

A public repository exposes its source and assets to anyone, even while the website is not launched. `noindex` is a crawler instruction, not privacy or access control. It does not make this repository private.

The package excludes previous Git history, account-specific hosting bindings, private preview URLs, credentials, internal audit/review reports, browser captures and unused original brand source images. The website's visible review banners, privacy draft, pricing qualifications and creative-concept page remain because they are part of this working website version. Review them before public hosting; do not mistake draft source for an approved legal or commercial statement.

Do not commit `.env` files, API keys, customer data or login credentials. No project-wide open-source license has been added. See `ASSETS.md` for third-party notices.

## Hosting and later updates

A static host must serve **the contents of `dist/`** as the web root. Do not serve the repository root, build scripts, tests or Node dependencies. See `HOSTING.md` for the release checklist and redirect requirements.

Uploading this source to GitHub does not publish ayudagrow.com or connect auto-deployment. That is a separate setup after the hosting account, deployment target and release branch are verified.

For changes after launch: work on a branch, build/test, review, then merge into the host's configured release branch. Keep the previous successful release available for rollback. No hosting workflow or credential grant is included in this package.
