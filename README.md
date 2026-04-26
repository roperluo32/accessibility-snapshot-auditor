# Accessibility Snapshot Auditor

Accessibility Snapshot Auditor is a free browser extension for local accessibility snapshots.

It audits the current page for accessibility structure, accessible names, form labels, media alternatives, ARIA pitfalls, keyboard order, and text contrast. Reports can be exported as HTML or CSV, and scan history stays in local browser storage.

## Browser Targets

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

## Current Version

Version `0.1.0` is free and does not include accounts, subscriptions, payment flows, or remote entitlement checks.

## Development

```bash
pnpm install
pnpm exec wxt prepare
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
```

## Build

```bash
pnpm build:chrome
pnpm build:edge
pnpm build:firefox
```

## Release Packages

```bash
pnpm zip:chrome
pnpm zip:edge
pnpm zip:firefox
```

## Privacy Policy

The privacy page is in `site/privacy.html` and can be deployed with GitHub Pages.
