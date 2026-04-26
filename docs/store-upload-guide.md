# Accessibility Snapshot Auditor Store Upload Guide

Last updated: 2026-04-26

## Upload Packages

- Chrome Web Store: `release/accessibility-snapshot-auditor-0.1.0-chrome.zip`
- Microsoft Edge Add-ons: `release/accessibility-snapshot-auditor-0.1.0-edge.zip`
- Firefox AMO extension: `release/accessibility-snapshot-auditor-0.1.0-firefox.zip`
- Firefox AMO source code: `release/accessibility-snapshot-auditor-0.1.0-sources.zip`

Do not upload `manual-load/chrome-mv3/`; that folder is only for local Chrome developer-mode testing.

## Store Assets

- Icon: `store-assets/final/icon-128.png`
- Logo master: `store-assets/final/logo-master.png`
- Localized hero screenshots: `store-assets/localized/*-store-1280x800.png`
- Real UI screenshots:
  - `store-assets/screenshots/01-popup-audit-results.png`
  - `store-assets/screenshots/02-popup-zh-cn.png`
  - `store-assets/screenshots/03-options-local-data.png`

## Listing Source

- Main listing: `docs/store-listing.md`
- Localized short listings: `docs/store-listing-localized.md`
- Privacy policy: `docs/privacy-policy.md`
- Terms: `docs/terms.md`
- Firefox source build instructions: `docs/firefox-source-build.md`

## Categories

Recommended category:

- Chrome: Developer Tools or Accessibility.
- Edge: Developer tools.
- Firefox: Web Development or Accessibility.

## Privacy And Permissions Notes

Use this review note:

```text
Accessibility Snapshot Auditor only runs after the user clicks the extension action and starts an audit. It uses activeTab and scripting to inject a one-time local audit script into the current tab. It does not request broad host permissions, does not use persistent content scripts, and does not upload page content, DOM, screenshots, or audit results. Audit history and language preferences are stored locally in browser storage.
```

Declared permissions:

- `activeTab`
- `scripting`
- `storage`
- `tabs`

## Manual QA Before Submission

Load `manual-load/chrome-mv3/` in Chrome developer mode and verify:

- Extension loads with the new logo.
- Chrome does not show broad all-sites permission wording.
- A regular web page can be audited after clicking `Audit current page`.
- Browser internal pages show a friendly unsupported-page error.
- HTML and CSV export downloads work.
- Language switching works.
- Recent audit history persists locally.
- Options page can clear history.

## Submission Guardrails

Do not click final submit/review/publish buttons until the store draft, package, screenshots, privacy URL, support email, and permissions are reviewed by the account owner.
