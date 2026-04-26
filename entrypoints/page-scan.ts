import { scanPage } from '../src/core/scanPage';

export default defineUnlistedScript(() => scanPage(document, window.location.href));
