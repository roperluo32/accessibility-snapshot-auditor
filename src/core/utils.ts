import type { IssueCategory, IssueSeverity, ScanIssue } from '../shared/types';

export function textContent(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

export function metaContent(document: Document, selector: string): string {
  return textContent(document.querySelector<HTMLMetaElement>(selector)?.content);
}

export function issue(input: {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  message: string;
  selector?: string;
  element?: Element | null;
  help?: string;
}): ScanIssue {
  return {
    id: input.id,
    category: input.category,
    severity: input.severity,
    title: input.title,
    message: input.message,
    selector: input.selector,
    elementSnippet: input.element ? snippet(input.element) : undefined,
    help: input.help,
  };
}

export function snippet(element: Element): string {
  const clone = element.cloneNode(false) as Element;
  return clone.outerHTML.replace(/\s+/g, ' ').slice(0, 220);
}

export function isValidUrl(value: string, baseUrl: string): boolean {
  try {
    new URL(value, baseUrl);
    return true;
  } catch {
    return false;
  }
}

export function selectorFor(element: Element): string {
  const id = element.getAttribute('id');
  if (id) return `#${cssEscape(id)}`;
  const attr = element.getAttribute('name') || element.getAttribute('aria-label');
  const tag = element.tagName.toLowerCase();
  if (attr) return `${tag}[${element.hasAttribute('name') ? 'name' : 'aria-label'}="${attr}"]`;
  const parent = element.parentElement;
  if (!parent) return tag;
  const index = Array.from(parent.children).indexOf(element) + 1;
  return `${selectorFor(parent)} > ${tag}:nth-child(${index})`;
}

function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

export function accessibleName(element: Element): string {
  const ariaLabel = textContent(element.getAttribute('aria-label'));
  if (ariaLabel) return ariaLabel;
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = labelledBy
      .split(/\s+/)
      .map((id) => textContent(element.ownerDocument.getElementById(id)?.textContent))
      .filter(Boolean)
      .join(' ');
    if (label) return label;
  }
  const title = textContent(element.getAttribute('title'));
  if (title) return title;
  return textContent(element.textContent);
}
