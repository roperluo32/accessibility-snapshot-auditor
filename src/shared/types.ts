export type IssueSeverity = 'error' | 'warning' | 'info';

export type IssueCategory =
  | 'structure'
  | 'names'
  | 'forms'
  | 'media'
  | 'contrast'
  | 'aria'
  | 'keyboard';

export interface ScanIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  message: string;
  selector?: string;
  elementSnippet?: string;
  help?: string;
}

export interface ScanSummary {
  score: number;
  errors: number;
  warnings: number;
  info: number;
  passed: number;
}

export interface ScanResult {
  url: string;
  title: string;
  scannedAt: string;
  summary: ScanSummary;
  issues: ScanIssue[];
  metadata: Record<string, unknown>;
}

export interface CategoryResult {
  issues: ScanIssue[];
  passed: number;
  metadata?: Record<string, unknown>;
}

export interface ScanContext {
  document: Document;
  url: string;
}

export interface HistoryEntry extends ScanResult {
  id: string;
}
