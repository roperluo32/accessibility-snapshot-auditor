import type { CategoryResult, ScanContext, IssueCategory, ScanIssue } from '../shared/types';
import { accessibleName, issue, selectorFor, textContent } from './utils';

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[tabindex]',
].join(',');

const LANDMARK_SELECTOR = 'main,nav,header,footer,aside,form,[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"],[role="search"]';

export function scanAccessibility({ document }: ScanContext): CategoryResult {
  const issues: ScanIssue[] = [];
  let passed = 0;

  const html = document.documentElement;
  if (!textContent(html.getAttribute('lang'))) {
    issues.push(makeIssue('a11y.document.lang', 'structure', 'error', 'Missing document language', 'Set a lang attribute on the html element.', html));
  } else passed += 1;

  const title = textContent(document.title);
  if (!title) {
    issues.push(makeIssue('a11y.document.title', 'structure', 'error', 'Missing page title', 'Add a concise page title for screen reader context.', document.querySelector('head') ?? html));
  } else passed += 1;

  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
  const h1s = headings.filter((heading) => heading.tagName === 'H1');
  if (h1s.length === 0) {
    issues.push(makeIssue('a11y.heading.h1', 'structure', 'error', 'Missing H1 heading', 'Add one H1 that describes the page purpose.', document.body ?? html));
  } else if (h1s.length > 1) {
    issues.push(makeIssue('a11y.heading.single_h1', 'structure', 'warning', 'Multiple H1 headings', 'Use one primary H1 where possible.', h1s[1]));
  } else passed += 1;

  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = Number(heading.tagName.slice(1));
    if (previousLevel && level - previousLevel > 1) {
      issues.push(makeIssue('a11y.heading.order', 'structure', 'warning', 'Heading level skipped', `${heading.tagName.toLowerCase()} appears after h${previousLevel}.`, heading));
    } else passed += 1;
    previousLevel = level;
  });

  const landmarks = Array.from(document.querySelectorAll(LANDMARK_SELECTOR));
  if (!landmarks.some((item) => item.matches('main,[role="main"]'))) {
    issues.push(makeIssue('a11y.landmark.main', 'structure', 'warning', 'Missing main landmark', 'Add a main element or role="main" to identify the primary content.', document.body ?? html));
  } else passed += 1;

  Array.from(document.querySelectorAll('img,svg[role="img"],[role="img"]')).forEach((element) => {
    const decorative = element.getAttribute('aria-hidden') === 'true' || element.getAttribute('role') === 'presentation' || element.getAttribute('role') === 'none';
    const hasAlt = element instanceof HTMLImageElement ? element.hasAttribute('alt') : Boolean(accessibleName(element));
    if (!decorative && !hasAlt) {
      issues.push(makeIssue('a11y.media.alt', 'media', 'error', 'Image missing text alternative', 'Informative images need alt text or an accessible name.', element));
    } else passed += 1;
  });

  Array.from(document.querySelectorAll('button,[role="button"],a[href],[role="link"],summary')).forEach((element) => {
    if (!accessibleName(element)) {
      issues.push(makeIssue('a11y.name.interactive', 'names', 'error', 'Interactive element missing name', 'Controls and links need visible text, aria-label, aria-labelledby, or title.', element));
    } else passed += 1;
  });

  Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="hidden"]), select, textarea')).forEach((control) => {
    if (!hasFormLabel(control)) {
      issues.push(makeIssue('a11y.form.label', 'forms', 'error', 'Form control missing label', 'Inputs need a label, aria-label, aria-labelledby, or title.', control));
    } else passed += 1;
  });

  Array.from(document.querySelectorAll('[aria-hidden="true"]')).forEach((element) => {
    if (element.querySelector(INTERACTIVE_SELECTOR) || element.matches(INTERACTIVE_SELECTOR)) {
      issues.push(makeIssue('a11y.aria.hidden_focusable', 'aria', 'error', 'Focusable content hidden from assistive tech', 'Do not put interactive controls inside aria-hidden containers.', element));
    } else passed += 1;
  });

  Array.from(document.querySelectorAll('[role]')).forEach((element) => {
    const role = textContent(element.getAttribute('role'));
    if (['button', 'link', 'checkbox', 'radio', 'switch', 'tab'].includes(role) && !accessibleName(element)) {
      issues.push(makeIssue('a11y.aria.role_name', 'aria', 'error', 'ARIA widget missing name', 'Custom ARIA widgets need an accessible name.', element));
    } else passed += 1;
  });

  Array.from(document.querySelectorAll(INTERACTIVE_SELECTOR)).forEach((element) => {
    const tabindex = element.getAttribute('tabindex');
    if (tabindex && Number(tabindex) > 0) {
      issues.push(makeIssue('a11y.keyboard.tabindex', 'keyboard', 'warning', 'Positive tabindex found', 'Avoid positive tabindex because it creates an unexpected keyboard order.', element));
    } else passed += 1;
  });

  const contrastCandidates = Array.from(document.querySelectorAll('body, body *')).filter((element) => textContent(element.textContent).length > 0).slice(0, 250);
  contrastCandidates.forEach((element) => {
    const ratio = contrastRatioFor(element);
    if (ratio !== null && ratio < 4.5) {
      issues.push(makeIssue('a11y.contrast.text', 'contrast', 'warning', 'Low text contrast', `Text contrast is approximately ${ratio.toFixed(2)}:1; aim for at least 4.5:1 for normal text.`, element));
    } else if (ratio !== null) passed += 1;
  });

  return {
    issues,
    passed,
    metadata: {
      headings: headings.length,
      landmarks: landmarks.length,
      interactiveElements: document.querySelectorAll(INTERACTIVE_SELECTOR).length,
      images: document.querySelectorAll('img,svg[role="img"],[role="img"]').length,
    },
  };
}

function makeIssue(id: string, category: IssueCategory, severity: 'error' | 'warning' | 'info', title: string, message: string, element: Element): ScanIssue {
  return issue({ id, category, severity, title, message, selector: selectorFor(element), element });
}

function hasFormLabel(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  const id = control.getAttribute('id');
  const hasExplicit = Boolean(id && control.ownerDocument.querySelector(`label[for="${cssEscape(id)}"]`));
  const hasImplicit = Boolean(control.closest('label'));
  const hasAria = Boolean(accessibleName(control));
  return hasExplicit || hasImplicit || hasAria;
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

function contrastRatioFor(element: Element): number | null {
  const view = element.ownerDocument.defaultView;
  if (!view) return null;
  const style = view.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') return null;
  const foreground = parseColor(style.color);
  const background = nearestBackground(element);
  if (!foreground || !background || foreground.alpha < 0.95 || background.alpha < 0.95) return null;
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function nearestBackground(element: Element): Rgba | null {
  const view = element.ownerDocument.defaultView;
  let current: Element | null = element;
  while (current && view) {
    const color = parseColor(view.getComputedStyle(current).backgroundColor);
    if (color && color.alpha > 0) return color;
    current = current.parentElement;
  }
  return { red: 255, green: 255, blue: 255, alpha: 1 };
}

interface Rgba {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

function parseColor(value: string): Rgba | null {
  const rgba = value.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgba) return null;
  const parts = rgba[1].split(',').map((part) => part.trim());
  if (parts.length < 3) return null;
  const [red, green, blue] = parts.slice(0, 3).map(Number);
  const alpha = parts[3] === undefined ? 1 : Number(parts[3]);
  if ([red, green, blue, alpha].some((part) => Number.isNaN(part))) return null;
  return { red, green, blue, alpha };
}

function relativeLuminance(color: Rgba): number {
  const [red, green, blue] = [color.red, color.green, color.blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}
