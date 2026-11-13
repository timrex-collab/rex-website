# MCP-Endpunkt `/mcp` – Rex-Plugin für ChatGPT

Stand 14.11.2026. Live seit P4b Deploy 1 (#115, lesend, 11.11.2026) und Deploy 2 (#116, Anfrage
senden, 14.11.2026). Planung und Entscheidungen: `UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md`, Abschnitt
P4. Code: `netlify/functions/mcp.mts`, Anfrage-Inhalt `client/src/lib/velux/inquiry.ts`, Prüfungen
`scripts/mcp-check.ts` (CI-Schritt „MCP-Endpunkt (P4b)“).

Nicht zu verwechseln mit WebMCP (`WEBMCP.md`): WebMCP läuft im Browser auf der Rechnerseite, `/mcp`
ist ein Server-Endpunkt, den ChatGPT als Connector anspricht.

## Endpunkt

- **URL:** `https://www.rex-bedachung.de/mcp` (Streamable HTTP, zustandslos, JSON-Antworten), ohne
  Authentifizierung.
- **Freigeschaltet** nur für `www.rex-bedachung.de`, Deploy-Previews (`deploy-preview-<n>--leafy-sprite-bbbfd6.netlify.app`)
  und lokal; alle anderen Hosts (Branch-Aliase, Permalinks, Standardadresse) liefern 404.
- **Grenzen:** Anfragen über 64 KB → 413. Rate-Limit-Regel der Function: 60 Aufrufe pro 60 s je
  Absender-IP und Domain (gilt für den ganzen Pfad). Nach jedem Deploy in den Deploy-Daten prüfen,
  dass die Regel aktiv ist (`rate_limit`, `sliding_window`, 60/60).
- **SDK:** `@modelcontextprotocol/sdk` 1.32.1, `@netlify/blobs` 11.1.7, beide fest gepinnt.

## Tools

| Tool | Art | Wirkung |
|---|---|---|
| `rex_velux_get_options_v1` | lesend | Modelle, Größen, Verglasungen, Zubehör |
| `rex_velux_resolve_existing_window_v1` | lesend | Typenschild-Zuordnung; bei unsicherer Lesart `confirmation_required` |
| `rex_velux_calculate_estimate_v1` | lesend | Kostenschätzung mit BEG und §35c, `calculatorUrl` |
| `rex_velux_prepare_inquiry_v1` | lesend, speichert nichts | vollständige Zusammenfassung, `summaryId`, `submissionKey` |
| `rex_velux_submit_inquiry_v1` | schreibend | sendet genau die bestätigte Anfrage an Netlify Forms (`velux-preisrechner`) |

Alle Beträge kommen aus `client/src/lib/velux` (dieselbe Logik wie Rechner und WebMCP). Ein Foto
wird über das Plugin nicht übertragen (Variante A, Entscheidung Tim 11.11.2026).

## Ablauf einer Anfrage

1. `prepare` prüft die Eingaben (Name ≥ 2 Zeichen und E-Mail mit „@“ oder Telefon ≥ 6 Zeichen, wie im
   Rechner; Längengrenzen), rechnet auf dem Server neu und baut den Versandinhalt. Die Zusammenfassung
   zeigt Beträge, Kontaktdaten, Nachricht, Fensterzuordnung und „Das Foto aus diesem Chat wird nicht
   an Rex übertragen.“ `summaryId` = SHA-256 über Versandinhalt, Rechenversion und `submissionKey`.
2. `submit` verlangt `userConfirmed: true` und vergleicht den Hash; weicht Inhalt, Betrag oder
   Rechenversion ab → `SUMMARY_MISMATCH` (neu vorbereiten, neu zustimmen).
3. Reservierung des `submissionKey` mit `onlyIfNew` in Netlify Blobs, dann einer von 50 Tagesplätzen
   (Europe/Berlin), dann POST an Netlify Forms (10 s Zeitlimit).

| Ergebnis | Bedeutung |
|---|---|
| `SENT` | übermittelt (2xx/3xx) |
| `ALREADY_SENT` | dieselbe Anfrage wurde schon gesendet |
| `IN_PROGRESS` | wird gerade gesendet, nicht erneut senden |
| `OUTCOME_UNKNOWN` | 408, 5xx, Timeout oder Abbruch: kann angekommen sein, kein Neuversand |
| `SEND_FAILED` | eindeutige Ablehnung (4xx), neuer Versuch erlaubt |
| `DAILY_LIMIT` | 50 Anfragen am Tag erreicht |
| `STORE_UNAVAILABLE` | Speicher nicht erreichbar, nicht gesendet |
| `CONFIRMATION_MISSING`, `SUMMARY_MISMATCH`, `CONTACT_INVALID`, … | nicht gesendet |

**Was in der Anfrage steht:** `konfiguration` (gleiche Fassung wie im Rechner), `quelle` mit
„Aufmerksam geworden: KI-Assistent“, „Konfiguration: per ChatGPT-Plugin, auf dem Server neu
berechnet (Rechenversion …)“ und „Fensterzuordnung: bestätigt/vermutet/keine Angabe (Typenschild: …)“.
Kein Antworttext von ChatGPT.

## Speicher, Modi, Logs

- **Stores:** `rex-mcp-production` (nur Production-Kontext und Live-Domain) und `rex-mcp-preview`.
  Einträge: `idem/<submissionKey>` (Zustand, Zeitstempel) und `quota/<Datum>/<NN>` (Zeitstempel),
  keine Eingaben. Aufräumen bei jedem `prepare`/`submit`: Vermerke älter als 24 h, Plätze von
  Vortagen. Ohne Aufrufe bleiben sie bis zum nächsten Aufruf liegen (so in der Datenschutzerklärung).
- **Preview:** sendet echt, mit „TEST – Preview“ in `name` und `quelle`; Einträge danach löschen.
- **Lokal/CI:** Probelauf ohne Versand, Speicher im Arbeitsspeicher.
- **Logs:** nur Tool-Name, Ergebnis-Code, Dauer.

## Connector einrichten (Stand 13.11.2026)

- **ChatGPT Web:** Einstellungen → Plugins → Connector anlegen, URL wie oben, Authentifizierung
  „keine“. Nach einer Änderung der Tools: Plugins → Connector → „Tools aktualisieren“. Classic
  (Windows) und iPhone-App übernehmen den Connector aus dem Konto.
- **Codex Desktop:** Einstellungen → MCP Server → „Server hinzufügen“ (HTTP, URL wie oben).
- Ein mit dem „Plugin Creator“ angelegtes Plugin läuft nur in der Desktop-App, nicht im Web-Chat.
- Ohne Connector beantwortet ChatGPT Kostenfragen aus Seitentexten und Websuche und nennt dann
  abweichende Zahlen (Befund 13.11.2026).

## Abnahmen

| Datum | Was | Ergebnis |
|---|---|---|
| 03.–11.11.2026 | P4a auf Preview #112 (Web, Classic, iPhone) | Go; Fotoübergabe als Dateiobjekt erst mit Dateischema |
| 13.11.2026 | Deploy 1 live (Web) | Werte 2.104 € / 316 € / 421 €, Tool-Aufrufe im Netlify-Log |
| 13.11.2026 | Deploy 2 auf Preview #116 (Web, Classic, iPhone) | Versand nur nach Zustimmung, Ablehnen, Ändern, zweite Anfrage mit Rückfrage; Eintrag unter „Verified“, Mail im Postfach (V6) |

## Offen

- **P5:** Veröffentlichung (Erwähnung in `llms*.txt`, Kundenanleitung). V8: Unter welchen
  Bedingungen können Kunden einen eigenen Connector hinzufügen?
- `/.well-known/oauth-*` und `openid-configuration` unter `/mcp` liefern wegen des SPA-Fallbacks die
  Startseite mit 200 statt 404; ChatGPT kommt damit zurecht. Möglicher kleiner Deploy: Regel in
  `netlify.toml`.
- Erster Aufruf einer ChatGPT-Sitzung endet mit 400, danach 200; funktional ohne Wirkung, noch nicht
  untersucht.
