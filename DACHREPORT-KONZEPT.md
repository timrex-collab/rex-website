# „Dachreport Bochum" — Konzept (zitierfähiger Datencontent)

**Zweck:** Ein jährlich aktualisierter, datengetriebener Report zum Thema Dach/
Sanierung/PV in Bochum & Ruhrgebiet — konzipiert als **Link- und Zitat-Magnet**:
Presse, Blogs und KI-/LLM-Systeme zitieren originäre Kennzahlen und verweisen
auf die Quelle. Er zahlt direkt auf Backlinks (Tier 3, `BACKLINKS.md`),
Entity-Autorität und GEO-Sichtbarkeit ein.

> **Content-Regeln** (DEPLOY-RULES Abschnitt 6): **keine** konkreten Preise,
> Terminologie „förderrelevant"/„BEG", „Autorisierter VELUX-Partner", kein
> „Notdienst". **Nur belegbare Daten mit Quelle + Datenstand** — keine
> erfundenen Zahlen. Neutral/faktenorientiert.

Status: 🔄 Konzept

---

## 1. Prinzip

- **Originär + lokal verankert:** Bochum-/Ruhrgebiet-Bezug, keine generischen Allgemeinplätze.
- **Zitierfähig:** 3–5 klare Kern-Kennzahlen als eigenständige Aussagesätze (LLM-/Presse-freundlich), jeweils mit Quelle.
- **Wiederkehrend:** Jahreszahl im Titel („Dachreport Bochum 2026"), feste URL, jährliches Update → wiederholte Zitier-/Link-Anlässe.

## 2. Datenachsen & mögliche Quellen (zu verifizieren)

| Achse | Kennzahl-Idee | Quelle (prüfen) |
|---|---|---|
| Gebäude-/Dachbestand | Anteil Wohngebäude nach Baualtersklassen (Sanierungsbedarf vor 1979 etc.) | Zensus 2022, Stadt Bochum Statistikstelle, IT.NRW |
| Sanierung & Förderung | BEG-/BAFA-/KfW-Förderfälle NRW, Entwicklung förderrelevanter Maßnahmen | BAFA-Statistik, KfW, dena |
| Solarpflicht & PV | PV-Zubau auf Dächern in Bochum, Wirkung § 42a BauO NRW | Marktstammdatenregister (Bundesnetzagentur), Solarkataster NRW |
| Wetter & Sturmschaden | Häufigkeit Sturm-/Starkregen-/Hagelereignisse Ruhrgebiet | DWD (Deutscher Wetterdienst), GDV-Naturgefahrenreport |
| Handwerkslage | Auftrags-/Konjunkturlage Dachdeckerhandwerk NRW, Wartezeiten | HWK Dortmund, ZDH/ZVDH-Konjunkturdaten |

> Für den Start reichen **2–3 gut belegte Achsen**. Lieber wenige saubere Zahlen als viele unsichere.

## 3. Seitenstruktur (wenn daraus eine Seite wird)

1. **H1** „Dachreport Bochum 2026" + Untertitel (Datenstand).
2. **Management-Summary:** 3–5 zitierfähige Kern-Kennzahlen als Bullet-Sätze.
3. **Je Datenachse:** kurzer Fließtext + eine Kennzahl/Visualisierung + **Quellenangabe**.
4. **Methodik & Datenstand:** welche Quellen, welcher Zeitraum, letzte Aktualisierung.
5. **Über den Herausgeber:** neutraler Verweis auf `/ueber-uns` (Rex Bedachungs GmbH, Bochum).
6. **Schema:** `Article` + ggf. `Dataset`; Bezug auf `#organization` per `@id`; BreadcrumbList (New-Page-Checklist, Abschnitt 7).

## 4. Zitierbarkeit (GEO/PR)

- Kennzahl-Sätze eigenständig formulieren: *„In Bochum stammen rund X % der Wohngebäude aus Baujahren vor 1979. (Quelle: …)"*
- Einheitlicher Zitierhinweis: *„Quelle: Rex Bedachungs GmbH – Dachreport Bochum 2026, https://www.rex-bedachung.de/…"*
- In `llms.txt`/`llms-full.txt` als Datenreferenz aufnehmen (eigener Deploy).

## 5. Verlinkungs-/Outreach-Hebel

- **Pressemitteilung** an Lokalpresse (WAZ Bochum, Ruhr Nachrichten, Lokalkompass) — Anlass = neue Zahlen (`BACKLINKS.md` Tier 3).
- **Interne Verlinkung** aus den Pillar-Pages (Dachsanierung, Solarpflicht, Förderung) auf den Report und zurück.
- Teilen mit **Innung/Partnern** (Tier 1/2) → thematische Backlinks.

## 6. Deploy-Pfad (falls Umsetzung als Seite)

- Neue Route = **Stufe-C-Deploy** (≤ 5 Dateien: Page-Component + Route in `App.tsx` + ggf. Sitemap/`llms.txt`). 48h-Gate beachten.
- Danach `npm run indexnow:submit`; Route in `sitemap.xml` mit `lastmod` aufnehmen.
- Rex-Standard-Technik (H-Struktur, Schema, Meta/OG) anwenden; da **Datencontent** (kein Service) ist die FAQ optional.

## 7. Phasen

1. ⬜ **Datensammlung** (extern/Tim): 2–3 Achsen, Quellen sichern, Datenstand notieren.
2. ⬜ **Draft** der Kennzahlen + Zitiersätze (hier oder als Seiten-Draft).
3. ⬜ **Umsetzung** als Seite (Stufe-C-Deploy).
4. ⬜ **Outreach** (Pressemitteilung + interne Verlinkung + Partner).

---

> Konzept-Doku (kein `dist/public`) — nicht deploy-/gate-relevant. Die spätere
> Seite ist ein eigener funktionaler Stufe-C-Deploy.
