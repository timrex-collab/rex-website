# Umsetzungsplan — Externes SEO/GEO-Audit (Juli 2026)

**Zweck:** Das externe Read-only-Audit (SEO / Local-SEO / GEO) gegen den *tatsächlichen*
Projektstand abgleichen und daraus einen priorisierten, umsetzbaren Backlog machen.

> **Wichtigste Erkenntnis:** Das Audit ist fachlich stark, wurde aber **ohne Kenntnis von
> `DEPLOY-RULES.md` und den bestehenden Governance-Dokumenten** erstellt. Ein großer Teil
> der Empfehlungen ist deshalb **bereits umgesetzt** oder **bewusst ausgeschlossen**. Dieser
> Plan filtert die Empfehlungen auf das, was *neu, erlaubt und wirkungsvoll* ist.

**Governance gilt unverändert** (`DEPLOY-RULES.md`): 48-h-Gate zwischen funktionalen Deploys ·
ein atomarer Commit pro Deploy · Stufen A (Text/CSS ≤12) / B (Schema/Content ≤8) / C (Routen/
gesperrte Configs ≤5) · `attached_assets/` nie committen · Merge nur durch Tim.

> ## Stand 18.08.2026 — dieser Plan ist zu 4/5 abgearbeitet
>
> **Erledigt und live:** P2.1 (PR #28) · P2.2 (PR #25) · P2.3 (PR #25/#26) · P2.4 (PR #31–#33).
> P1.1 ist zur Hälfte erledigt — die Routine steht und Stufe 1 lief zweimal (11.08./18.08.),
> Stufe 2 im Browser steht aus.
>
> **Noch offen aus diesem Plan:** P1.2 NAP-Altlasten 🌐 ·
> P1.3 Förder-Quartalsreview 🔁 · P3.1 Dachreport Bochum.
>
> **Der aktive Deploy-Backlog steht seit dem 11.08.2026 in [`GSC-AUDIT-2026-08.md`](./GSC-AUDIT-2026-08.md) §6** —
> er ist datengestützt (Search-Console-Exporte) und hat vier offene Pakete. Dieses Dokument
> bleibt als Herkunftsnachweis des Juli-Audits bestehen; neue Arbeit wird dort priorisiert.
>
> Letzter funktionaler Merge: **PR #40 am 18.08.2026 10:11 UTC** → nächstes Fenster
> ab **20.08.2026 ~10:11 UTC**.

**Legende:** 🧑‍💻 = Claude im Repo · 🌐 = Tim extern (außerhalb Repo) · 🔁 = Prozess/Routine ·
Aufwand/Wirkung jeweils niedrig/mittel/hoch.

---

## Teil A — Kein Handlungsbedarf (Audit-Empfehlung bereits erledigt oder bewusst ausgeschlossen)

Damit wir nichts doppelt machen. Diese Audit-Punkte sind abgehakt oder per Regelwerk raus:

### Bereits umgesetzt
| Audit-Empfehlung | Status im Repo |
|---|---|
| Person-/Autoren-Schema (Tim/Peter) | ✅ `AuthorSchema.tsx`, auf 20+ Ratgeber-/Service-Seiten eingebunden |
| `llms-full.txt` kuratieren | ✅ live (CC3), Uw-/Terminologie-Altlast per CC-Fix bereinigt |
| Externe NAP-Audit-/Zielliste | ✅ `CITATIONS.md` (On-Site-NAP verifiziert konsistent) |
| Google-Business-Profile-Optimierung | ✅ `GBP-CHECKLIST.md` |
| Backlink-Strategie (VELUX/HWK/Innung/Presse) | ✅ `BACKLINKS.md` |
| Wikidata-Entity | ✅ `WIKIDATA.md` (wartet auf QID → dann `sameAs`-Nachtrag) |
| Service-Schema / `provider`-`@id` zentralisieren | ✅ Schema-Hygiene B1+B2, 10 Seiten (live 01.–03.07.) |
| Impressum/Datenschutz Meta-Descriptions | ✅ (PR #19/#20) |
| „Notdienst" entschärfen | ✅ per CC-Fix aus Schema/`llms` entfernt |
| Dachwartung für Hausverwaltungen | ✅ bereits als Schwerpunkt auf `DachwartungBochum.tsx` |
| IndexNow + Sitemap-`lastmod`-Refresh | ✅ live |

### Bewusst ausgeschlossen (`DEPLOY-RULES.md` §6 — nicht vorschlagen)
- **Stadtteil-Landingpages** („Dachdecker Bochum Wiemelhausen/Stiepel/Querenburg" als eigene Seiten)
- **Separate Kosten-Seiten** („Dachrinne erneuern Kosten …")
- **Gewerbe-/B2B-Seite** als eigene Landingpage (Hausverwaltung → nur als Abschnitt/FAQ, nicht als Seite)
- **AggregateRating on-site** · **Notdienst-Seite** · **SearchAction-Schema** · **eigener Prerender/SSR**

> Die Audit-Ideen „eigene Stadtteil-/Einzugsgebiet-Seiten" fallen in genau diese ausgeschlossene
> Kategorie. Lokale Tiefe entsteht bei uns über **echte Referenzen + Abschnitte in bestehenden
> Seiten**, nicht über Doorway-Seiten (siehe P2.2).

---

## Teil B — Priorisierter Backlog (das ist die eigentliche Arbeit)

### Priorität 1 — Schutz & Hygiene (geringer Aufwand, schützt Bestehendes)

- [x] **P1.1 — Prerender-Health-Check als feste Routine** · 🔁🌐 · Aufwand niedrig · Wirkung hoch
  Größtes Audit-Risiko: Fällt die Netlify Prerender Extension aus, sehen Crawler/KI nur die SPA-Shell.
  → **Checkliste geliefert: [`PRERENDER-CHECK.md`](./PRERENDER-CHECK.md)** — 6 Kern-URLs, objektive
  Pass/Fail-Kriterien (Fallback-Shell hat *kein* JSON-LD/Meta/H1), 4 Browser-Methoden, Soll-Titles,
  Eskalation. Kadenz: monatlich + einmal nach jedem funktionalen Deploy.
  *Stand 24.08.2026: vollständig erledigt.* Stufe 1 lief am 11.08., 18.08. und 22.08.,
  **Stufe 2 am 24.08.2026 — bestanden**: alle sechs Kern-URLs liefern gerendertes HTML an
  Googlebot, alle Soll-Titles exakt. Protokoll in `PRERENDER-CHECK.md` §8. Die Routine läuft
  ab jetzt per `npm run prerender:check` nach jedem funktionalen Deploy.

- [ ] **P1.2 — Externe NAP-Altlasten bereinigen** · 🌐 · Aufwand mittel · Wirkung mittel
  Veraltete Adressen in Aggregatoren (z. B. *Brenscheder Str. 19*, *Friederikastraße 12*) verwirren
  KI-Entity-Auflösung. → Korrektur/Löschung priorisiert bei in Google/Bing auffindbaren Quellen
  (stadtbranchenbuch, deutschbranchenbuch …), Abarbeitung über die Zielliste in `CITATIONS.md`.

- [ ] **P1.3 — Redaktions-Review-Routine für Förder-/Rechtsinfos** · 🔁 · Aufwand niedrig · Wirkung mittel
  Förder-/GEG-/Solarpflicht-Angaben veralten. → Quartalsweiser Fact-Check (`Foerderung`, `Solarpflicht`,
  `llms*.txt`) + sichtbares „Stand: MM/JJJJ" auf den betroffenen Seiten. Als wiederkehrender Punkt notieren.

### Priorität 2 — On-Site-Content (erlaubt, mittlerer Aufwand, je 1 Deploy im 48-h-Gate)

- [x] **P2.1 — Begriff „Dachdeckerei Bochum" natürlich integrieren** · 🧑‍💻 Stufe A/B · Aufwand niedrig · Wirkung niedrig–mittel ✅ live (PR #28, 20.07.2026)
  Aktuell nur 2× im Code. → Natürlich in Title/H2/FAQ auf `Home` + `Services` einweben. **Kein Keyword-Stuffing.**

- [x] **P2.2 — Referenzen → echte Case-Studies** · 🧑‍💻 Stufe A/B · Aufwand mittel · Wirkung mittel–hoch ✅ live (PR #25, 14.07.2026)
  `References.tsx` ist heute reine Galerie (0 strukturierte Fälle). → Pro Projekt: **Ort/Stadtteil ·
  Dachtyp · Problem · Lösung · Material · Zeitraum · Ergebnis**. Bringt lokale Tiefe (Wiemelhausen,
  Querenburg, Stiepel, Weitmar, Wattenscheid, Hattingen) **ohne** Doorway-Seiten. Deckt die
  „lokale Autorität"-Empfehlung des Audits regelkonform ab.

- [x] **P2.3 — Zitierfähige Fach-FAQ mit Bochum-Bezug ausbauen** · 🧑‍💻 Stufe B · Aufwand mittel · Wirkung mittel ✅ live (PR #25/#26, 14.–16.07.2026)
  Kurze, definitorische Q&A nach Rex-Standard v3.1 („Was ist Flachdachabdichtung?", „Wann lohnt sich
  eine Dachsanierung?", „Was tun bei Sturmschaden?") — LLM-/Snippet-freundlich, je mit lokalem Bezug.
  Gleichzeitig „Dachabdichtung"/„Flachdachsanierung" als eigene Abschnitte + interne Verlinkung
  (`Flachdach` ↔ `Bitumen/PVC` ↔ `Dachreparatur` ↔ `Gruendach`) stärken.

- [x] **P2.4 — `areaServed`-Schema vereinheitlichen** *(optional/Hygiene)* · 🧑‍💻 Stufe B · Aufwand mittel · Wirkung niedrig–mittel ✅ live (PR #31–#33, 23.–28.07.2026)
  Heute Mischung aus `City`-Objekt und String-Array über die Seiten. → Einheitliches Modell (analog
  B1/B2-Disziplin). **Achtung Churn:** betrifft ~20 Seiten → in Batches ≤8 Dateien/Deploy. Nur wenn
  P2.1–P2.3 abgearbeitet sind; rein kosmetischer GEO-Gewinn.

### Priorität 3 — Strategischer Hebel (größte Wirkung, mehrstufig)

- [ ] **P3.1 — „Dachreport Bochum" bauen** · 🧑‍💻 + 🌐 · Aufwand hoch · Wirkung hoch
  Konzept liegt vor (`DACHREPORT-KONZEPT.md`, Status 🔄). Zitierfähiger Datencontent als Link-/GEO-Magnet.
  → Schritt 1: 2–3 Datenachsen mit belegbaren Quellen recherchieren (Zensus/IT.NRW, BAFA, DWD/GDV).
  Schritt 2: Seite nach Konzept-Struktur bauen (Stufe C, neue Route). **Nur belegbare Zahlen mit Quelle.**

- [ ] **P3.2 — Bewusst zurückgestellt lassen** · —
  KI-Sichtbarkeits-Monitoring (ChatGPT/Perplexity/Gemini/Claude) und YouTube-GEO-Kanal bleiben laut
  Roadmap zurückgestellt — nicht ohne expliziten Beschluss starten.

---

## Empfohlene Reihenfolge

1. **P1.1** (Prerender-Check-Routine) — schützt sofort das Fundament, kein Deploy nötig.
2. **P2.1** (Dachdeckerei) *oder* **P2.2** (Case-Studies) als erster funktionaler Deploy.
3. Danach je 48 h ein weiterer P2-Punkt.
4. **P3.1** (Dachreport) als eigenes, größeres Vorhaben parallel vorbereiten (Datenrecherche 🌐).
5. **P2.4** nur als abschließende Hygiene, wenn Kapazität bleibt.

> **Diese Reihenfolge ist abgearbeitet** (Schritte 1–3 und 5 erledigt, Stand 18.08.2026).
> Nächster Schritt steht nicht mehr hier, sondern in `GSC-AUDIT-2026-08.md` §6.
> *Stand 26.08.2026:* Auch dessen Backlog ist bis auf einen Punkt abgearbeitet — Paket 4a
> (20.08.), Paket 5 (22.08.), GSC-Meta-2 (24.08.) und Paket 6 (26.08., PR #58) sind live,
> der Prerender-Check Stufe 2 ist am 24.08. bestanden. Offen ist nur noch **GSC-Meta-3**
> (PR #56, Merge-Fenster ab 28.08. ~14:46 UTC) und danach die Schema-/Terminologie-Hygiene
> aus `GSC-AUDIT-2026-08.md` §8.
>
> Das ursprünglich erstplatzierte Paket 4 (`/dachreinigung-bochum`) ist am 18.08.2026
> **gestrichen**: Dachflächenreinigung und Algenentfernung gehören nicht zum
> Leistungsumfang. Die verbindliche Leistungsabgrenzung steht jetzt in `DEPLOY-RULES.md` §6.
