import type { ScanIssue, ScanSummary } from '../shared/types';

export function summarize(issues: ScanIssue[], passed: number): ScanSummary {
  const errors = issues.filter((item) => item.severity === 'error').length;
  const warnings = issues.filter((item) => item.severity === 'warning').length;
  const info = issues.filter((item) => item.severity === 'info').length;
  const penalty = errors * 14 + warnings * 5 + Math.min(info * 1, 8);
  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, errors, warnings, info, passed };
}
