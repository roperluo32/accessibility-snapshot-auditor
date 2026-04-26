import { describe, expect, it } from 'vitest';
import { scanPage } from '../../src/core/scanPage';
import { loadFixture } from './testUtils';

function ids(name: string) {
  return scanPage(loadFixture(name), `https://example.com/${name}`).issues.map((issue) => issue.id);
}

describe('scanPage', () => {
  it('scores an accessible page without errors', () => {
    const result = scanPage(loadFixture('accessible-page.html'), 'https://example.com/accessibility-ready');
    expect(result.summary.score).toBeGreaterThanOrEqual(90);
    expect(result.issues.some((issue) => issue.severity === 'error')).toBe(false);
    expect(result.metadata.accessibility).toMatchObject({
      headings: 2,
      landmarks: expect.any(Number),
      interactiveElements: expect.any(Number),
      images: 1,
    });
  });

  it('detects core accessibility snapshot issues', () => {
    const issueIds = ids('bad-accessibility-page.html');
    expect(issueIds).toContain('a11y.document.lang');
    expect(issueIds).toContain('a11y.document.title');
    expect(issueIds).toContain('a11y.heading.h1');
    expect(issueIds).toContain('a11y.heading.order');
    expect(issueIds).toContain('a11y.landmark.main');
    expect(issueIds).toContain('a11y.media.alt');
    expect(issueIds).toContain('a11y.name.interactive');
    expect(issueIds).toContain('a11y.form.label');
    expect(issueIds).toContain('a11y.aria.hidden_focusable');
    expect(issueIds).toContain('a11y.keyboard.tabindex');
  });
});
