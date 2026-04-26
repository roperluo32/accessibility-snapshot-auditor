import type { CategoryResult, ScanContext, ScanResult } from '../shared/types';
import { scanAccessibility } from './scanAccessibility';
import { summarize } from './score';

export function scanPage(document: Document, url = document.location.href): ScanResult {
  const context: ScanContext = { document, url };
  const categoryResults: Record<string, CategoryResult> = {
    accessibility: scanAccessibility(context),
  };
  const issues = Object.values(categoryResults).flatMap((result) => result.issues);
  const passed = Object.values(categoryResults).reduce((total, result) => total + result.passed, 0);

  return {
    url,
    title: document.title || url,
    scannedAt: new Date().toISOString(),
    summary: summarize(issues, passed),
    issues,
    metadata: Object.fromEntries(
      Object.entries(categoryResults).map(([name, result]) => [name, result.metadata ?? {}]),
    ),
  };
}
