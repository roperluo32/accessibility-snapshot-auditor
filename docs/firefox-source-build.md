# Firefox AMO Source Build Instructions

Extension: Accessibility Snapshot Auditor

Version: 0.1.0

## Environment

- Node.js 22.18.0 was used during local packaging.
- pnpm 10.14.0 was used during local packaging.

## Install

```bash
pnpm install --frozen-lockfile
pnpm exec wxt prepare
```

## Verify

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Build Firefox Package

```bash
pnpm build:firefox
pnpm zip:firefox
```

The Firefox extension package is generated under `.output/` as:

```text
accessibility-snapshot-auditor-0.1.0-firefox.zip
```

Generated folders such as `node_modules`, `.output`, `.wxt`, `release`, `manual-load`, `playwright-report`, and `test-results` are intentionally excluded from this source archive.
