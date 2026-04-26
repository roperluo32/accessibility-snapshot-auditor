import browser from 'webextension-polyfill';

export const ext = browser;
export const extRuntime = browser.runtime;
export const extStorage = browser.storage.local;
export const extTabs = browser.tabs;
