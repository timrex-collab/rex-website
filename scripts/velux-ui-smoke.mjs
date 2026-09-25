/**
 * Lokale UI-/Druckprüfung. Externe URLs sind gesperrt; ein POST verlässt den Browser nie —
 * der Versand wird lokal beantwortet, damit das Export-Gate aus D7 prüfbar bleibt.
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2];
if (!base) throw new Error('Aufruf: node scripts/velux-ui-smoke.mjs <lokale-preview-url>');
const url = new URL(base);
if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error('Nur lokale Testserver zulässig');
const output = process.env.VELUX_TEST_OUTPUT ?? 'test-results/velux';
await mkdir(output, { recursive: true });
const executablePath = process.env.CHROME_PATH || undefined;

/** Wizard bis zur Ergebnisseite: Fenster wählen, Förderfragen beantworten, berechnen. */
async function runWizard(page, calc) {
  await calc.getByRole('button', { name: /^GGU / }).click();
  await calc.getByRole('button', { name: /^MK08/ }).click();
  await calc.getByRole('button', { name: /^ENERGIE Uw/ }).click();
  await calc.getByRole('button', { name: 'Weiter zur Förderung', exact: true }).click();
  await calc.getByRole('group', { name: 'Wie alt ist das Gebäude?' }).getByRole('button', { name: 'Älter als 10 Jahre', exact: true }).click();
  for (const name of ['Erfolgt der Einbau als Fenstertausch mit verbessertem Uw-Wert?', 'Ist es selbstgenutztes Wohneigentum?'])
    await calc.getByRole('group', { name }).getByRole('button', { name: 'Ja', exact: true }).click();
  await calc.getByRole('group', { name: 'Liegt ein individueller Sanierungsfahrplan (iSFP) vor?' }).getByRole('button', { name: 'Nein', exact: true }).click();
  await calc.getByRole('button', { name: /Weiter|Ergebnis|berechnen/i }).last().click();
}

const browser = await chromium.launch({ executablePath });
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  let posts = 0;
  let lastPostBody = '';
  // 'fail' beantwortet den Versand mit 500, 'ok' mit 200 — kein Byte verlässt den Browser.
  let submitMode = 'fail';
  await ctx.route('**/*', route => {
    const request = route.request();
    if (request.method() !== 'GET') {
      posts++;
      lastPostBody = request.postData() || '';
      if (new URL(request.url()).origin !== url.origin) return route.abort();
      return submitMode === 'ok'
        ? route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' })
        : route.fulfill({ status: 500, contentType: 'text/html', body: 'nope' });
    }
    return new URL(request.url()).origin === url.origin ? route.continue() : route.abort();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(`${base}/velux-preisrechner-bochum`);
  const calc = page.locator('#preisrechner');
  await calc.getByRole('button', { name: /^GGU / }).click();
  await calc.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 80));
  await page.screenshot({ path: `${output}/mobile-step1.png` });
  await calc.getByRole('button', { name: /^MK08/ }).click();
  await calc.getByRole('button', { name: /^ENERGIE Uw/ }).click();
  await calc.getByRole('button', { name: 'Weiter zur Förderung', exact: true }).click();
  await calc.getByRole('group', { name: 'Wie alt ist das Gebäude?' }).getByRole('button', { name: 'Älter als 10 Jahre', exact: true }).click();
  for (const name of ['Erfolgt der Einbau als Fenstertausch mit verbessertem Uw-Wert?', 'Ist es selbstgenutztes Wohneigentum?'])
    await calc.getByRole('group', { name }).getByRole('button', { name: 'Ja', exact: true }).click();
  await calc.getByRole('group', { name: 'Liegt ein individueller Sanierungsfahrplan (iSFP) vor?' }).getByRole('button', { name: 'Nein', exact: true }).click();
  await calc.getByRole('button', { name: /Weiter|Ergebnis|berechnen/i }).last().click();
  assert.match(await calc.innerText(), /2\.104/);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Kein horizontaler Überlauf bei 390 px');

  /* ── D7, Fall 1: ohne abgesendete Anfrage kein PDF ────────────────────────── */
  assert.equal(await calc.getByRole('button', { name: 'Nur PDF erstellen', exact: true }).count(), 0, 'Anonymer Export ist entfallen');
  assert.equal(await calc.getByRole('button', { name: /PDF erneut öffnen/ }).count(), 0, 'Gate ist vor dem Versand zu');
  assert.match(await calc.innerText(), /Verfügbar, sobald Sie Ihre Anfrage abgeschickt haben/);
  assert.match(await calc.innerText(), /Keine Weitergabe an Dritte/);
  assert.equal(await calc.locator('a[href="/datenschutz"]').count(), 1, 'Datenschutzhinweis verlinkt');

  /* ── D7, Fall 2: Direktdruck der Seite zeigt keine Zahlen ─────────────────── */
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.rechner-ergebnis').isVisible(), false, 'Ergebnis im Druck ausgeblendet');
  const printHint = await page.locator('.rechner-print-hinweis').innerText();
  assert.match(printHint, /sobald Sie Ihre Anfrage im Preisrechner abgeschickt haben/);
  assert.equal(printHint.includes('2.104'), false, 'Druckhinweis nennt keine Beträge');
  await page.emulateMedia({ media: 'screen' });

  /* ── D7, Fall 3: fehlgeschlagener Versand → kein PDF, mailto greift ───────── */
  // Nur lokale Testdaten: nachweisbar Text statt HTML/ausführbarem Script.
  await calc.getByPlaceholder('Vor- und Nachname').fill('<img src=x onerror="window.pdfInjected=true">');
  await calc.getByPlaceholder('ihre@email.de').fill('local-test@example.invalid');
  const failedPopup = page.waitForEvent('popup');
  await calc.getByRole('button', { name: /Anfrage senden/ }).click();
  const waitWindow = await failedPopup;
  await page.waitForFunction(() => document.body.innerText.includes('Senden fehlgeschlagen'));
  assert.equal(waitWindow.isClosed(), true, 'Wartefenster schließt sich ohne PDF');
  assert.equal(await calc.getByRole('button', { name: /PDF erneut öffnen/ }).count(), 0, 'Gate bleibt nach Fehlversand zu');
  const mailtoHref = await calc.locator('a[href^="mailto:"]').first().getAttribute('href');
  assert.match(decodeURIComponent(mailtoHref), /info@rex-bedachung\.de/, 'mailto-Rückfallebene sichtbar erreichbar');
  assert.match(decodeURIComponent(mailtoHref), /2\.104/, 'Ersatzweg trägt die Kalkulation');
  assert.doesNotMatch(decodeURIComponent(mailtoHref), /PDF beigef/i, 'Ersatzweg behauptet keinen PDF-Anhang');
  assert.match(decodeURIComponent(mailtoHref), /Selbstgenutztes Wohneigentum: ja/, 'Ersatzweg trägt die Förder-Angaben');

  /* ── D7, Fall 4: bestätigter Versand schaltet das PDF frei ────────────────── */
  submitMode = 'ok';
  const popupPromise = page.waitForEvent('popup');
  await calc.getByRole('button', { name: /Anfrage senden/ }).click();
  const popup = await popupPromise;
  const sentKonfig = new URLSearchParams(lastPostBody).get('konfiguration') || '';
  for (const text of ['Angaben im Förder-Check:', 'Gebäudealter: älter als 10 Jahre', 'Annahmen BEG:', 'Annahmen §35c:', 'Regelstand:'])
    assert.ok(sentKonfig.includes(text), `Anfrage enthält ${text}`);
  await popup.waitForLoadState();
  await popup.waitForFunction(() => document.body.innerText.includes('2.104'));
  assert.equal(await popup.evaluate(() => opener), null);
  assert.equal(await popup.locator('img').count(), 0);
  assert.equal(await popup.evaluate(() => window.pdfInjected), undefined);
  const printed = await popup.locator('body').innerText();
  for (const text of ['2.104', '316', '421', 'Entsorgung enthalten', 'SML-Steuereinheit', 'Innenrollos', '2026']) assert.ok(printed.includes(text), `Druckansicht enthält ${text}`);
  await popup.pdf({ path: `${output}/calculator-print.pdf`, format: 'A4', printBackground: true });
  await popup.close();

  /* ── D7, Fall 5: erneut öffnen — gleiche Konfiguration, kein weiterer POST ── */
  const postsBeforeReopen = posts;
  const reopened = page.waitForEvent('popup');
  await calc.getByRole('button', { name: /PDF erneut öffnen/ }).click();
  const again = await reopened;
  await again.waitForFunction(() => document.body.innerText.includes('2.104'));
  assert.equal(await again.locator('body').innerText(), printed, 'Erneut geöffnet: identisches Dokument');
  assert.equal(posts, postsBeforeReopen, 'Erneutes Öffnen sendet nichts');
  await again.close();

  /* ── D7, Fall 6: geänderte Konfiguration schließt das Gate wieder ─────────── */
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await calc.getByRole('button', { name: /Kosten berechnen|Weiter/i }).last().click();
  assert.equal(await calc.getByRole('button', { name: /PDF erneut öffnen/ }).count(), 0, 'Nach Rücksprung ist das Gate wieder zu');

  await calc.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 80));
  await page.screenshot({ path: `${output}/mobile-result.png` });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await calc.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 90));
  await page.screenshot({ path: `${output}/desktop-result.png` });
  assert.equal(posts, 2, 'Genau die zwei Versandversuche, keine weiteren Übertragungen');
  assert.deepEqual(errors, []);

  /* ── D7, Fall 7: blockiertes Popup — Freischaltung greift trotzdem ─────────── */
  // Eigener Kontext mit stillgelegtem window.open: so verhält sich der Browser wie
  // mit aktivem Popup-Blocker, ohne von dessen Heuristik abzuhängen.
  const blockedCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await blockedCtx.addInitScript(() => { window.open = () => null; });
  await blockedCtx.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin !== url.origin) return route.abort();
    return request.method() === 'GET'
      ? route.continue()
      : route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });
  });
  const blockedPage = await blockedCtx.newPage();
  await blockedPage.goto(`${base}/velux-preisrechner-bochum`);
  const blockedCalc = blockedPage.locator('#preisrechner');
  await runWizard(blockedPage, blockedCalc);
  await blockedCalc.getByPlaceholder('Vor- und Nachname').fill('Testfall Popup');
  await blockedCalc.getByPlaceholder('ihre@email.de').fill('local-test@example.invalid');
  await blockedCalc.getByRole('button', { name: /Anfrage senden/ }).click();
  await blockedCalc.getByRole('button', { name: /PDF erneut öffnen/ }).waitFor();
  assert.match(await blockedCalc.innerText(), /Druckfenster wurde vom Browser blockiert/);
  await blockedCtx.close();

  console.log('PASS: manueller Wizard, 390-px-Layout, ein H1, UI/PDF-Parität, PDF nur nach bestätigtem Versand, erneutes Öffnen ohne Versand, Fehlversand ohne PDF, Druckansicht entwertet, Popup-Rückfallebene, HTML-Escaping');
} finally { await browser.close(); }
