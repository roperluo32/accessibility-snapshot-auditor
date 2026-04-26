import { describe, expect, it } from 'vitest';
import { generateCsvReport, generateHtmlReport } from '../../src/core/report';
import { scanPage } from '../../src/core/scanPage';
import { loadFixture } from './testUtils';

describe('report generation', () => {
  it('generates standalone html and csv reports', () => {
    const result = scanPage(loadFixture('bad-accessibility-page.html'), 'https://example.com/bad-accessibility');
    expect(generateHtmlReport(result)).toContain('Accessibility Snapshot Auditor Report');
    expect(generateCsvReport(result)).toContain('a11y.form.label');
  });
});
