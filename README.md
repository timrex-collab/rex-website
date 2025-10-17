# Rex Bedachungs GmbH - Website

Willkommen beim Website-Projekt für Rex Bedachungs GmbH. Diese moderne, responsive Website präsentiert die Leistungen des Dachdeckerbetriebs im Ruhrgebiet.

## 🚀 Projekt starten

### Entwicklungsserver starten

```bash
npm run dev
```

Die Website ist dann unter `http://localhost:5000` erreichbar.

### Produktionsbuild erstellen

```bash
npm run build
```

Die statischen Dateien werden im Ordner `dist/` erstellt.

### Build lokal testen

```bash
npm run preview
```

## 📝 Inhalte ändern

### Texte bearbeiten

Alle Seiteninhalte befinden sich in den Dateien unter `client/src/pages/`:

- **Startseite**: `Home.tsx`
- **Leistungen**: `Services.tsx` (Übersicht) und einzelne Seiten wie `Steildach.tsx`, `Flachdach.tsx`, etc.
- **Referenzen**: `References.tsx`
- **Über uns**: `About.tsx`
- **Karriere**: `Careers.tsx`
- **Kontakt**: `Contact.tsx`
- **Impressum**: `Impressum.tsx`
- **Datenschutz**: `Datenschutz.tsx`

**Beispiel**: Um den Titel auf der Startseite zu ändern, öffnen Sie `client/src/pages/Home.tsx` und suchen Sie nach:

```tsx
title="Ihr Dach in Meisterhand"
```

Ändern Sie den Text zwischen den Anführungszeichen.

### Bilder ersetzen

Die Bilder befinden sich unter `attached_assets/generated_images/`. Um ein Bild zu ersetzen:

1. Platzieren Sie Ihr neues Bild im gleichen Ordner
2. Öffnen Sie die entsprechende Seite (z.B. `Home.tsx`)
3. Ändern Sie den Import:

```tsx
// Alt:
import heroImage from "@assets/generated_images/Modern_roofing_hero_image_4713fc6f.png";

// Neu (Beispiel):
import heroImage from "@assets/generated_images/ihr_neues_bild.jpg";
```

### Kontaktdaten aktualisieren

Die Kontaktdaten sind an mehreren Stellen verwendet:

1. **Footer** (`client/src/components/Footer.tsx`)
2. **Navigation** (`client/src/components/Navigation.tsx`)
3. **Kontaktseite** (`client/src/pages/Contact.tsx`)
4. **Impressum** (`client/src/pages/Impressum.tsx`)

Suchen Sie nach den aktuellen Werten (z.B. `0234-583100`) und ersetzen Sie diese.

### SEO-Einstellungen anpassen

Jede Seite hat eigene Meta-Tags. Diese finden Sie im `<Helmet>`-Bereich am Anfang jeder Seite:

```tsx
<Helmet>
  <title>Ihr Titel - Rex Bedachungs GmbH</title>
  <meta name="description" content="Ihre Beschreibung hier" />
</Helmet>
```

## 🌐 Deployment (Website online stellen)

Die Website kann als statische Seite auf verschiedenen Plattformen gehostet werden:

### Cloudflare Pages

1. Erstellen Sie ein Cloudflare Pages Projekt
2. Verbinden Sie Ihr Git-Repository oder laden Sie den `dist` Ordner hoch
3. Build-Befehl: `npm run build`
4. Ausgabeverzeichnis: `dist`

### Netlify

1. Erstellen Sie ein Netlify Projekt
2. Verbinden Sie Ihr Git-Repository
3. Build-Befehl: `npm run build`
4. Ausgabeverzeichnis: `dist`

### Vercel

1. Erstellen Sie ein Vercel Projekt
2. Verbinden Sie Ihr Git-Repository
3. Framework: Vite
4. Build-Befehl: `npm run build`
5. Ausgabeverzeichnis: `dist`

### Manueller Upload

1. Führen Sie `npm run build` aus
2. Laden Sie den kompletten Inhalt des `dist/` Ordners auf Ihren Webserver hoch
3. Stellen Sie sicher, dass Ihr Webserver für Single-Page-Applications konfiguriert ist

## 📋 Projektstruktur

```
rex-bedachung/
├── client/                    # Frontend-Anwendung
│   ├── src/
│   │   ├── components/       # Wiederverwendbare Komponenten
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ReferenceCard.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── pages/            # Seitenkomponenten
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Steildach.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── ...
│   │   └── App.tsx           # Hauptkomponente mit Routing
│   └── index.html            # HTML-Einstiegspunkt
├── public/                   # Statische Dateien
│   ├── robots.txt
│   └── sitemap.xml
├── attached_assets/          # Bilder und Assets
│   └── generated_images/
└── README.md                 # Diese Datei
```

## 🛠️ Technologie-Stack

- **Framework**: React mit TypeScript
- **Build-Tool**: Vite
- **Styling**: Tailwind CSS
- **UI-Komponenten**: Shadcn/ui
- **Routing**: Wouter
- **Icons**: Lucide React

## 📞 Support

Bei Fragen zum Projekt wenden Sie sich an Ihren Webentwickler oder konsultieren Sie die Dokumentation der verwendeten Technologien.

## 📄 Lizenz

© 2025 Rex Bedachungs GmbH. Alle Rechte vorbehalten.
