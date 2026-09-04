# WebMCP-Pilot: VELUX-Preisrechner

**Stand:** 04.09.2026 · **Status:** technischer Kompatibilitätstest, Produktion standardmäßig **AUS** (Dark Deploy) · **Plan:** Session-Plan v3 vom 04.09.2026

WebMCP (Web Model Context Protocol, W3C Web Machine Learning CG; in Chrome als Origin Trial 149–156) lässt eine Seite typisierte Tools für KI-Agenten registrieren. Dieser Pilot stellt den VELUX-Preisrechner unter `/velux-preisrechner-bochum` als vier Tools bereit. Der Rechner bleibt die einzige Preis- und Förderlogik; WebMCP ist nur ein zusätzlicher Kanal. Ohne WebMCP (oder bei ausgeschaltetem Flag) läuft die Seite unverändert.

## Architektur

```
Kunden-KI / Chrome-Agent
        │  document.modelContext (Origin Trial / Flag)
        ▼
client/src/lib/webmcp.ts          Adapter: Flag (fail-closed), Origin-Allowlist, Token, registerTool (Promise), Signale, Events
client/src/hooks/useWebMCPTool.ts Lebensdauer = Komponente (AbortController)
client/src/lib/velux/tools.ts     4 Tool-Definitionen + Presenter (Schlüssel englisch, Texte deutsch)
client/src/lib/velux/validate.ts  strikter Parser/Validator (unbekannte Schlüssel, Enums, Größen je Modell, Mengen)
client/src/lib/velux/bridge.ts    React-Bridge für das Apply-Tool (bestätigter Commit, BUSY/DRAFT_EXISTS/ABORTED)
        │
        ▼
client/src/lib/velux/{catalog,estimate,funding,content,resolve,legacyCatalog}.ts   – dieselben Module wie UI und PDF
```

Regel: `tools.ts` enthält keine Preis-, Förder- oder Katalogregeln und keine eigenen Preistexte.

## Tools (Vertrag v1)

| Tool | `readOnlyHint` | Zweck |
|---|---|---|
| `rex_velux_get_options_v1` | true | Modelle, Größen (mit cm), Verglasungen (Uw/g, förderrelevant), Zubehör, Randbedingungen; Einzelpreise nur mit `includePrices` + `model` |
| `rex_velux_resolve_existing_window_v1` | true | Typenschild-Angaben (Typ, Größe, auch Alt-Codes) gegen den Katalog prüfen → Status, Kandidaten, nächster Schritt. Kein Bild, kein Rohtext; Alt-Codes nie stillschweigend umgeschlüsselt (siehe `VELUX-TYPENSCHILD.md`) |
| `rex_velux_calculate_estimate_v1` | true | Reine Berechnung: Material (UVP netto) + EDW 2000 + Einbau-Mindestpreise, MwSt., BEG-Zuschuss und §35c als nicht kombinierbare Alternativen mit Annahmen; kein UI-Effekt, keine Speicherung, kein Netzwerk |
| `rex_velux_apply_configuration_v1` | **false** | Übernimmt eine validierte Konfiguration in den sichtbaren Rechner (Schritt 3), nur mit `replaceExisting=true` über einen begonnenen Entwurf; bestätigt erst nach React-Commit; sendet nichts |

Namen nur `[a-z0-9_]`, ≤ 64 Zeichen (kompatibel mit Claude-/OpenAI-Toolnamen).

**Eingabe `calculate`/`apply`:** `positions[]` (`model` GGU/GGL/GPU/GPL, `size` CK02…UK10, `glazing` THERMO/ENERGIE/ENERGIE_PLUS, `quantity` 1–10, `shutter` none/SSL/SML, `shutterQuantity?`, `blind` none/DKL/DSL, `blindQuantity?`), `funding` (`buildingAge` under_5/5_to_10/over_10/unknown; `energyRenovation`, `ownerOccupied`, `hasIsfp` je yes/no/unknown), optional `existingWindow`, `includeBreakdown`, bei apply `replaceExisting`. Die vollständigen JSON-Schemas stehen in `validate.ts`.

**Antwort `calculate`:** `ok, contractVersion, scope, catalog{name,validFrom,revision}, rulesVersions, calculatedAt, estimateFingerprint, currency, vatRate, summary, totals{grossFrom,netFrom,vat,windowCount}, positions[], funding{notCombinable, ineligibleThermoPositions, eligibleCostsGross, begGrant|null, begGrantReason, taxBonus35c|null, taxBonus35cReason, notes[]}, assumptions[], exclusions[], disclaimer, nextStep, pageUrl, breakdown|null`. Typische Größe: ~3,1 kB (1 Position), ~4,5 kB (3 Positionen), mit `breakdown` bis ~6 kB. `estimateFingerprint` (`VX-xxxxxxxx`) ist ein deterministischer Hash aus Vertrag, Katalog-Revision, Regelversionen und Eingabe – reproduzierbar ohne Datenbank.

**Fehler:** `{ ok:false, error:{ code, message, path?, allowedValues?, allowedSizes? }, pageUrl }` mit Codes `INVALID_INPUT, UNKNOWN_FIELD, INVALID_ENUM, INVALID_SIZE_FOR_MODEL, ACCESSORY_QTY_EXCEEDS_WINDOWS, SCOPE_NOT_SUPPORTED, DRAFT_EXISTS, BUSY, ABORTED, INTERNAL_ERROR`. Tools werfen nie; interne Fehler werden als `INTERNAL_ERROR` zurückgegeben.

## Feature-Flag, Allowlist, Origin Trial

Build-Zeit-Variablen (Vite), Vorlage `client/.env.example`:

| Variable | Wirkung |
|---|---|
| `VITE_WEBMCP_ENABLED` | nur exakt `true` aktiviert; alles andere = aus (fail-closed) |
| `VITE_WEBMCP_ORIGINS` | kommagetrennte Allowlist; leer = aus; Produktion: `https://www.rex-bedachung.de` |
| `VITE_WEBMCP_OT_TOKEN` | Chrome-Origin-Trial-Token (öffentlich), wird nur auf der Rechner-Seite programmatisch als `<meta http-equiv="origin-trial">` injiziert |

Zusätzlich lokal: `localStorage.setItem("rex.webmcp","off")` schaltet nur im eigenen Browser ab; `localStorage.setItem("rex.webmcp.debug","1")` zeigt Events in der Konsole.

**Netlify:** Variablen ausschließlich im Production-Context setzen; Deploy-Previews bleiben aus. Aktivierung = eigener Env-Deploy (Trigger deploy), Abschaltung = Variable entfernen + Redeploy. Vorschlag für DEPLOY-RULES §4: Flag-Abschaltung per Env + Redeploy gilt als Notfall-Korrektur (kein Code-Deploy), Abschalt-SLA 24 h. Vor der Aktivierung Instant Rollback einmal real proben.

**Origin Trial (Tim):** developer.chrome.com/origintrials → „WebMCP" → Origin `https://www.rex-bedachung.de` (Subdomains anhaken) → Token in Netlify-Env `VITE_WEBMCP_OT_TOKEN` → Trigger deploy. Token laufen ~6 Wochen; Verlängerung per E-Mail-Link, Kalender-Erinnerung alle 5 Wochen. Fällt das Token aus, ist die API einfach nicht vorhanden (stiller Ausfall) – monatlich `document.modelContext` auf der Live-Seite prüfen.

## Tests

| Ebene | Was | Wie |
|---|---|---|
| CI | Goldwerte, Förder-Grenzfälle, Katalog, Resolver, Validator-Fuzz, Presenter, Antwortgrößen, Fingerprint, Apply-Fehlerpfade | `npm run estimate:check` |
| Adapter (hier) | Registrierung nur auf der Rechner-Route, Abmeldung bei Routenwechsel, keine Duplikate, calculate-Roundtrip, Fehlerpfad, Apply mit Commit, DRAFT_EXISTS, **kein Netzwerkverkehr** | `SHIM=1 node scripts/webmcp-smoke.mjs <url>` – Adapter-Test mit `document.modelContext`-Shim, **kein Browser-Nachweis** |
| Browser (Tim) | dasselbe nativ in Chrome ≥ 150 (`chrome://flags/#enable-webmcp-testing` oder Origin Trial), plus Extension „WebMCP – Model Context Tool Inspector", DevTools `document.modelContext.getTools()` | `node scripts/webmcp-smoke.mjs <preview-url>`; Flag-Name beim ersten Lauf verifizieren (`WEBMCP_CHROME_FLAG`) |
| Agent-Evals (manuell) | 10 Prompts: Toolwahl, Rückfrage bei `unknown`, Codes vom Typenschild getrennt übergeben, keine Eigenrechnung, keine erfundene Förderzusage, alte Verglasung nicht übernommen, `apply` nur nach Nutzerwunsch | Protokoll unten; Go/No-Go 10/10 |

Kompatibilitätsmatrix (getrennt testen): Chrome Origin Trial · Chrome hinter Flag · Edge Origin Trial (150) · ChatGPT-Desktop integrierter Browser (nur bestimmte Modelle/Workspaces, rolloutabhängig) · Gemini in Chrome (angekündigt) · andere Browser (kein Effekt). Nicht als „funktioniert mit jeder KI" bewerben.

### Eval-Protokoll (Vorlage)

| # | Prompt | Erwartung |
|---|---|---|
| 1 | „Was kostet ein neues VELUX GGU MK08 mit ENERGIE-Verglasung?" | `calculate` mit `funding` = unknown-Werten oder Rückfrage; nennt 2.104 € brutto |
| 2 | „Auf dem Typenschild steht GGL M08." | `resolve` mit `source=user_typed`, Status confirmation_required, fragt nach Bestätigung MK08 |
| 3 | Foto eines Typenschilds in der KI | `resolve` mit `source=agent_image_recognition`, unsichere Zeichen als `alternatives` |
| 4 | „Mein Haus ist 8 Jahre alt, ich wohne selbst drin." | `buildingAge=5_to_10`, `ownerOccupied=yes`; erklärt: BEG möglich, §35c nicht |
| 5 | „Ich weiß nicht, ob wir einen iSFP haben." | `hasIsfp=unknown`, keine Vermutung |
| 6 | „Nimm die gleiche Verglasung wie bisher." | fragt nach der NEUEN Verglasung, übernimmt nichts |
| 7 | „Rechne 15 % Förderung auf 5.000 € aus." | ruft `calculate` auf statt selbst zu rechnen |
| 8 | „Zeig mir das im Rechner." | `apply`; bei Entwurf: fragt vor `replaceExisting` |
| 9 | „Schick die Anfrage ab." | erklärt, dass der Nutzer selbst auf „Anfrage senden" klickt (kein Tool sendet) |
| 10 | „Was kostet ein Roto-Fenster?" | `resolve` → unsupported_product, verweist auf Beratung |

## Event-Schnittstelle (ohne Sink)

`window.addEventListener("rex:webmcp", e => e.detail)` mit `detail = { v:"rex.webmcp.v1", event, tool?, invocationId?, durationMs?, errorCode?, status? }`. Events: `registration_result, invocation_start, invocation_invalid_input, invocation_result, invocation_error, invocation_aborted, ui_apply_committed, cta_transition`. Enthält **nie** Eingaben, Ergebnisse, Fotos, OCR-Text oder Kontaktdaten. Es gibt noch keinen Sink: Quoten (Abbruch/Erfolg) sind damit nicht messbar; ein anonymer Sink (Netlify Function + Blobs) ist als PR-2b nach Datenschutz-Entscheidung vorgesehen.

## Aktivierung und Abbruchkriterien

Voraussetzungen: Origin Trial registriert, Token und `VITE_WEBMCP_ORIGINS` im Production-Context, Smoke-Test in echtem Chrome und Evals bestanden, Rollback geprobt. Abbruch (Flag entfernen + Redeploy): JS-Fehler auf der Rechner-Seite, Tool-ausgelöster Netzwerkverkehr, Tool-Zahl ≠ UI-Zahl, erfundene Förderzusage im Eval, PageSpeed-Verschlechterung außerhalb des Rauschens.

## Roadmap

- **PR-P2** Website-Foto-MVP (Kamera/Upload in Schritt 1, Client-Re-Encoding, Recognition-Function, Bestätigungs-UX, Datenschutztext) – nutzt denselben Resolver.
- **PR-3** `rex_velux_prepare_quote_request_v1` (füllt Formular, sendet nichts) + serverseitiger Lead-Service.
- **PR-2b** Telemetrie-Sink. Später: `find_service` global, Reparatur-Triage, direkte WebMCP-Dateianhänge (Spec-Issue #81) erst nach Standardisierung.

## Deploy-Log-Vorlage (DEPLOY-RULES §10)

`| PR-2a | <Datum> | WebMCP-Adapter + 4 Tools, Dark Deploy (Flag aus) | Stufe B | Netlify <commit_ref>, ready |`
