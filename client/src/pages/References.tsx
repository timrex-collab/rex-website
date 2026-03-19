import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import OrganizationSchema from "@/components/OrganizationSchema";
import Hero from "@/components/Hero";
import { Link } from "wouter";

const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const heroImageFallback = "/images/tondach-hero-dachdeckung-bochum.jpg";

const projects = [
  {
    src: "/images/velux-dachfenster-3er-kombination-steildach-bochum.webp",
    alt: "VELUX Dachfenster 3er-Kombination auf anthrazitem Steildach – Rex Bedachungs GmbH Bochum",
    title: "VELUX 3er-Kombination",
    location: "Bochum",
    year: "2024",
    category: "velux",
    tag: "VELUX",
    description:
      "VELUX 3er-Kombination auf Steildach mit anthrazitem Flachziegel. Zwei GGL-Fenster nebeneinander in der oberen Reihe, ein breiteres GGL-Fenster darunter – optimale Belichtung des Dachgeschosses auf zwei Ebenen. Fachgerechter Einbau durch Rex Bedachungs GmbH Bochum, zertifizierter VELUX-Partner.",
  },
  {
    src: "/images/velux-dachfenster-doppelanlage-einbau-tonziegel-bochum.webp",
    alt: "VELUX Lichtlösung DUO Einbau auf Tonziegel-Steildach – Rex Bedachungs GmbH Bochum",
    title: "VELUX Lichtlösung DUO",
    location: "Bochum",
    year: "2024",
    category: "velux",
    tag: "VELUX",
    description:
      "VELUX Lichtlösung DUO frisch eingebaut auf grauem Tonziegel-Steildach. Linkes Fenster geöffnet – der sichtbare Holzrahmen und die präzise Abdichtung zeigen handwerkliche Qualität. Warmes Abendlicht, Bochum 2024. Einbau durch Rex Bedachungs GmbH, zertifizierter VELUX-Partner.",
  },
  {
    src: "/images/velux-dachfenster-einbau-bochum-typ1.webp",
    alt: "VELUX Dachfenster Einbau Bochum – Fachbetrieb Rex",
    title: "Velux Dachfenster Sanierung",
    location: "Bochum",
    year: "2025",
    category: "velux",
    tag: "VELUX",
    description:
      "Lichtlösung Raum. Mehr Raumgewinn und Kopffreiheit durch Kombi-Aufkeilrahmen. Mit Solar-Rollläden für Hitzeschutz und Verdunkelung.",
  },
  {
    src: "/images/tondach-dachziegel-bochum-typ4.webp",
    alt: "Neubaugebiet mit Steildächern und Tondachziegeln – Hattingen",
    title: "Neubaugebiet Hattingen",
    location: "Hattingen",
    year: "2022",
    category: "steildach",
    tag: "Steildach",
    description:
      "Steil- und Zeltdächer mit Tondachziegeln und hochwertigen Zinkblechen.",
  },
  {
    src: "/images/tondach-dachziegel-bochum-typ6.webp",
    alt: "Steildach Tondachziegel Typ 6 – Neubaugebiet Hattingen",
    title: "Neubaugebiet Hattingen",
    location: "Hattingen",
    year: "2022",
    category: "steildach",
    tag: "Steildach",
    description:
      "Steil- und Zeltdächer mit Tondachziegeln und hochwertigen Zinkblechen. Professionelle Ausführung durch Rex Bedachungs GmbH.",
  },
  {
    src: "/images/tondach-dachziegel-bochum-typ7.webp",
    alt: "Steildach Tondachziegel Typ 7 – Neubaugebiet Hattingen",
    title: "Neubaugebiet Hattingen",
    location: "Hattingen",
    year: "2022",
    category: "steildach",
    tag: "Steildach",
    description:
      "Steil- und Zeltdächer mit Tondachziegeln und hochwertigen Zinkblechen. Qualitätsdachdeckung für Neubaugebiete im Ruhrgebiet.",
  },
  {
    src: "/images/flachdach-sanierung-bochum-rex-bedachung.webp",
    alt: "Flachdach Sanierung Bochum – Rex Bedachungs GmbH",
    title: "Dachentwässerung Hattingen",
    location: "Hattingen",
    year: "2022",
    category: "bauklempnerei",
    tag: "Bauklempnerei",
    description:
      "Fachgerechte Dachentwässerung im Neubaugebiet Hattingen. Hochwertige Zinkbleche und zuverlässige Entwässerungssysteme.",
  },
  {
    src: "/images/gruendach-intensive-begruenung-bochum.webp",
    alt: "Gründach intensive Begrünung Bochum – Rex Bedachungs GmbH",
    title: "Einfamilienhaus Bochum Weitmar",
    location: "Bochum",
    year: "2021",
    category: "gruendach",
    tag: "Gründach",
    description:
      "Gründach mit extensiver Dachbegrünung. Aufbau einer neuen Wärmedämmung für bessere Energieeffizienz.",
  },
  {
    src: "/images/gruendach-bochum-dachbegruenung-experten.webp",
    alt: "Gründach Bochum Dachbegrünung Experten – Rex Bedachungs GmbH",
    title: "Einfamilienhaus Bochum Weitmar",
    location: "Bochum",
    year: "2021",
    category: "gruendach",
    tag: "Gründach",
    description:
      "Gründach mit extensiver Dachbegrünung durch Rex Bedachungs GmbH Bochum. Fachgerechte Wärmedämmung und Begrünung für nachhaltigen Wetterschutz.",
  },
  {
    src: "/images/gruendach-extensive-begruenung-bochum.webp",
    alt: "Gründach extensive Begrünung Bochum – Rex Bedachungs GmbH",
    title: "Gründach mit Photovoltaik",
    location: "Bochum",
    year: "2020",
    category: "gruendach",
    tag: "Gründach",
    description:
      "Gründach mit extensiver Dachbegrünung und Photovoltaikmodulen.",
  },
  {
    src: "/images/tondach-dachziegel-bochum-typ2.webp",
    alt: "Tondach Dachziegel Bochum – Steildach Qualität Rex Bedachung",
    title: "Wohnhaus Bochum-Stiepel",
    location: "Bochum",
    year: "2020",
    category: "steildach",
    tag: "Steildach",
    description:
      "Komplettsanierung mit Erstellung von zwei großen Dachgauben. Hochwertige Tondachziegel für dauerhaften Wetterschutz.",
  },
  {
    src: "/images/tondach-dachziegel-bochum-typ1.webp",
    alt: "Tondach Dachziegel Bochum Typ 1 – Rex Bedachungs GmbH",
    title: "Wohnhaus Bochum-Stiepel",
    location: "Bochum",
    year: "2020",
    category: "steildach",
    tag: "Steildach",
    description:
      "Komplettsanierung Steildach mit hochwertigen Tondachziegeln und Dachgauben. Rex Bedachungs GmbH Bochum.",
  },
  {
    src: "/images/tondach-ziegel-bochum-steildach-3.webp",
    alt: "Tondach Dachziegel Bochum – Steildach Qualität Rex Bedachung",
    title: "Einfamilienhaus Bochum Querenburg",
    location: "Bochum",
    year: "2019",
    category: "steildach",
    tag: "Steildach",
    description:
      "Steildach mit hochwertigen Tondachziegeln. Professionelle Ausführung für langlebigen Wetterschutz.",
  },
];

const heights = [192, 144, 176, 208, 192, 144, 176, 192, 144];

export default function References() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isOpen = lightboxIndex !== null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (dir: number) =>
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + dir + projects.length) % projects.length
    );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, lightboxIndex]);

  const currentProject = lightboxIndex !== null ? projects[lightboxIndex] : null;

  return (
    <>
      <Helmet>
        <title>Referenzen – Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Referenzprojekte von Rex Bedachungs GmbH Bochum – Steildach, Flachdach, Gründach und Bauklempnerei im Ruhrgebiet. Überzeugen Sie sich selbst." />
        <link rel="canonical" href="https://www.rex-bedachung.de/referenzen" />
        <meta property="og:title" content="Referenzen - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Überzeugen Sie sich von unserer Arbeit. Referenzprojekte aus Bochum und Umgebung." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},{"@type":"ListItem","position":2,"name":"Referenzen","item":"https://www.rex-bedachung.de/referenzen"}]}`}</script>
      </Helmet>
      <OrganizationSchema />

      <Hero
        title="Referenzen"
        subtitle="Unsere Projekte sprechen für sich"
        description="Überzeugen Sie sich von der Qualität unserer Arbeit. Hier finden Sie eine Auswahl erfolgreich abgeschlossener Projekte im Ruhrgebiet."
        imageUrl={heroImage}
        imageFallbackUrl={heroImageFallback}
        imageAlt="Erfolgreich abgeschlossene Dachprojekte"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <style>{`
              .masonry-grid { column-count: 1; column-gap: 0.75rem; }
              @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
              @media (min-width: 768px) { .masonry-grid { column-count: 3; } }
            `}</style>
            <div className="masonry-grid">
              {projects.map((project, index) => {
                const h = heights[index % heights.length];
                return (
                  <div
                    key={index}
                    className="masonry-item relative overflow-hidden rounded-md cursor-pointer mb-3 group"
                    style={{ breakInside: "avoid" }}
                    onClick={() => openLightbox(index)}
                    data-testid={`card-project-${index}`}
                  >
                    <img
                      src={project.src}
                      alt={project.alt}
                      loading="lazy"
                      width={600}
                      height={h}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ height: `${h}px` }}
                    />
                    <div
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                    >
                      <div className="absolute top-2 right-2">
                        <ZoomIn size={16} className="text-white" />
                      </div>
                      <p className="font-semibold text-sm text-white leading-tight">{project.title}</p>
                      <p className="text-xs text-white/70 mt-0.5">{project.location} · {project.year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ihr Projekt ist das nächste</h2>
          <p className="text-muted-foreground mb-8 text-base md:text-lg">
            Kontaktieren Sie uns für ein kostenloses Beratungsgespräch. Wir freuen uns auf Ihr Projekt.
          </p>
          <div className="relative inline-flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-md bg-primary opacity-30 animate-ping" />
            <Link
              href="/kontakt"
              className="relative inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold px-8 py-3 text-base hover:bg-primary/90 transition-colors"
              data-testid="link-cta-kontakt"
            >
              Jetzt Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      {isOpen && currentProject && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={closeLightbox}
          data-testid="lightbox-overlay"
        >
          <button
            className="absolute top-3 right-3 text-white/80 hover:text-white cursor-pointer bg-transparent border-0 p-1"
            onClick={closeLightbox}
            data-testid="button-lightbox-close"
            aria-label="Schließen"
          >
            <X size={22} />
          </button>

          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentProject.src}
              alt={currentProject.alt}
              className="w-full max-h-[60vh] object-contain rounded-md"
              data-testid="img-lightbox-main"
            />

            <div className="flex flex-wrap justify-between items-start mt-3 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base">{currentProject.title}</p>
                <p className="text-white/60 text-sm mt-1">{currentProject.location} · {currentProject.year}</p>
                <p className="text-white/70 text-sm mt-2 max-w-xl leading-relaxed">{currentProject.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="border border-white/25 rounded-md px-4 py-2 text-white text-lg hover:bg-white/15 transition-colors cursor-pointer bg-transparent"
                  onClick={() => navigateLightbox(-1)}
                  data-testid="button-lightbox-prev"
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="border border-white/25 rounded-md px-4 py-2 text-white text-lg hover:bg-white/15 transition-colors cursor-pointer bg-transparent"
                  onClick={() => navigateLightbox(1)}
                  data-testid="button-lightbox-next"
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {projects.map((p, i) => (
                <img
                  key={i}
                  src={p.src}
                  alt={p.alt}
                  className={`w-14 h-10 rounded object-cover cursor-pointer transition-opacity duration-200 ${
                    i === lightboxIndex
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  onClick={() => setLightboxIndex(i)}
                  data-testid={`thumbnail-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
