import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { HistoryEntry } from '../../src/shared/types';

const extensionPath = resolve(process.cwd(), '.output/chrome-mv3');

async function launchWithExtension(): Promise<{ context: BrowserContext; extensionId: string }> {
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  let [background] = context.serviceWorkers();
  if (!background) background = await context.waitForEvent('serviceworker');
  const extensionId = background.url().split('/')[2];
  return { context, extensionId };
}

function fixtureHistoryEntry(): HistoryEntry {
  return {
    id: 'fixture-accessible-page',
    url: 'https://example.com/launch-checklist',
    title: 'Complete Product Launch Checklist for Modern Web Teams',
    scannedAt: new Date('2026-04-25T00:00:00.000Z').toISOString(),
    summary: { score: 96, errors: 0, warnings: 1, info: 1, passed: 24 },
    issues: [
      {
        id: 'a11y.keyboard.tabindex',
        category: 'keyboard',
        severity: 'warning',
        title: 'Positive tabindex found',
        message: 'Avoid positive tabindex because it creates an unexpected keyboard order.',
        selector: 'button[tabindex="3"]',
      },
    ],
    metadata: {},
  };
}

test.describe('Accessibility Snapshot Auditor extension', () => {
  test('does not request broad host permissions in the release manifest', () => {
    const manifest = JSON.parse(readFileSync(resolve(extensionPath, 'manifest.json'), 'utf8')) as {
      permissions?: string[];
      host_permissions?: string[];
      content_scripts?: unknown[];
    };

    expect(manifest.permissions ?? []).toEqual(
      expect.arrayContaining(['activeTab', 'scripting', 'storage', 'tabs']),
    );
    expect(manifest.host_permissions ?? []).toHaveLength(0);
    expect(manifest.content_scripts ?? []).toHaveLength(0);
    expect(JSON.stringify(manifest)).not.toContain('http://*/*');
    expect(JSON.stringify(manifest)).not.toContain('https://*/*');
    expect(JSON.stringify(manifest)).not.toContain('<all_urls>');
  });

  test('exports reports for free users and supports language switching', async () => {
    const { context, extensionId } = await launchWithExtension();
    const entry = fixtureHistoryEntry();
    await context.addInitScript((historyEntry) => {
      window.localStorage.setItem('e2e-ready', 'true');
      chrome.storage.local.set({ accessibilitySnapshotHistory: [historyEntry] });
    }, entry);

    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await popup.getByRole('button', { name: entry.title }).click();
    await expect(popup.locator('.score-card')).toContainText('Complete Product Launch Checklist', {
      timeout: 10_000,
    });
    await expect(popup.getByText('Positive tabindex found')).toBeVisible();

    const downloadPromise = popup.waitForEvent('download');
    await popup.getByRole('button', { name: 'HTML' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/accessibility-snapshot-.*\.html/);

    await popup.locator('.locale-select').selectOption('zh_CN');
    await expect(popup.getByText('本地无障碍快照')).toBeVisible();
    await expect(popup.getByText('发现正数 tabindex')).toBeVisible();
    await context.close();
  });
});
