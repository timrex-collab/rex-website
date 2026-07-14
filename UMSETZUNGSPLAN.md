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
Letzter funktionaler Merge: **08.07.2026** → Gate aktuell frei.

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
  *Offen:* laufende Durchführung durch Tim (erster Lauf + Protokoll in `PRERENDER-CHECK.md` §6).

- [ ] **P1.2 — Externe NAP-Altlasten bereinigen** · 🌐 · Aufwand mittel · Wirkung mittel
  Veraltete Adressen in Aggregatoren (z. B. *Brenscheder Str. 19*, *Friederikastraße 12*) verwirren
  KI-Entity-Auflösung. → Korrektur/Löschung priorisiert bei in Google/Bing auffindbaren Quellen
  (stadtbranchenbuch, deutschbranchenbuch …), Abarbeitung über die Zielliste in `CITATIONS.md`.

- [ ] **P1.3 — Redaktions-Review-Routine für Förder-/Rechtsinfos** · 🔁 · Aufwand niedrig · Wirkung mittel
  Förder-/GEG-/Solarpflicht-Angaben veralten. → Quartalsweiser Fact-Check (`Foerderung`, `Solarpflicht`,
  `llms*.txt`) + sichtbares „Stand: MM/JJJJ" auf den betroffenen Seiten. Als wiederkehrender Punkt notieren.

### Priorität 2 — On-Site-Content (erlaubt, mittlerer Aufwand, je 1 Deploy im 48-h-Gate)

- [ ] **P2.1 — Begriff „Dachdeckerei Bochum" natürlich integrieren** · 🧑‍💻 Stufe A/B · Aufwand niedrig · Wirkung niedrig–mittel
  Aktuell nur 2× im Code. → Natürlich in Title/H2/FAQ auf `Home` + `Services` einweben. **Kein Keyword-Stuffing.**

- [ ] **P2.2 — Referenzen → echte Case-Studies** · 🧑‍💻 Stufe A/B · Aufwand mittel · Wirkung mittel–hoch
  `References.tsx` ist heute reine Galerie (0 strukturierte Fälle). → Pro Projekt: **Ort/Stadtteil ·
  Dachtyp · Problem · Lösung · Material · Zeitraum · Ergebnis**. Bringt lokale Tiefe (Wiemelhausen,
  Querenburg, Stiepel, Weitmar, Wattenscheid, Hattingen) **ohne** Doorway-Seiten. Deckt die
  „lokale Autorität"-Empfehlung des Audits regelkonform ab.

- [ ] **P2.3 — Zitierfähige Fach-FAQ mit Bochum-Bezug ausbauen** · 🧑‍💻 Stufe B · Aufwand mittel · Wirkung mittel
  Kurze, definitorische Q&A nach Rex-Standard v3.1 („Was ist Flachdachabdichtung?", „Wann lohnt sich
  eine Dachsanierung?", „Was tun bei Sturmschaden?") — LLM-/Snippet-freundlich, je mit lokalem Bezug.
  Gleichzeitig „Dachabdichtung"/„Flachdachsanierung" als eigene Abschnitte + interne Verlinkung
  (`Flachdach` ↔ `Bitumen/PVC` ↔ `Dachreparatur` ↔ `Gruendach`) stärken.

- [ ] **P2.4 — `areaServed`-Schema vereinheitlichen** *(optional/Hygiene)* · 🧑‍💻 Stufe B · Aufwand mittel · Wirkung niedrig–mittel
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

> Nächster Schritt: gemeinsam **einen** Startpunkt wählen — Empfehlung **P1.1** (Routine aufsetzen)
> und **P2.2** (Case-Studies) als erster sichtbarer Content-Deploy.
