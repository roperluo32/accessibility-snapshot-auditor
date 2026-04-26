import type { IssueCategory, ScanIssue } from './shared/types';

export const supportedLocales = ['en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'de', 'fr', 'es', 'pt_BR'] as const;
export type AppLocale = (typeof supportedLocales)[number];

type UiKey =
  | 'eyebrow' | 'subcopy' | 'loading' | 'scanButton' | 'empty' | 'recentScans' | 'noIssues'
  | 'errors' | 'warnings' | 'passed' | 'cannotFindTab' | 'internalPage'
  | 'noScanResult' | 'scanFailed' | 'optionsTitle' | 'optionsKicker'
  | 'optionsBody' | 'clearHistory' | 'savedScans' | 'all' | 'error' | 'warning' | 'info';

type Dict = Record<UiKey, string>;

export const localeNames: Record<AppLocale, string> = {
  en: 'English',
  zh_CN: '简体中文',
  zh_TW: '繁體中文',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt_BR: 'Português',
};

const en: Dict = {
  eyebrow: 'Local accessibility snapshot',
  subcopy: 'Scan the current page for structure, names, forms, media, ARIA, keyboard, and contrast issues.',
  loading: 'Loading',
  scanButton: 'Audit current page',
  empty: 'Open a public web page and run a local accessibility snapshot. No page content is uploaded.',
  recentScans: 'Recent audits',
  noIssues: 'No issues for this filter.',
  errors: 'Errors',
  warnings: 'Warnings',
  passed: 'Passed',
  cannotFindTab: 'Could not find the current tab.',
  internalPage: 'Browser internal pages cannot be scanned. Please switch to a regular web page.',
  noScanResult: 'The audit script did not return a result.',
  scanFailed: 'Audit failed. Please try again.',
  optionsTitle: 'Options & Local Data',
  optionsKicker: 'Accessibility Snapshot Auditor',
  optionsBody: 'This extension audits pages locally. Audit history is stored only in browser storage.',
  clearHistory: 'Clear audit history',
  savedScans: 'Saved audits',
  all: 'all',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const zh_CN: Dict = {
  ...en,
  eyebrow: '本地无障碍快照',
  subcopy: '扫描当前页面的结构、可访问名称、表单、媒体、ARIA、键盘和颜色对比问题。',
  loading: '加载中',
  scanButton: '审计当前页面',
  empty: '打开一个公开网页并运行本地无障碍快照。页面内容不会上传。',
  recentScans: '最近审计',
  noIssues: '当前筛选下没有问题。',
  errors: '错误',
  warnings: '警告',
  passed: '通过',
  cannotFindTab: '找不到当前标签页。',
  internalPage: '浏览器内部页面无法扫描，请切换到普通网页。',
  noScanResult: '审计脚本没有返回结果。',
  scanFailed: '审计失败，请重试。',
  optionsTitle: '设置与本地数据',
  optionsBody: '此插件在本地审计页面。审计历史只保存在浏览器本地 storage 中。',
  clearHistory: '清除审计历史',
  savedScans: '已保存审计',
  all: '全部',
  error: '错误',
  warning: '警告',
  info: '提示',
};

const zh_TW: Dict = { ...zh_CN, eyebrow: '本機無障礙快照', scanButton: '稽核目前頁面', empty: '開啟公開網頁並執行本機無障礙快照。頁面內容不會上傳。', recentScans: '最近稽核', errors: '錯誤', warnings: '警告', passed: '通過', all: '全部', error: '錯誤', warning: '警告', info: '提示' };
const ja: Dict = { ...en, eyebrow: 'ローカルアクセシビリティ監査', scanButton: '現在のページを監査', recentScans: '最近の監査', errors: 'エラー', warnings: '警告', passed: '合格', all: 'すべて', error: 'エラー', warning: '警告', info: '情報' };
const ko: Dict = { ...en, eyebrow: '로컬 접근성 스냅샷', scanButton: '현재 페이지 감사', recentScans: '최근 감사', errors: '오류', warnings: '경고', passed: '통과', all: '전체', error: '오류', warning: '경고', info: '정보' };
const de: Dict = { ...en, eyebrow: 'Lokaler Accessibility-Snapshot', scanButton: 'Aktuelle Seite prüfen', recentScans: 'Letzte Audits', errors: 'Fehler', warnings: 'Warnungen', passed: 'Bestanden', all: 'alle', error: 'Fehler', warning: 'Warnung', info: 'Info' };
const fr: Dict = { ...en, eyebrow: 'Snapshot accessibilité local', scanButton: 'Auditer la page', recentScans: 'Audits récents', errors: 'Erreurs', warnings: 'Alertes', passed: 'Validés', all: 'tout', error: 'erreur', warning: 'alerte', info: 'info' };
const es: Dict = { ...en, eyebrow: 'Instantánea local de accesibilidad', scanButton: 'Auditar página actual', recentScans: 'Auditorías recientes', errors: 'Errores', warnings: 'Advertencias', passed: 'Correctos', all: 'todo', error: 'error', warning: 'advertencia', info: 'info' };
const pt_BR: Dict = { ...en, eyebrow: 'Snapshot local de acessibilidade', scanButton: 'Auditar página atual', recentScans: 'Auditorias recentes', errors: 'Erros', warnings: 'Alertas', passed: 'Aprovados', all: 'todos', error: 'erro', warning: 'alerta', info: 'info' };

export const dictionaries: Record<AppLocale, Dict> = { en, zh_CN, zh_TW, ja, ko, de, fr, es, pt_BR };

export const categoryLabels: Record<AppLocale, Record<IssueCategory, string>> = Object.fromEntries(
  supportedLocales.map((locale) => [
    locale,
    {
      structure: locale === 'zh_CN' ? '结构' : 'Structure',
      names: locale === 'zh_CN' ? '名称' : 'Names',
      forms: locale === 'zh_CN' ? '表单' : 'Forms',
      media: locale === 'zh_CN' ? '媒体' : 'Media',
      contrast: locale === 'zh_CN' ? '对比度' : 'Contrast',
      aria: 'ARIA',
      keyboard: locale === 'zh_CN' ? '键盘' : 'Keyboard',
    },
  ]),
) as Record<AppLocale, Record<IssueCategory, string>>;

const issueEn: Record<string, { title: string; message: string }> = {
  'a11y.document.lang': { title: 'Missing document language', message: 'Set a lang attribute on the html element.' },
  'a11y.document.title': { title: 'Missing page title', message: 'Add a concise page title for screen reader context.' },
  'a11y.heading.h1': { title: 'Missing H1 heading', message: 'Add one H1 that describes the page purpose.' },
  'a11y.heading.single_h1': { title: 'Multiple H1 headings', message: 'Use one primary H1 where possible.' },
  'a11y.heading.order': { title: 'Heading level skipped', message: 'Avoid large jumps in heading levels.' },
  'a11y.landmark.main': { title: 'Missing main landmark', message: 'Add a main element or role="main" to identify the primary content.' },
  'a11y.media.alt': { title: 'Image missing text alternative', message: 'Informative images need alt text or an accessible name.' },
  'a11y.name.interactive': { title: 'Interactive element missing name', message: 'Controls and links need visible text, aria-label, aria-labelledby, or title.' },
  'a11y.form.label': { title: 'Form control missing label', message: 'Inputs need a label, aria-label, aria-labelledby, or title.' },
  'a11y.aria.hidden_focusable': { title: 'Focusable content hidden from assistive tech', message: 'Do not put interactive controls inside aria-hidden containers.' },
  'a11y.aria.role_name': { title: 'ARIA widget missing name', message: 'Custom ARIA widgets need an accessible name.' },
  'a11y.keyboard.tabindex': { title: 'Positive tabindex found', message: 'Avoid positive tabindex because it creates an unexpected keyboard order.' },
  'a11y.contrast.text': { title: 'Low text contrast', message: 'Text contrast may not meet WCAG guidance.' },
};

const issueZh: Record<string, { title: string; message: string }> = {
  'a11y.document.lang': { title: '缺少文档语言', message: '请在 html 元素上设置 lang 属性。' },
  'a11y.document.title': { title: '缺少页面标题', message: '请添加简洁的页面标题，帮助屏幕阅读器理解上下文。' },
  'a11y.heading.h1': { title: '缺少 H1 标题', message: '请添加一个描述页面目的的 H1。' },
  'a11y.heading.single_h1': { title: '存在多个 H1 标题', message: '尽量只保留一个主要 H1。' },
  'a11y.heading.order': { title: '标题层级跳级', message: '建议不要大幅跳过标题层级。' },
  'a11y.landmark.main': { title: '缺少 main 地标', message: '请添加 main 元素或 role="main" 标识主要内容。' },
  'a11y.media.alt': { title: '图片缺少文本替代', message: '信息性图片需要 alt 文本或可访问名称。' },
  'a11y.name.interactive': { title: '交互元素缺少名称', message: '控件和链接需要可见文本、aria-label、aria-labelledby 或 title。' },
  'a11y.form.label': { title: '表单控件缺少标签', message: '输入控件需要 label、aria-label、aria-labelledby 或 title。' },
  'a11y.aria.hidden_focusable': { title: '可聚焦内容被辅助技术隐藏', message: '不要把交互控件放在 aria-hidden 容器中。' },
  'a11y.aria.role_name': { title: 'ARIA 控件缺少名称', message: '自定义 ARIA 控件需要可访问名称。' },
  'a11y.keyboard.tabindex': { title: '发现正数 tabindex', message: '避免使用正数 tabindex，以免造成异常键盘顺序。' },
  'a11y.contrast.text': { title: '文本对比度偏低', message: '文本对比度可能不符合 WCAG 建议。' },
};

const localizedIssues: Record<AppLocale, Record<string, { title: string; message: string }>> = {
  en: issueEn, zh_CN: issueZh, zh_TW: issueZh, ja: issueEn, ko: issueEn, de: issueEn, fr: issueEn, es: issueEn, pt_BR: issueEn,
};

export function normalizeLocale(value?: string | null): AppLocale {
  const raw = (value || '').replace('-', '_');
  if (supportedLocales.includes(raw as AppLocale)) return raw as AppLocale;
  const lower = raw.toLowerCase();
  if (lower.startsWith('zh')) return lower.includes('tw') || lower.includes('hk') ? 'zh_TW' : 'zh_CN';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('de')) return 'de';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('pt')) return 'pt_BR';
  return 'en';
}

export function t(locale: AppLocale, key: UiKey): string { return dictionaries[locale]?.[key] ?? en[key]; }
export function translateIssue(scanIssue: ScanIssue, locale: AppLocale): ScanIssue {
  const translated = localizedIssues[locale]?.[scanIssue.id] ?? issueEn[scanIssue.id];
  return translated ? { ...scanIssue, title: translated.title, message: translated.message } : scanIssue;
}
