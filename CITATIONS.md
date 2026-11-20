# Citation-Building & NAP-Konsistenz — Rex Bedachungs GmbH

**Zweck:** Getrackte Checkliste für Off-Site-Citations (lokale Branchen- und
Verzeichniseinträge). Ziel: NAP-Konsistenz über alle externen Quellen für
maximale lokale Suchsignale (Google/Bing) und KI-Sichtbarkeit.

> Canonical-Stammdaten: siehe `DEPLOY-RULES.md` Abschnitt 1. **Bei jedem
> Eintrag exakt den NAP-Block unten verwenden** — identischer Wortlaut ist der
> ganze Punkt von Citation-Building.

---

## NAP-Block (copy-paste, verbindlich)

```
Rex Bedachungs GmbH
Paulinenstraße 22
44799 Bochum
Tel: 0234 583100   (international: +49 234 583100)
Fax: 0234 583137
E-Mail: info@rex-bedachung.de
Web: https://www.rex-bedachung.de
Öffnungszeiten: Mo–Fr 07:00–17:00 Uhr
Kategorie: Dachdecker / Dachdeckerei (Meisterbetrieb seit 1984)
WhatsApp: https://wa.me/49234583126
Facebook: https://www.facebook.com/rexbedachung
Instagram: https://www.instagram.com/rexbedachung
```

**On-Site-NAP-Audit (29.06.2026): ✅ konsistent** über alle Seiten, Schemas,
`llms.txt`/`llms-full.txt`, Footer, Impressum. Faxnummer bestätigt aktuell und
in die Stammdaten aufgenommen.

---

## Citation-Ziele (priorisiert)

Legende Status: ⬜ offen · 🔄 in Arbeit · ✅ erledigt (eingetragen + NAP geprüft)

### Tier 1 — höchste Wirkung (zuerst)

| Ziel | Status | Notiz |
|---|---|---|
| Google Business Profile | ✅ | Profil vorhanden. Name am 12.11.2026 auf „Rex Bedachungs GmbH“ korrigiert (vorher mit Zusatz „- Dachdecker Bochum“, unzulässig nach Google-Richtlinie). Primärkategorie Dachdecker. Ist zugleich Datenquelle für Bing Places (Sync) → Beschreibung ≤ 500 Zeichen halten. Details: `GBP-CHECKLIST.md` |
| Bing Places for Business | ✅ | **Veröffentlicht** (geprüft 20.11.2026), mit dem Google-Profil synchronisiert: Daten nur noch dort pflegen, Auto-Sync laut Support-Empfehlung monatlich. Name, Adresse, Telefon, Website, Öffnungszeiten und Fotos geprüft. Vorgeschichte: Der Google-Sync hatte am 12.11. neben dem Bing-eigenen Eintrag ein Duplikat erzeugt; Lösung über den Bing-Support (Ticket bei Tim): beide Einträge aus dem Konto entfernt, am 13.11. neu aus Google importiert. **Offen:** Kategorie zeigt „Hausservice, Installation von Dachfenstern“ (+1) — „Dachdecker“ als Hauptkategorie prüfen; Beschreibung auf Vollständigkeit prüfen. |
| Apple Business Connect | ⬜ | Apple Maps / Siri |
| Das Örtliche | ⬜ | DE-Standardverzeichnis, hohe Autorität |
| Gelbe Seiten | ⬜ | DE-Standardverzeichnis |
| 11880.com | ⬜ | |
| meinestadt.de | ⬜ | Lokaler Bezug Bochum |

### Tier 2 — Branche / Handwerk (thematische Autorität)

| Ziel | Status | Notiz |
|---|---|---|
| Dachdecker-Innung Bochum / ZVDH | 🔄 | Eintrag existiert (Schema `sameAs`, Slug `rex-bedachungen-gmbh`) → **claimen & NAP prüfen** |
| HWK Dortmund — Handwerksverzeichnis | ⬜ | |
| VELUX Partner-/Händlerverzeichnis | ⬜ | „Autorisierter VELUX-Partner" — auch auf Roadmap |
| wlw (Wer liefert was) | ⬜ | B2B |
| Houzz | ⬜ | Bau/Renovierung, Referenzfotos |

### Tier 3 — regional / aggregiert (Vollständigkeit, NAP prüfen)

| Ziel | Status | Notiz |
|---|---|---|
| Cylex | ⬜ | Oft auto-generiert → NAP prüfen |
| GoYellow | ⬜ | |
| Branchenbuch-Deutschland | ⬜ | |
| firmenwissen / Northdata | ⬜ | Auto-generiert aus Handelsregister → NAP/Geschäftsführer prüfen |
| Stadt Bochum / Ruhrgebiet-Verzeichnisse | ⬜ | |
| ProvenExpert | ✅ | Profil vorhanden (4,48★, 13 Bewertungen), als Citation zählend |

---

## Vorgehen

1. Tier 1 → 2 → 3 abarbeiten.
2. Pro Eintrag **exakt** den NAP-Block oben einsetzen (Wortlaut, Reihenfolge, Formatierung).
3. Wo möglich WhatsApp-Link + Social-Profile ergänzen.
4. Bei auto-generierten Einträgen (Tier 3): bestehende Daten auf NAP-Drift prüfen und korrigieren/claimen.
5. Status hier abhaken (⬜ → 🔄 → ✅) und ggf. Eintrags-URL in der Notiz vermerken.

> Dieses Dokument ist reine Repo-Doku (kein `dist/public`) — nicht
> deploy-/gate-relevant. Updates laufen als sauberer PR, Merge durch Tim.
