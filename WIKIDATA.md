# Wikidata-Entity — Rex Bedachungs GmbH

**Zweck:** Anlage eines Wikidata-Items für die Rex Bedachungs GmbH als
Entity-SEO-/GEO-Baustein: Wikidata speist Googles Knowledge Graph und wird von
KI-/LLM-Systemen als strukturierte Entitätsquelle genutzt. Ziel ist ein
eindeutig referenzierbarer Entitäts-Knoten, der mit dem `#organization`-Schema
der Website verknüpft ist.

> **Notability-Hinweis:** Wikidata verlangt, dass eine Entität mit *ernsthaften,
> öffentlich verfügbaren Quellen* beschreibbar ist. Für einen lokalen Betrieb
> ist das über Handelsregister (HRB 2478, AG Bochum), OpenCorporates und den
> Innungs-Eintrag gegeben — **aber** ein Eintrag ohne belastbare Quellen kann
> zur Löschung vorgeschlagen werden. Daher: **jedes wichtige Statement mit
> Referenz** anlegen (unten vorgesehen).

> **Nur verifizierbare Fakten, neutral (NPOV).** Keine Marketing-Formulierungen,
> keine Preise. NAP exakt wie `DEPLOY-RULES.md` Abschnitt 1 / `CITATIONS.md`.

Status: ⬜ offen · 🔄 in Arbeit · ✅ erledigt

> **Stand 17.11.2026: Item angelegt – [Q138609267](https://www.wikidata.org/wiki/Q138609267)**
> (von Tim, Konto mit Offenlegung des Geschäftsführer-Bezugs auf der Benutzerseite).
> `sameAs` auf der Website folgt mit S5a. Offene Nacharbeiten am Item: Abschnitt 4.

---

## 1. Label / Beschreibung / Aliasse

| Feld | Wert |
|---|---|
| Label (de) | Rex Bedachungs GmbH |
| Label (en) | Rex Bedachungs GmbH |
| Beschreibung (de) | Dachdeckerbetrieb in Bochum |
| Beschreibung (en) | roofing company in Bochum, Germany (Wikidata-Konvention: klein beginnen) |
| Aliasse (de, en) | Rex Bedachung |

> Keine Suchbegriffe als Alias (z. B. „Dachdecker Bochum“, „Dachdecker Rex Bochum“) und keine
> Leistungsschwerpunkte in der Beschreibung: beides wird auf Wikidata als Werbung gewertet und
> erhöht das Löschrisiko.

## 2. Statements (Aussagen)

> **QIDs/PIDs vor dem Eintrag auf wikidata.org gegenprüfen** — Wikidata-IDs
> können abweichen. Die Property-Namen sind maßgeblich.

| Property | Wert | Referenz |
|---|---|---|
| instance of (P31) | business enterprise (≈Q4830453) | offizielle Website |
| legal form (P1454) | Gesellschaft mit beschränkter Haftung (per Bezeichnung auswählen; die frühere Angabe ≈Q327333 war geschätzt und nicht belegt) | Impressum, Innung |
| country (P17) | Deutschland (Q183) | — |
| headquarters location (P159) | Bochum (Q2103) | offizielle Website / Impressum |
| street address (P6375) | Paulinenstraße 22, 44799 Bochum (de; ausgeschrieben wie Impressum und Schema) | Impressum |
| official name (P1448) | Rex Bedachungs GmbH (de) | Impressum |
| coordinate location (P625) | 51.46262, 7.24442 | offizielle Website |
| inception (P571) | 1984 | `/ueber-uns` (das Impressum nennt das Jahr nicht) |
| industry (P452) | Dachdeckerei / Baugewerbe (QID prüfen) | offizielle Website |
| official website (P856) | https://www.rex-bedachung.de | (selbst) |
| e-mail address (P968) | info@rex-bedachung.de | Impressum |
| phone number (P1329) | +49 234 583100 | Impressum |
| EU VAT number (P3608) | DE124085752 | Impressum |
| OpenCorporates ID (P1320) | *falls vorhanden* — Eintrag der Rex Bedachungs GmbH | OpenCorporates |
| Facebook ID (P2013) | rexbedachung | offizielle Website / Profil |
| Instagram username (P2003) | rexbedachung | offizielle Website / Profil |

### Optional (nur mit Sorgfalt)

| Property | Wert | Hinweis |
|---|---|---|
| founded by (P112) | Peter Rex | Braucht Personen-Item; **kein** Meistertitel bei Peter Rex |
| chief executive officer (P169) | Tim Rex (Dachdeckermeister) | Braucht Personen-Item; qualifier „start time" ergänzen |

> Personen-Statements (P112/P169) nur setzen, wenn die Personen als eigenes
> Item angelegt werden — für einen KMU-Eintrag meist verzichtbar. Wenn
> ausgelassen, geht keine SEO-Wirkung verloren.

### Handelsregister

HRB 2478, Amtsgericht Bochum. Es gibt keine breit etablierte dedizierte
Wikidata-Property für die deutsche HRB-Nummer. Empfehlung: **OpenCorporates ID
(P1320)** verwenden (verweist indirekt auf die Registerdaten). Alternativ als
Referenz-Detail belassen.

## 3. Referenzen (an Statements anhängen)

- **Offizielle Website** (`stated in` / `reference URL` → https://www.rex-bedachung.de bzw. `/impressum`, `/ueber-uns`).
- **OpenCorporates** (Registerdaten), falls Eintrag vorhanden.
- **Dachdecker-Innung Bochum** (Firmeneintrag).

## 4. Umsetzungsschritte

1. ✅ Wikidata-Account angelegt, Geschäftsführer-Bezug auf der Benutzerseite offengelegt (Wikimedia verlangt das bei Bearbeitungen im eigenen geschäftlichen Interesse).
2. ✅ Kein bestehendes Item gefunden.
3. ✅ Item angelegt, Labels/Beschreibungen/Alias de und en (Stand nach Korrektur 17.11.2026).
4. ✅ Statements: ist ein(e) Unternehmen, Staat, Koordinaten, Rechtsform, Hauptverwaltung, Adresse, Telefon, offizielle Website, Facebook, Instagram, Gründung 1984, offizieller Name.
5. 🔄 Referenzen: an den meisten Statements vorhanden (Impressum, Innung, `/ueber-uns`).
6. ✅ **QID = Q138609267** (17.11.2026), beobachtet.

**Offene Nacharbeiten (Hinweise an Tim, 17.11.2026; Wikidata ist aus der Claude-Umgebung nicht erreichbar, geprüft anhand von Screenshots):**
- ⬜ Adresse auf „Paulinenstraße 22, 44799 Bochum“ (statt „Paulinenstr.“).
- ⬜ Gründung: Fundstelle Impressum entfernen, `/ueber-uns` behalten.
- ⬜ Fahnen-Hinweise: offizielle Website (vermutlich Qualifikator „Sprache des Werkes oder Namens“ = Deutsch), offizieller Name (vermutlich Fundstelle fehlt → Impressum).
- ⬜ Branche (P452) ergänzen.
- ⬜ optional: Postleitzahl, USt-IdNr., E-Mail; englische Beschreibung kleinschreiben.

## 5. Rückkopplung in die Website (Loop schließen)

Nach Vergabe der QID — als **separater funktionaler Stufe-B-Deploy** (nicht Teil
dieser Doku, 48h-Gate beachten):

- 🔄 QID-URL `https://www.wikidata.org/wiki/Q138609267` in `OrganizationSchema.tsx` im `sameAs`-Array: mit Paket S5a (PR #121, Merge frühestens 22.11.2026).
- ⬜ Optional in `llms.txt`/`llms-full.txt` als weitere Entitätsreferenz aufnehmen.

Damit ist die Website ↔ Wikidata-Entität bidirektional verknüpft (starkes
Entity-Signal für Knowledge Graph & LLMs).

---

> Diese Datei ist reine Repo-Doku (kein `dist/public`) — nicht deploy-/gate-
> relevant. Die Wikidata-Anlage erfolgt extern durch Tim; der Website-seitige
> `sameAs`-Nachtrag (Abschnitt 5) ist ein eigener funktionaler Deploy.
