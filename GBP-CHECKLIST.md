# Google Business Profile — Optimierungs-Checkliste

**Zweck:** Umsetzbare Checkliste zur vollständigen Optimierung des Google
Business Profile (GBP) der Rex Bedachungs GmbH. GBP ist der Tier-1-Citation mit
dem größten lokalen Such-/Map-Hebel (`CITATIONS.md`).

> **NAP exakt wie in `CITATIONS.md` / `DEPLOY-RULES.md` Abschnitt 1.**
> Terminologie verbindlich (DEPLOY-RULES Abschnitt 6): „Autorisierter
> VELUX-Partner" (nie „zertifiziert"/„Fachbetrieb"), „förderrelevant"/„BEG"
> (nie „förderfähig"), **kein** „Notdienst", **keine** konkreten Preise.

Status: ⬜ offen · 🔄 in Arbeit · ✅ erledigt

---

## 1. Inhaberschaft & Basis

| Punkt | Status | Notiz |
|---|---|---|
| Profil beanspruchen / Zugriff bestätigen | ⬜ | Verifizierung (Postkarte/Telefon/Video) |
| Firmenname exakt | ⬜ | `Rex Bedachungs GmbH` — **keine** Keyword-Zusätze (Google-Richtlinie) |
| Adresse | ⬜ | Paulinenstraße 22, 44799 Bochum |
| Telefon | ⬜ | 0234 583100 |
| Website | ⬜ | https://www.rex-bedachung.de (mit UTM, s. Abschnitt 7) |
| Öffnungszeiten | ⬜ | Mo–Fr 07:00–17:00; Sa/So geschlossen; Feiertage pflegen |
| Pin-Position auf Karte | ⬜ | Mit Schema-Geo abgleichen (51.46262 / 7.24442) |

## 2. Kategorien

| Punkt | Status | Notiz |
|---|---|---|
| Primärkategorie | ⬜ | **Dachdecker** |
| Sekundärkategorien (verfügbare prüfen) | ⬜ | Bauklempnerei/Klempner, Bauunternehmen, Dämmunternehmen, Solaranlagen-Anbieter (für Dach-PV) — nur real zutreffende |

## 3. Leistungen (Services)

Aus dem OfferCatalog der Website ableiten — jeweils mit kurzer Beschreibung:

| Leistung | Status |
|---|---|
| Steildach | ⬜ |
| Flachdach | ⬜ |
| Dachsanierung | ⬜ |
| Dachreparatur | ⬜ |
| Dachwartung | ⬜ |
| Dachfenster (Autorisierter VELUX-Partner) | ⬜ |
| Bauklempnerei (Dachrinnen, Fassade) | ⬜ |
| Aufsparrendämmung / Wärmedämmung | ⬜ |
| Gründach | ⬜ |
| Dachgaube | ⬜ |
| Dach-Photovoltaik | ⬜ |

## 4. Einzugsgebiet & Attribute

| Punkt | Status | Notiz |
|---|---|---|
| Einzugsgebiet | ⬜ | Bochum + Ruhrgebiet (~30 km, deckt sich mit Schema `geoRadius`) |
| Attribute | ⬜ | Inhabergeführt, Termin erforderlich, Vor-Ort-Service, ggf. barrierefrei |
| Eröffnungsjahr | ⬜ | 1984 |

## 5. Beschreibung (750 Zeichen, copy-paste)

⬜ Eintragen:

```
Rex Bedachungs GmbH ist Ihr Dachdecker-Meisterbetrieb in Bochum – seit 1984.
Wir decken das gesamte Dachhandwerk ab: Steildach, Flachdach, Dachsanierung,
Dachreparatur und Dachwartung, Bauklempnerei (Dachrinnen, Fassade) sowie
Dämmung. Dachfenster setzen wir als autorisierter VELUX-Partner. Auch Gründach,
Dachgaube und Dach-Photovoltaik gehören zu unserem Leistungsspektrum. Als
Meisterbetrieb beraten wir zu förderrelevanten Sanierungen (BEG) und begleiten
Ihr Projekt von der Planung bis zur Abnahme. Tätig in Bochum und im gesamten
Ruhrgebiet. Jetzt Kontakt aufnehmen für ein unverbindliches Angebot.
```

## 6. Fotos & Medien

| Punkt | Status | Notiz |
|---|---|---|
| Logo | ⬜ | `logo-rex-bedachungs-gmbh-bochum-2025.webp` |
| Titelbild | ⬜ | Steildach-Hero o. Referenz |
| Außenansicht / Standort | ⬜ | Wiedererkennung Paulinenstraße 22 |
| Team / Geschäftsführer | ⬜ | Tim Rex (Dachdeckermeister) |
| Projektfotos | ⬜ | Steildach, Flachdach, VELUX, Bauklempnerei, PV — regelmäßig ergänzen |

## 7. Website-Link mit UTM (Tracking)

⬜ Website-Feld mit UTM versehen, um GBP-Traffic in Analytics zu trennen:

```
https://www.rex-bedachung.de/?utm_source=google&utm_medium=organic&utm_campaign=gbp
```

## 8. Posts, Q&A, Bewertungen

| Punkt | Status | Notiz |
|---|---|---|
| Posts regelmäßig | ⬜ | Saisonale Themen: Sturmschaden (Herbst/Winter), Förderung/BEG, VELUX-Aktion, Solarpflicht |
| Q&A vorbereiten | ⬜ | Eigene FAQ als Frage+Antwort seeden (Einzugsgebiet, Förderung, VELUX) |
| Bewertungs-Flow | ⬜ | Kunden um Google-Bewertung bitten; Kurz-Link erstellen; alle Bewertungen beantworten |
| Messaging / WhatsApp | ⬜ | wa.me/49234583126 |

## 9. Konsistenz-Check

| Punkt | Status | Notiz |
|---|---|---|
| NAP identisch zu Website/Schema/Impressum | ⬜ | Abgleich mit `DEPLOY-RULES.md` Abschnitt 1 |
| GBP als `sameAs` ins Schema? | ⬜ | Optional: GBP-/Maps-URL ist bereits in `OrganizationSchema.tsx` `sameAs` (Maps-Place) |

---

> Reine Repo-Doku (kein `dist/public`) — nicht deploy-/gate-relevant. Umsetzung
> erfolgt extern im GBP-Dashboard durch Tim; Status hier abhaken.
