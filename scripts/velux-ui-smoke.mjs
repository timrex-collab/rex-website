/** Lokale UI-/Druckprüfung. Alle POSTs und externen URLs werden gesperrt. */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2];
if (!base) throw new Error('Aufruf: node scripts/velux-ui-smoke.mjs <lokale-preview-url>');
const url = new URL(base);
if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Nur lokale Testserver zulässig');
const output = process.env.VELUX_TEST_OUTPUT ?? 'test-results/velux';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  let posts = 0;
  await ctx.route('**/*', route => {
    const request = route.request();
    if (request.method() !== 'GET') { posts++; return route.abort(); }
    return new URL(request.url()).origin === url.origin ? route.continue() : route.abort();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(`${base}/velux-preisrechner-bochum`);
  const calc = page.locator('#preisrechner');
  await calc.getByRole('button', { name: /^GGU / }).click();
  await calc.getByRole('button', { name: /^MK08/ }).click();
  await calc.getByRole('button', { name: /^ENERGIE Uw/ }).click();
  await calc.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 80));
  await page.screenshot({ path: `${output}/mobile-step1.png` });
  await calc.getByRole('button', { name: 'Weiter zur Förderung', exact: true }).click();
  await calc.getByRole('group', { name: 'Wie alt ist das Gebäude?' }).getByRole('button', { name: 'Älter als 10 Jahre', exact: true }).click();
  for (const name of ['Erfolgt der Einbau als Fenstertausch mit verbessertem Uw-Wert?', 'Ist es selbstgenutztes Wohneigentum?'])
    await calc.getByRole('group', { name }).getByRole('button', { name: 'Ja', exact: true }).click();
  await calc.getByRole('group', { name: 'Liegt ein individueller Sanierungsfahrplan (iSFP) vor?' }).getByRole('button', { name: 'Nein', exact: true }).click();
  await calc.getByRole('button', { name: /Weiter|Ergebnis|berechnen/i }).last().click();
  assert.match(await calc.innerText(), /2\.104/);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Kein horizontaler Überlauf bei 390 px');
  const blankPopup = page.waitForEvent('popup');
  await calc.getByRole('button', { name: 'Nur PDF erstellen', exact: true }).click();
  const anonymous = await blankPopup;
  await anonymous.waitForLoadState();
  assert.match(await anonymous.locator('body').innerText(), /2\.104/);
  assert.equal(await anonymous.evaluate(() => opener), null);
  await anonymous.close();

  // Nur lokale Testdaten: nachweisbar Text statt HTML/ausführbarem Script.
  await calc.getByPlaceholder('Vor- und Nachname').fill('<img src=x onerror="window.pdfInjected=true">');
  await calc.getByPlaceholder('ihre@email.de').fill('local-test@example.invalid');
  const popupPromise = page.waitForEvent('popup');
  await calc.getByRole('button', { name: 'Nur PDF erstellen', exact: true }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  assert.equal(await popup.locator('img').count(), 0);
  assert.equal(await popup.evaluate(() => window.pdfInjected), undefined);
  const printed = await popup.locator('body').innerText();
  for (const text of ['2.104', '316', '421', 'Entsorgung enthalten', 'SML-Steuereinheit', 'Innenrollos', '2026']) assert.ok(printed.includes(text), `Druckansicht enthält ${text}`);
  await popup.pdf({ path: `${output}/calculator-print.pdf`, format: 'A4', printBackground: true });
  await calc.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 80));
  await page.screenshot({ path: `${output}/mobile-result.png` });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await calc.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 90));
  await page.screenshot({ path: `${output}/desktop-result.png` });
  assert.equal(posts, 0, 'PDF und Kalkulation senden keine Daten');
  assert.deepEqual(errors, []);
  console.log('PASS: manueller Wizard, 390-px-Layout, ein H1, UI/PDF-Parität, anonymes PDF, HTML-Escaping, kein POST');
} finally { await browser.close(); }
