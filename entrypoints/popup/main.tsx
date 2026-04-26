import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, Download, ExternalLink, Gauge, Loader2, Search, Sparkles, XCircle } from 'lucide-react';
import { generateCsvReport, generateHtmlReport, groupIssues } from '../../src/core/report';
import { categoryLabels, localeNames, supportedLocales, t, translateIssue, type AppLocale } from '../../src/i18n';
import { extTabs } from '../../src/shared/browser';
import { getStoredLocale, setStoredLocale } from '../../src/shared/settings';
import { getHistory, saveScanResult } from '../../src/shared/storage';
import type { HistoryEntry, IssueCategory, IssueSeverity, ScanIssue, ScanResult } from '../../src/shared/types';
import './popup.css';

type ViewFilter = 'all' | IssueSeverity;

function App() {
  const [locale, setLocale] = useState<AppLocale>('en');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<ViewFilter>('all');

  useEffect(() => { void refreshState(); }, []);

  async function refreshState() {
    const [savedHistory, storedLocale] = await Promise.all([getHistory(), getStoredLocale()]);
    setHistory(savedHistory);
    setLocale(storedLocale);
  }

  async function changeLocale(next: AppLocale) {
    setLocale(next);
    await setStoredLocale(next);
  }

  async function scanCurrentPage() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(window.location.search);
      const forcedTabId = params.get('tabId');
      const forcedScanUrl = params.get('scanUrl');
      const tab = forcedTabId
        ? await extTabs.get(Number(forcedTabId))
        : forcedScanUrl
          ? (await extTabs.query({})).find((candidate) => candidate.url === forcedScanUrl)
          : (await extTabs.query({ active: true, currentWindow: true }))[0];
      if (!tab?.id) throw new Error(t(locale, 'cannotFindTab'));
      if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) throw new Error(t(locale, 'internalPage'));
      const injected = await browser.scripting.executeScript({ target: { tabId: tab.id }, files: ['/page-scan.js'] });
      const scanResult = injected[0]?.result as ScanResult | undefined;
      if (!scanResult) throw new Error(t(locale, 'noScanResult'));
      setResult(scanResult);
      setHistory(await saveScanResult(scanResult));
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : t(locale, 'scanFailed'));
    } finally {
      setLoading(false);
    }
  }

  function download(filename: string, mime: string, content: string) {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportReport(type: 'html' | 'csv') {
    if (!result) return;
    const localized = localizedResult ?? result;
    const safeDate = result.scannedAt.slice(0, 10);
    if (type === 'html') download(`accessibility-snapshot-${safeDate}.html`, 'text/html', generateHtmlReport(localized));
    else download(`accessibility-snapshot-${safeDate}.csv`, 'text/csv', generateCsvReport(localized));
  }

  const localizedResult = useMemo(() => result ? { ...result, issues: result.issues.map((item) => translateIssue(item, locale)) } : null, [result, locale]);
  const filteredIssues = useMemo(() => localizedResult?.issues.filter((item) => filter === 'all' || item.severity === filter) ?? [], [filter, localizedResult]);
  const grouped = useMemo(() => groupIssues(filteredIssues), [filteredIssues]);

  return (
    <main className="popup-shell">
      <section className="hero">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> {t(locale, 'eyebrow')}</p>
          <h1>Accessibility Snapshot Auditor</h1>
          <p className="subcopy">{t(locale, 'subcopy')}</p>
        </div>
        <div className="top-controls">
          <select className="locale-select" value={locale} onChange={(event) => void changeLocale(event.target.value as AppLocale)} aria-label="Language">
            {supportedLocales.map((item) => <option key={item} value={item}>{localeNames[item]}</option>)}
          </select>
        </div>
      </section>

      <section className="actions free-actions">
        <button className="primary" onClick={scanCurrentPage} disabled={loading}>{loading ? <Loader2 className="spin" size={17} /> : <Search size={17} />} {t(locale, 'scanButton')}</button>
      </section>

      {error && <div className="notice error"><AlertTriangle size={16} /> {error}</div>}

      {localizedResult ? <>
        <section className="score-card"><div className="score-orb"><Gauge size={19} /> {localizedResult.summary.score}</div><div className="score-copy"><strong>{localizedResult.title}</strong><span>{new URL(localizedResult.url).hostname}</span></div></section>
        <section className="metric-grid"><Metric icon={<XCircle size={16} />} label={t(locale, 'errors')} value={localizedResult.summary.errors} tone="bad" /><Metric icon={<AlertTriangle size={16} />} label={t(locale, 'warnings')} value={localizedResult.summary.warnings} tone="warn" /><Metric icon={<CheckCircle2 size={16} />} label={t(locale, 'passed')} value={localizedResult.summary.passed} tone="good" /></section>
        <section className="toolbar">{(['all', 'error', 'warning', 'info'] as ViewFilter[]).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{t(locale, item)}</button>)}</section>
        <section className="exports"><button onClick={() => exportReport('html')}><Download size={15} /> HTML</button><button onClick={() => exportReport('csv')}><Download size={15} /> CSV</button></section>
        <section className="issues">{Object.entries(grouped).map(([category, items]) => <div className="issue-group" key={category}><h2>{categoryLabels[locale][category as IssueCategory]} <span>{items.length}</span></h2>{items.slice(0, 8).map((item, index) => <IssueRow item={item} key={`${item.id}-${index}`} />)}</div>)}{filteredIssues.length === 0 && <p className="empty">{t(locale, 'noIssues')}</p>}</section>
      </> : <section className="empty-state"><div className="stamp">QA</div><p>{t(locale, 'empty')}</p></section>}

      <section className="history"><h2>{t(locale, 'recentScans')}</h2>{history.slice(0, 4).map((entry) => <button key={entry.id} onClick={() => setResult(entry)}><span>{entry.summary.score}</span><strong>{entry.title}</strong><ExternalLink size={13} /></button>)}</section>
    </main>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) { return <div className={`metric ${tone}`}>{icon}<span>{label}</span><strong>{value}</strong></div>; }
function IssueRow({ item }: { item: ScanIssue }) { return <article className={`issue ${item.severity}`}><div><strong>{item.title}</strong><p>{item.message}</p>{item.selector && <code>{item.selector}</code>}</div><span>{item.severity}</span></article>; }

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
