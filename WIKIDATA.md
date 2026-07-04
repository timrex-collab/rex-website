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

---

## 1. Label / Beschreibung / Aliasse

| Feld | Wert |
|---|---|
| Label (de) | Rex Bedachungs GmbH |
| Label (en) | Rex Bedachungs GmbH |
| Beschreibung (de) | Dachdeckerunternehmen in Bochum, Deutschland |
| Beschreibung (en) | roofing company in Bochum, Germany |
| Aliasse (de) | Rex Bedachung; Dachdecker Rex Bochum |

## 2. Statements (Aussagen)

> **QIDs/PIDs vor dem Eintrag auf wikidata.org gegenprüfen** — Wikidata-IDs
> können abweichen. Die Property-Namen sind maßgeblich.

| Property | Wert | Referenz |
|---|---|---|
| instance of (P31) | business enterprise (≈Q4830453) | offizielle Website |
| legal form (P1454) | GmbH – Gesellschaft mit beschränkter Haftung (≈Q327333) | Handelsregister |
| country (P17) | Deutschland (Q183) | — |
| headquarters location (P159) | Bochum (Q2103) | offizielle Website / Impressum |
| coordinate location (P625) | 51.46262, 7.24442 | offizielle Website |
| inception (P571) | 1984 | offizielle Website (About) |
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

1. ⬜ Wikidata-Account anlegen/anmelden (wikidata.org).
2. ⬜ Prüfen, ob bereits ein Item existiert (Suche „Rex Bedachungs GmbH") → **kein Duplikat** anlegen.
3. ⬜ „Neues Item erstellen": Label/Beschreibung/Aliasse (Abschnitt 1).
4. ⬜ Statements (Abschnitt 2) hinzufügen, **PIDs/QIDs verifizieren**.
5. ⬜ An die wichtigen Statements Referenzen hängen (Abschnitt 3).
6. ⬜ QID notieren (z. B. `Q…`) und hier vermerken: **QID = ______**

## 5. Rückkopplung in die Website (Loop schließen)

Nach Vergabe der QID — als **separater funktionaler Stufe-B-Deploy** (nicht Teil
dieser Doku, 48h-Gate beachten):

- ⬜ QID-URL (`https://www.wikidata.org/wiki/Q…`) in `OrganizationSchema.tsx` im `sameAs`-Array ergänzen.
- ⬜ Optional in `llms.txt`/`llms-full.txt` als weitere Entitätsreferenz aufnehmen.

Damit ist die Website ↔ Wikidata-Entität bidirektional verknüpft (starkes
Entity-Signal für Knowledge Graph & LLMs).

---

> Diese Datei ist reine Repo-Doku (kein `dist/public`) — nicht deploy-/gate-
> relevant. Die Wikidata-Anlage erfolgt extern durch Tim; der Website-seitige
> `sameAs`-Nachtrag (Abschnitt 5) ist ein eigener funktionaler Deploy.
