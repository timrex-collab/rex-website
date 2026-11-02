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

/** Zerlegt einen abgefangenen Multipart-Body (nur lokale Testanfragen). */
function parseMultipart(buffer, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  assert.ok(m, `Multipart erwartet, erhalten: ${contentType}`);
  const boundary = Buffer.from(`--${m[1] || m[2]}`);
  const parts = [];
  for (let start = buffer.indexOf(boundary); start !== -1;) {
    const next = buffer.indexOf(boundary, start + boundary.length);
    if (next === -1) break;
    const part = buffer.subarray(start + boundary.length + 2, next - 2);
    const headEnd = part.indexOf('\r\n\r\n');
    const head = part.subarray(0, headEnd).toString('utf8');
    parts.push({
      name: /name="([^"]*)"/.exec(head)?.[1],
      filename: /filename="([^"]*)"/.exec(head)?.[1],
      type: /Content-Type:\s*([^\r\n]+)/i.exec(head)?.[1],
      data: part.subarray(headEnd + 4),
    });
    start = next;
  }
  return {
    // Multipart überträgt Zeilenumbrüche in Textfeldern als CRLF (HTML-Standard).
    field: name => parts.find(p => p.name === name && p.filename === undefined)?.data.toString('utf8').replace(/\r\n/g, '\n'),
    file: name => parts.find(p => p.name === name && p.filename !== undefined),
  };
}

/** Breite und Höhe aus dem SOF-Segment eines JPEG. */
function jpegSize(buf) {
  for (let i = 2; i + 9 < buf.length;) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const length = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + length;
  }
  return null;
}

/** JPEG 3000 × 1500 mit EXIF-Drehung 90° (Orientation 6) und einer Kennung im Kommentar. */
async function makeTestJpeg(page) {
  const dataUrl = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 3000; c.height = 1500;
    const g = c.getContext('2d');
    g.fillStyle = '#d0d0d0'; g.fillRect(0, 0, 3000, 1500);
    g.fillStyle = '#202020'; g.font = 'bold 160px sans-serif'; g.fillText('GGL SK10 3059', 200, 800);
    return c.toDataURL('image/jpeg', 0.9);
  });
  const jpeg = Buffer.from(dataUrl.split(',')[1], 'base64');
  const tiff = Buffer.from([0x4d, 0x4d, 0x00, 0x2a, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, 6, 0, 0, 0, 0, 0, 0]);
  const exifPayload = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
  const app1 = Buffer.concat([Buffer.from([0xff, 0xe1]), Buffer.from([0, exifPayload.length + 2]), exifPayload]);
  const note = Buffer.from('GPS-TESTMARKE 51.48N 7.21E', 'latin1');
  const com = Buffer.concat([Buffer.from([0xff, 0xfe, 0, note.length + 2]), note]);
  return Buffer.concat([jpeg.subarray(0, 2), app1, com, jpeg.subarray(2)]);
}

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
  let lastPost = null;
  // 'fail' beantwortet den Versand mit 500, 'ok' mit 200 — kein Byte verlässt den Browser.
  let submitMode = 'fail';
  await ctx.route('**/*', route => {
    const request = route.request();
    if (request.method() !== 'GET') {
      posts++;
      lastPost = { buffer: request.postDataBuffer() || Buffer.alloc(0), contentType: request.headers()['content-type'] };
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
  assert.match(await calc.innerText(), /Hosting- und Formulardienstleister Netlify/);
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
  const sent = parseMultipart(lastPost.buffer, lastPost.contentType);
  const sentKonfig = sent.field('konfiguration') || '';
  assert.equal(sent.field('form-name'), 'velux-preisrechner');
  assert.equal(sent.file('typenschild'), undefined, 'Ohne Foto kein Dateiteil');
  assert.match(sent.field('quelle') || '', /Aufmerksam geworden: keine Angabe\nKonfiguration: im Rechner eingegeben/);
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

  /* ── P1: Foto des Typenschilds und Herkunft der Konfiguration ─────────────── */
  const forms = await (await page.request.get(`${base}/formulare.html`)).text();
  assert.match(forms, /enctype="multipart\/form-data"/, 'Formulardefinition für Multipart');
  assert.match(forms, /type="file" name="typenschild"/, 'Formulardefinition kennt das Fotofeld');
  assert.match(forms, /name="quelle"/, 'Formulardefinition kennt das Herkunftsfeld');

  const photoCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await photoCtx.addInitScript(() => { window.open = () => null; });
  let photoPost = null;
  let photoSubmitMode = 'ok';
  let photoPosts = 0;
  await photoCtx.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin !== url.origin) return route.abort();
    if (request.method() === 'GET') return route.continue();
    photoPosts++;
    photoPost = parseMultipart(request.postDataBuffer() || Buffer.alloc(0), request.headers()['content-type']);
    return route.fulfill({ status: photoSubmitMode === 'ok' ? 200 : 500, contentType: 'text/html', body: 'ok' });
  });
  const photoPage = await photoCtx.newPage();
  photoPage.on('pageerror', error => errors.push(String(error)));
  const photoCalc = photoPage.locator('#preisrechner');
  const fileInput = photoCalc.locator('#typenschild-foto');
  const submitPhoto = async () => {
    const before = photoPosts;
    await photoCalc.getByRole('button', { name: /Anfrage senden/ }).click();
    await photoCalc.getByText(photoSubmitMode === 'ok' ? 'Anfrage erfolgreich gesendet' : 'Senden fehlgeschlagen', { exact: false }).waitFor();
    assert.equal(photoPosts, before + 1, 'Genau ein Versand');
    return photoPost;
  };

  // Herkunft per Rechner-Link, unverändert, mit Foto und Herkunftsangabe
  await photoPage.goto(`${base}/velux-preisrechner-bochum#rechner=1&p=GGU.MK08.ENERGIE.1&f=over_10.yes.yes.no`);
  await photoCalc.getByTestId('calculator-link-notice').waitFor();
  await photoCalc.getByPlaceholder('Vor- und Nachname').fill('Testfall Foto');
  await photoCalc.getByPlaceholder('ihre@email.de').fill('local-test@example.invalid');
  await photoCalc.locator('#herkunft').selectOption('KI-Assistent (z. B. ChatGPT)');
  const testJpeg = await makeTestJpeg(photoPage);
  assert.ok(testJpeg.includes(Buffer.from('Exif')) && testJpeg.includes(Buffer.from('GPS-TESTMARKE')), 'Testbild trägt EXIF und Kennung');
  await fileInput.setInputFiles({ name: 'IMG_0001.jpg', mimeType: 'image/jpeg', buffer: testJpeg });
  await photoCalc.getByTestId('photo-selected').waitFor();
  assert.match(await photoCalc.getByTestId('photo-selected').innerText(), /1000 × 2000 px/, 'Gedreht und auf 2.000 px verkleinert');
  assert.equal(await photoPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Fotofeld ohne Überlauf bei 390 px');
  let sentP1 = await submitPhoto();
  const photoPart = sentP1.file('typenschild');
  assert.ok(photoPart, 'Foto im Multipart-Versand');
  assert.equal(photoPart.type, 'image/jpeg');
  assert.equal(photoPart.filename, 'typenschild.jpg');
  assert.deepEqual(jpegSize(photoPart.data), { width: 1000, height: 2000 }, 'Gesendetes Foto gedreht und verkleinert');
  assert.ok(photoPart.data.length < 5 * 1024 * 1024, 'Foto unter 5 MB');
  assert.equal(photoPart.data.includes(Buffer.from('Exif')), false, 'Keine EXIF-Daten im gesendeten Foto');
  assert.equal(photoPart.data.includes(Buffer.from('GPS-TESTMARKE')), false, 'Keine Metadaten-Kennung im gesendeten Foto');
  assert.equal(sentP1.field('quelle'), 'Aufmerksam geworden: KI-Assistent (z. B. ChatGPT)\nKonfiguration: per Rechner-Link übernommen, unverändert');
  assert.match(sentP1.field('konfiguration') || '', /GGU MK08/);

  // Geändert: Förderantwort umstellen, erneut senden (Foto bleibt angehängt)
  await photoPage.getByRole('button', { name: 'Zurück', exact: true }).click();
  await photoCalc.getByRole('group', { name: 'Liegt ein individueller Sanierungsfahrplan (iSFP) vor?' }).getByRole('button', { name: 'Ja', exact: true }).click();
  await photoCalc.getByRole('button', { name: /Kosten berechnen|Weiter/i }).last().click();
  await photoCalc.getByPlaceholder('Vor- und Nachname').fill('Testfall Foto');
  await photoCalc.getByPlaceholder('ihre@email.de').fill('local-test@example.invalid');
  sentP1 = await submitPhoto();
  assert.match(sentP1.field('quelle') || '', /Konfiguration: per Rechner-Link übernommen, geändert$/);
  assert.equal(sentP1.file('typenschild'), undefined, 'Nach Rücksprung kein altes Foto mehr angehängt');

  // Fehlversand mit Foto: Hinweis im Fehlertext und im mailto-Ersatzweg
  await fileInput.setInputFiles({ name: 'IMG_0002.jpg', mimeType: 'image/jpeg', buffer: testJpeg });
  await photoCalc.getByTestId('photo-selected').waitFor();
  photoSubmitMode = 'fail';
  sentP1 = await submitPhoto();
  assert.ok(sentP1.file('typenschild'), 'Auch der fehlgeschlagene Versuch trug das Foto');
  assert.match(await photoCalc.innerText(), /Das Foto wird nicht automatisch mitgeschickt – bitte selbst anhängen oder nachreichen/);
  const photoMailto = decodeURIComponent(await photoCalc.locator('a[href^="mailto:"]').first().getAttribute('href'));
  assert.match(photoMailto, /Foto des Typenschilds: Das Foto wird nicht automatisch mitgeschickt/);
  photoSubmitMode = 'ok';

  // Foto entfernen, Übergröße, HEIC und Nicht-Bild verständlich abgelehnt
  await photoCalc.getByRole('button', { name: 'Foto entfernen', exact: true }).click();
  await fileInput.setInputFiles({ name: 'gross.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(21 * 1024 * 1024, 1) });
  assert.match(await photoCalc.getByTestId('photo-error').innerText(), /zu groß \(über 20 MB\)/);
  await fileInput.setInputFiles({ name: 'IMG_0003.HEIC', mimeType: 'image/heic', buffer: Buffer.from('keine echten Bilddaten') });
  assert.match(await photoCalc.getByTestId('photo-error').innerText(), /HEIC/);
  await fileInput.setInputFiles({ name: 'notiz.txt', mimeType: 'text/plain', buffer: Buffer.from('kein Bild') });
  assert.match(await photoCalc.getByTestId('photo-error').innerText(), /JPEG, PNG oder HEIC/);
  assert.equal(await photoCalc.getByTestId('photo-selected').count(), 0, 'Nach Fehler kein Foto angehängt');

  // Neue Berechnung setzt die Herkunft zurück
  await photoCalc.getByRole('button', { name: 'Neue Berechnung', exact: true }).click();
  await runWizard(photoPage, photoCalc);
  await photoCalc.getByPlaceholder('Vor- und Nachname').fill('Testfall Foto');
  await photoCalc.getByPlaceholder('ihre@email.de').fill('local-test@example.invalid');
  sentP1 = await submitPhoto();
  assert.equal(sentP1.field('quelle'), 'Aufmerksam geworden: keine Angabe\nKonfiguration: im Rechner eingegeben');
  assert.equal(sentP1.file('typenschild'), undefined);
  await photoCtx.close();
  assert.deepEqual(errors, []);

  /* ── W1: Rechner-Link im Fragment (ohne Kontaktdaten) ──────────────────────── */
  // Gleicher Goldwert wie die manuelle Eingabe oben, auf Handy- und Desktop-Breite.
  const linkCtx = await browser.newContext();
  let linkPosts = 0;
  await linkCtx.route('**/*', route => {
    if (route.request().method() !== 'GET') { linkPosts++; return route.abort(); }
    return new URL(route.request().url()).origin === url.origin ? route.continue() : route.abort();
  });
  const linkPage = await linkCtx.newPage();
  linkPage.on('pageerror', error => errors.push(String(error)));
  const linkCalc = linkPage.locator('#preisrechner');
  const notice = linkCalc.getByTestId('calculator-link-notice');
  // Nur das Fragment zu ändern lädt die Seite nicht neu; ein echter Aufruf startet frisch.
  const openFresh = async target => { await linkPage.goto('about:blank'); await linkPage.goto(target); };
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    await linkPage.setViewportSize(viewport);
    await openFresh(`${base}/velux-preisrechner-bochum#rechner=1&p=GGU.MK08.ENERGIE.1&f=over_10.yes.yes.no`);
    await notice.waitFor();
    assert.match(await notice.innerText(), /aus dem Link übernommen/);
    assert.match(await linkCalc.innerText(), /2\.104/, `Link ergibt bei ${viewport.width} px denselben Betrag wie die manuelle Eingabe`);
    assert.equal(await linkPage.evaluate(() => location.hash), '', 'Fragment nach dem Lesen entfernt');
  }
  assert.equal(await linkPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Kein horizontaler Überlauf mit Link-Hinweis');
  await openFresh(`${base}/velux-preisrechner-bochum#rechner=1&p=GGU.MK08.ENERGIE.1`);
  await notice.waitFor();
  assert.match(await notice.innerText(), /Fragen zur Förderung/);
  await linkCalc.getByRole('group', { name: 'Wie alt ist das Gebäude?' }).waitFor();
  assert.doesNotMatch(await linkCalc.innerText(), /2\.104/, 'Ohne Förderangaben noch keine Kostenschätzung');
  for (const [hash, text] of [['#rechner=2&p=GGU.MK08.ENERGIE.1', /anderen Version/], ['#rechner=1&p=GPU.CK02.ENERGIE.1', /keine gültige Konfiguration/]]) {
    await openFresh(`${base}/velux-preisrechner-bochum${hash}`);
    await notice.waitFor();
    assert.match(await notice.innerText(), text);
    assert.equal(await linkCalc.getByRole('button', { name: 'Weiter zur Förderung', exact: true }).isDisabled(), true, 'Ungültiger Link: leerer Rechner in Schritt 1');
    assert.equal(await linkPage.evaluate(() => location.hash), '', 'Auch ungültiges Fragment wird entfernt');
  }
  await openFresh(`${base}/velux-preisrechner-bochum`);
  await linkCalc.waitFor();
  assert.equal(await notice.count(), 0, 'Ohne Link kein Hinweis');
  assert.equal(linkPosts, 0, 'Der Link sendet nichts');
  await linkCtx.close();
  assert.deepEqual(errors, []);

  console.log('PASS: manueller Wizard, 390-px-Layout, ein H1, UI/PDF-Parität, PDF nur nach bestätigtem Versand, erneutes Öffnen ohne Versand, Fehlversand ohne PDF, Druckansicht entwertet, Popup-Rückfallebene, HTML-Escaping, Typenschild-Foto (gedreht, verkleinert, ohne EXIF, Multipart, Fehlversand-Hinweis, Übergröße, HEIC), Herkunft (Link unverändert/geändert, Reset), Rechner-Link (Handy/Desktop, ohne Förderung, Version, ungültig)');
} finally { await browser.close(); }
