import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const extensionPath = resolve(process.cwd(), '.output/chrome-mv3');
const screenshotsDir = resolve(process.cwd(), 'store-assets/screenshots');
mkdirSync(screenshotsDir, { recursive: true });

async function getExtensionId(context) {
  let [background] = context.serviceWorkers();
  if (!background) background = await context.waitForEvent('serviceworker');
  return background.url().split('/')[2];
}

const fixtureHistoryEntry = {
  id: 'store-screenshot-a11y-audit',
  url: 'https://example.com/product-signup',
  title: 'Product Signup Page',
  scannedAt: new Date('2026-04-26T00:00:00.000Z').toISOString(),
  summary: { score: 52, errors: 5, warnings: 3, info: 0, passed: 18 },
  issues: [
    { id: 'a11y.document.lang', category: 'structure', severity: 'error', title: 'Missing document language', message: 'Set a lang attribute on the html element.', selector: 'html' },
    { id: 'a11y.heading.order', category: 'structure', severity: 'warning', title: 'Heading level skipped', message: 'Avoid large jumps in heading levels.', selector: 'body > h4:nth-child(2)' },
    { id: 'a11y.name.interactive', category: 'names', severity: 'error', title: 'Interactive element missing name', message: 'Controls and links need visible text, aria-label, aria-labelledby, or title.', selector: 'button:nth-child(4)' },
    { id: 'a11y.form.label', category: 'forms', severity: 'error', title: 'Form control missing label', message: 'Inputs need a label, aria-label, aria-labelledby, or title.', selector: 'input:nth-child(5)' },
    { id: 'a11y.contrast.text', category: 'contrast', severity: 'warning', title: 'Low text contrast', message: 'Text contrast is approximately 3.4:1; aim for at least 4.5:1 for normal text.', selector: '.muted-copy' },
  ],
  metadata: {},
};

const context = await chromium.launchPersistentContext('', {
  headless: false,
  viewport: { width: 1280, height: 800 },
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});
const extensionId = await getExtensionId(context);

try {
  const popup = await context.newPage();
  await popup.setViewportSize({ width: 420, height: 900 });
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.evaluate((entry) => chrome.storage.local.set({ accessibilitySnapshotHistory: [entry], accessibilitySnapshotLocale: 'en' }), fixtureHistoryEntry);
  await popup.reload();
  await popup.getByRole('button', { name: fixtureHistoryEntry.title }).click();
  await popup.getByText('Missing document language').waitFor({ timeout: 10000 });
  await popup.screenshot({ path: resolve(screenshotsDir, '01-popup-audit-results.png'), fullPage: true });

  await popup.locator('.locale-select').selectOption('zh_CN');
  await popup.getByText('缺少文档语言').waitFor({ timeout: 10000 });
  await popup.screenshot({ path: resolve(screenshotsDir, '02-popup-zh-cn.png'), fullPage: true });

  const options = await context.newPage();
  await options.setViewportSize({ width: 1280, height: 800 });
  await options.goto(`chrome-extension://${extensionId}/options.html`);
  await options.screenshot({ path: resolve(screenshotsDir, '03-options-local-data.png'), fullPage: true });
} finally {
  await context.close();
}
