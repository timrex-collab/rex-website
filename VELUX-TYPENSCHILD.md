# VELUX-Typenschild: geprüfter Katalog und Resolver

Stand: 06.09.2026, Version 2026-09-06.1. Code: client/src/lib/velux/legacyCatalog.ts und resolve.ts. Prüfung: npm run estimate:check.

Der Resolver verarbeitet strukturierte Einzelwerte, keine Fotos oder OCR-Rohtexte. Bestandsfenster und neue Konfiguration sind getrennt. Alte Scheibenkennziffern bestimmen weder neue Verglasung noch Förderung. Produktionscodes werden nicht zurückgegeben.

## Quellen und Korrektur des früheren Seeds

Herstellerquelle: [VELUX Gesamtkatalog Juli 2026](https://www.velux.de/fachkunden/tools-technik/broschueren), Dokumentstand 03.09.2026, gedruckte Seiten 119–125. Ergänzend [Maßübersicht 7061](https://afd-marketing.velux.com/-/media/marketing/de/dokumente/pdf/produktanleitungen/produktinformationen/dachfenster/velux-uebersicht-fensterabmessungen.pdf), Seiten 2, 6, 10, 12–14. Der lokale Katalog ist bytegleich mit dem Herstellerdownload; Provenienz siehe VELUX-REVIEW-2026-09-06.md.

| Generation | Geprüfte Einträge | Verhalten |
|---|---|---|
| Ab 2013 | 19 aktuelle K-Codes | Nur eindeutige manuelle Angaben können resolved werden |
| 2000–2013 | 19 Buchstabencodes, z. B. M08 → MK08 | Stets bestätigen |
| 1991–2000 | 16 ausdrücklich belegte Zahlencodes | Stets bestätigen, Einbautiefe prüfen |
| Altes Austauschprogramm | 28 alte bzw. Y-Codes separat erkannt | Manuelle Prüfung, kein Standard-K-Äquivalent |

Die 16 Zahlencodes: 102, 104, 204, 206, 304, 306, 308, 310, 406, 408, 410, 606, 608, 610, 808, 810. Keine generierten 106, 208 oder 804. Die internen Generationsschlüssel 1991_2001/2001_2013 bleiben aus Vertragskompatibilität bestehen; sichtbare Jahresangaben folgen der Herstellerquelle.

**047/Y47 ist nicht MK08.** Altmaß 047: 74 × 143 cm; Y47 etwa 75 × 144 cm; MK08: 78 × 140 cm. Die frühere Zuordnung wurde entfernt. VU/VKU ENERGIE-AUSTAUSCH 0081 besitzt Uw 1,3. Der Produktname darf nicht die ENERGIE-Förderlogik neuer GGU/GGL/GPU/GPL auslösen.

Die 54 aktuellen bzw. vergleichbaren Größencodes sind anhand von Primärquellen verifiziert. Das bestätigt das Größenraster, keinen baulich passenden 1:1-Austausch. Alttypen, Ausstiegsfunktionen, Sondermaße und Innenfutter bleiben Fachprüfungen. Neue SSL/SML-K-Rollläden werden für das neue Fenster kalkuliert; keine Nachrüstzusage auf die Generation 102–810.

## Status und Bedienung

| Status | Bedeutung | Nächster Schritt |
|---|---|---|
| resolved | Kalkulierbar, eindeutig, manuelle Quelle | Neues Modell/Verglasung/Zubehör wählen |
| confirmation_required | Alt-Code, Bildquelle, Alternative oder Unsicherheitsgrund | Kunde bestätigt/korrigiert |
| new_photo_required | Bildquelle unvollständig/unlesbar | Besseres Foto oder manuelle Eingabe |
| manual_review | Sonderfall, Hersteller unklar, nicht kalkulierbar | Büro prüft Bestand und Funktion |
| unsupported_product | Fremdhersteller oder Zubehörschild | Richtiges Schild bzw. Beratung |

Bildquellen enden nie bei resolved. Ein Unsicherheitsgrund ohne Alternative genügt für eine Rückfrage. Herstelleralternativen werden berücksichtigt. Fehlender Hersteller wird ausdrücklich als VELUX-Annahme angezeigt; ein anderer eingegebener Hersteller wird nicht still geändert. Beobachtungen sind längenbegrenzt; unbekannte Schlüssel werden nicht im Fehlertext gespiegelt.

Der WebMCP-Resolver ist eingebaut. Foto-Upload und serverseitige Erkennung sind noch nicht implementiert. Sie müssen später denselben Resolver und dieselbe Bestätigungslogik verwenden; separate Freigabekriterien siehe VELUX-REVIEW-2026-09-06.md.
