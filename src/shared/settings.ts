import { extStorage } from './browser';
import { normalizeLocale, type AppLocale } from '../i18n';

const LOCALE_KEY = 'accessibilitySnapshotLocale';

export async function getStoredLocale(): Promise<AppLocale> {
  const data = await extStorage.get(LOCALE_KEY);
  return normalizeLocale(data[LOCALE_KEY] as string | undefined || navigator.language);
}

export async function setStoredLocale(locale: AppLocale): Promise<void> {
  await extStorage.set({ [LOCALE_KEY]: locale });
}
