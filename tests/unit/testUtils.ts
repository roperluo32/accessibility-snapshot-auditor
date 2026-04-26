import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadFixture(name: string): Document {
  const html = readFileSync(resolve(process.cwd(), 'tests/fixtures', name), 'utf8');
  document.documentElement.innerHTML = '';
  document.open();
  document.write(html);
  document.close();
  return document;
}
