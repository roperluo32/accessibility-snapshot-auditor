import { extStorage } from './browser';
import type { HistoryEntry, ScanResult } from './types';

const HISTORY_KEY = 'accessibilitySnapshotHistory';
const MAX_HISTORY = 20;

export async function getHistory(): Promise<HistoryEntry[]> {
  const data = await extStorage.get(HISTORY_KEY);
  return Array.isArray(data[HISTORY_KEY]) ? (data[HISTORY_KEY] as HistoryEntry[]) : [];
}

export async function saveScanResult(result: ScanResult): Promise<HistoryEntry[]> {
  const history = await getHistory();
  const entry: HistoryEntry = { ...result, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
  const next = [entry, ...history].slice(0, MAX_HISTORY);
  await extStorage.set({ [HISTORY_KEY]: next });
  return next;
}

export async function clearHistory(): Promise<void> {
  await extStorage.remove(HISTORY_KEY);
}
