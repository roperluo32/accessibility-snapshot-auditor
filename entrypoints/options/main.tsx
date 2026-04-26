import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { localeNames, supportedLocales, t, type AppLocale } from '../../src/i18n';
import { getStoredLocale, setStoredLocale } from '../../src/shared/settings';
import { clearHistory, getHistory } from '../../src/shared/storage';
import type { HistoryEntry } from '../../src/shared/types';
import './options.css';

function App() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [locale, setLocale] = useState<AppLocale>('en');
  useEffect(() => { void Promise.all([getHistory(), getStoredLocale()]).then(([items, storedLocale]) => { setHistory(items); setLocale(storedLocale); }); }, []);
  async function resetHistory() { await clearHistory(); setHistory([]); }
  async function changeLocale(next: AppLocale) { setLocale(next); await setStoredLocale(next); }
  return <main className="options-shell"><section className="panel"><p className="kicker">{t(locale, 'optionsKicker')}</p><h1>{t(locale, 'optionsTitle')}</h1><p>{t(locale, 'optionsBody')}</p><label className="language-row">Language<select value={locale} onChange={(event) => void changeLocale(event.target.value as AppLocale)}>{supportedLocales.map((item) => <option key={item} value={item}>{localeNames[item]}</option>)}</select></label><button onClick={resetHistory}>{t(locale, 'clearHistory')}</button><div className="history-count">{t(locale, 'savedScans')}: {history.length}</div></section></main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
