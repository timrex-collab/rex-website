# Umsetzungsplan 09/2026: Förderung vor WebMCP-Aktivierung

Stand 04.10.2026. **R1–R4 und D8 sind live.** D8 schaltet WebMCP im Production-Kontext ohne
Chrome-Token ein (PR #87). Grundlagen:
- das Förderaudit vom 17.09.2026 (Befunde F01–F09) und das WebMCP-/Förder-Audit vom 21.09.2026,
  beide nur lokal bei Tim, hier nach ihren Zusammenfassungen eingearbeitet;
- eine Codeprüfung aller Förderaussagen;
- eine Web-Recherche zum Rechtsstand am 23.09.2026.

Deploy-Nachweise: `DEPLOY-RULES.md` §10.

## 1. Ergebnis

1. Die zentrale Förderlogik in `client/src/lib/velux` war fachlich korrekt und ist unverändert geblieben.
   Die Beträge im Rechner stimmten schon vorher (Goldwert 2.104 € brutto).
2. Falsch oder widersprüchlich waren fest eingetragene Texte auf 13 Seiten, in `llms*.txt`, im
   Anfrage- und mailto-Text sowie in einzelnen Rechner-Labels. Sie sind in R1–R4 korrigiert.
3. Seit R4 prüft `npm run foerder:check` in der CI jede Änderung gegen die belegten
   Falschformulierungen. Jede Regel hat einen Treffer-Fall im Selbsttest.
4. Vor WebMCP kam die Förderung zuerst, aus zwei Gründen. Erstens hatten falsche Förderaussagen auf
   stark besuchten Seiten (`/solarpflicht`) Vorrang vor einem Feature ohne messbaren Nutzen.
   Zweitens hätte ein KI-Agent Nutzer sonst auf Seiten geschickt, deren Text dem Tool widerspricht.

## 2. Rechtsstand 23.09.2026 gegen den Code

| Punkt | Stand | `funding.ts` |
|---|---|---|
| BEG EM Gebäudehülle 15 % | Richtlinie vom 17.08.2026 (BAnz AT 27.08.2026 B1), rückwirkend ab 21.07.2026 | ✅ |
| iSFP +5 % nur auf den Anteil über der Höchstgrenze ohne iSFP (EFH: 30.000 €) | BMWE-FAQ A.3.2 | ✅ |
| Deckel 30.000 / 60.000 €, max. 10.500 € für die erste Wohneinheit | BMWE-FAQ 2.3; ab der 2. WE niedrigere Staffel | ✅ (Rechner begrenzt auf 1. WE) |
| Gebäude ≥ 5 Jahre, Antrag vor Vorhabenbeginn, Vertrag mit Förderbedingung, EEE-Pflicht | BAFA | ✅ als Annahmen |
| Dachflächenfenster Uw ≤ 1,0 | BEG-TMA, ESanMV Anl. 4 (nur Sekundärquellen belegt) | ✅ |
| WPB-Bonus ab Q1 2027 | nur Dämmung, nicht Fenster | keine Anpassung |
| §35c 7/7/6 %, max. 40.000 €, älter als 10 Jahre, Selbstnutzung | unverändert, Abschluss vor 01.01.2030 | ✅ |
| GModG statt GEG | BGBl. 2026 I Nr. 226, überwiegend seit 29.07.2026 | Seiten angepasst |
| Haushalt 2027 (BEG) | Regierungsentwurf, nicht beschlossen | Wiedervorlage Dezember |

Die Volltexte der amtlichen Seiten waren über den Proxy gesperrt. Belegt ist alles über
Index-Auszüge der Primärquellen.

## 3. Umsetzung

| Release | PR | Inhalt | Live |
|---|---|---|---|
| R1 | #81 | Falschaussagen auf 8 Seiten (u. a. §35c kombinierbar, Vertrag/Antrag-Reihenfolge, Rechnerbeschreibung, Baujahr, Tilgungszuschuss, KfW-BEG) | 23.09.2026 |
| R2 | #82 | Richtlinie 17.08.2026, Stand-Angaben, `llms*.txt`, FAQ, Altfall 7.600 €, GModG | 25.09.2026 |
| R3 | #83 | Anfrage- und mailto-Text, Rechner-Labels zentral, WebMCP-Scope, Vorwarnung `validThrough` | 27.09.2026 |
| R4 | #84 | `foerder:check` in der CI, fünf weitere Reste, `dev:web`/`preview` | 30.09.2026 |

Entscheidungen von Tim (23.09.2026):
- **§35c-Linie:** ganz neutral.
- **Fallstudie 7.600 €:** echter Altfall, wird gekennzeichnet.
- **„Geprüft“ im ExpertenBlock:** immer der aktuelle Monat, F09 entfällt als Codepaket.
- **D8:** Tim prüft das Origin-Trial-Dashboard selbst.

## 4. Offen

- **D8:** Live-Nachprüfung am 04.10.2026 in ChatGPT Desktop (GPT-5.6 Sol) bestanden, Details in
  `WEBMCP.md`. Fall 4 mit echtem Typenschildfoto steht noch aus.
- **Chrome-Origin-Trial, optional:** Token-Ablauf 17.11.2026, Verlängerung bis M162 beantragt. Ein
  Token kommt nur bei Bedarf und als eigener Deploy dazu.
- **Förder-Wiedervorlage vor dem 31.12.2026:** Richtlinie, Haushalt 2027 und §35c an den
  Primärquellen prüfen und erst danach `lastReviewedAt`/`validThrough` in `funding.ts`
  verschieben. `estimate:check` meldet ab dem 16.11.2026 im Wochenlauf einen Hinweis.
- **Geprüft am 04.10.2026, Korrektur vorbereitet:** Der Satz auf `DachPhotovoltaikBochum`, das
  PV-Pflichtmaß der NRW-Solardachpflicht werde nicht zusätzlich bezuschusst, war zu pauschal.
  Die Pflicht selbst (§ 42a BauO NRW, SAN-VO) enthält kein Förderverbot; Ausschlüsse stehen in
  den einzelnen Richtlinien (NRW-Modernisierungsförderung Nr. 4.4.5.1: nur oberhalb des
  gesetzlichen Maßes; progres.nrw Nr. 4.4; kommunal z. B. Solares Bonn Nr. 3.3.2). EEG-Vergütung
  und KfW 270 sind nicht grundsätzlich ausgeschlossen. Förderabsatz und FAQ präzisiert, live seit
  PR #90 (06.10.2026).
- **Rechtliche Einordnung** des Datenschutzhinweises aus `VELUX-EXPORT-GATE.md` §3.5: geprüft
  04.10.2026 (KI-gestützt), umgesetzt mit PR #91, live seit 08.10.2026. Offen nur die
  Aufbewahrungsdauer der Netlify-Server-Logs.
