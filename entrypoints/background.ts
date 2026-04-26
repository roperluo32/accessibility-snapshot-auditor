export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    console.info('Accessibility Snapshot Auditor installed');
  });
});
