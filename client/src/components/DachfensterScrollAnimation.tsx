import { useEffect, useRef, useState, useCallback } from "react";

const IMAGES = [
  "/images/velux-dachfenster-bochum-geschlossen.webp",
  "/images/velux-dachfenster-bochum-halboffen.webp",
  "/images/velux-dachfenster-bochum-geoeffnet.webp",
];

const STAGES = [
  {
    statLabel: "Mehr Tageslicht",
    statSub: "bis zu 3× mehr als Wandfenster",
    headline: "Mehr Licht. Mehr Luft. Mehr Wohnqualität.",
    text: "Ein modernes Dachfenster bringt bis zu dreimal mehr Tageslicht in den Raum als ein gleich großes Wandfenster – der Unterschied ist vom ersten Tag an spürbar.",
    tagTitle: "Geschlossen",
    tagBody: "Selbst im geschlossenen Zustand sorgen moderne Dachfenster durch Glasfläche, Einbauposition und klare Verglasung für spürbar mehr Tageslicht.",
  },
  {
    statLabel: "Bessere Lüftung",
    statSub: "Kamineffekt, Regensensor, Solar-Antrieb",
    headline: "Frische Luft – manuell, elektrisch oder per Solar.",
    text: "Elektrische VELUX-Modelle lassen sich per Schalter, App oder Automatik steuern und schließen bei Regen über den Regensensor selbstständig. Der Kamineffekt sorgt für natürliche Querlüftung ohne Zugluft.",
    tagTitle: "Halb geöffnet",
    tagBody: "Bereits bei 30° Öffnungswinkel entsteht ein spürbarer natürlicher Luftaustausch.",
  },
  {
    statLabel: "Förderung möglich",
    statSub: "BEG Einzelmaßnahme bei Uw ≤ 1,0 W/m²K",
    headline: "Förderfähigkeit prüfen lassen.",
    text: "Bei modernen VELUX-Modellen mit Uw ≤ 1,0 W/m²K ist eine BAFA-Förderung über die BEG Einzelmaßnahme möglich. Rex Bedachungs GmbH prüft die technischen Voraussetzungen und unterstützt bei Antrag und Einbindung des Energieeffizienz-Experten.",
    tagTitle: "Vollständig geöffnet",
    tagBody: "Voraussetzung: Antrag und EEE-Einbindung erfolgen vor der Umsetzung.",
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function getImageOpacities(progress: number): [number, number, number] {
  const t = 0.08;
  const o0 = progress < 0.34 ? 1 : clamp(1 - (progress - 0.34) / t, 0, 1);
  const fadeIn1 = clamp((progress - 0.28) / t, 0, 1);
  const fadeOut1 = progress > 0.72 ? clamp(1 - (progress - 0.72) / t, 0, 1) : 1;
  const o1 = Math.min(fadeIn1, fadeOut1);
  const o2 = clamp((progress - 0.66) / t, 0, 1);
  return [o0, o1, o2];
}

export default function DachfensterScrollAnimation() {
  const moduleRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function syncMobile() { setIsMobile(mqMobile.matches); }
    function syncMotion() { setPrefersReducedMotion(mqMotion.matches); }
    syncMobile();
    syncMotion();
    mqMobile.addEventListener("change", syncMobile);
    mqMotion.addEventListener("change", syncMotion);
    return () => {
      mqMobile.removeEventListener("change", syncMobile);
      mqMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  const useStaticLayout = prefersReducedMotion || isMobile;

  const update = useCallback(() => {
    if (!moduleRef.current) return;
    const rect = moduleRef.current.getBoundingClientRect();
    const maxScroll = rect.height - window.innerHeight;
    const raw = maxScroll > 0 ? (rect.top * -1) / maxScroll : 1;
    const p = clamp(raw, 0, 1);
    setProgress(p);
    setStage(p < 0.34 ? 0 : p < 0.72 ? 1 : 2);
  }, []);

  useEffect(() => {
    if (useStaticLayout) {
      setStage(2);
      setProgress(1);
      return;
    }
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [update, useStaticLayout]);

  const eased = 1 - Math.pow(1 - progress, 3);
  const current = STAGES[stage];
  const imgOpacities = getImageOpacities(progress);

  return (
    <section
      ref={moduleRef}
      className="relative border-t border-border bg-muted/30"
      style={{
        minHeight: useStaticLayout ? "auto" : "280vh",
        paddingBottom: useStaticLayout ? 0 : "20vh",
      }}
      aria-labelledby="scroll-anim-heading"
      data-testid="section-scroll-animation"
    >
      <div
        className="overflow-hidden"
        style={{
          position: useStaticLayout ? "relative" : "sticky",
          top: 0,
          minHeight: useStaticLayout ? "auto" : "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── Copy-Spalte ── */}
          <div className="relative z-10 order-2 md:order-1">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">
              Dachfenster Bochum
            </p>
            <h2
              id="scroll-anim-heading"
              className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-foreground mb-5"
              style={{ transition: "opacity 0.25s ease" }}
            >
              {current.headline}
            </h2>
            <p
              className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg"
              style={{ transition: "opacity 0.25s ease" }}
            >
              {current.text}
            </p>

            {/* Stage-Karten */}
            <div className="grid grid-cols-3 gap-3">
              {STAGES.map((s, i) => (
                <div
                  key={i}
                  className="rounded-md p-4 border"
                  style={{
                    background: i === stage ? "hsl(var(--card))" : "transparent",
                    borderColor:
                      i === stage
                        ? "hsl(var(--primary) / 0.4)"
                        : "hsl(var(--border))",
                    boxShadow: i === stage ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                    transform: i === stage ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                  }}
                  data-testid={`anim-stat-${i}`}
                >
                  <span className="block text-xs font-bold text-foreground mb-1">
                    {s.statLabel}
                  </span>
                  <span className="block text-xs text-muted-foreground leading-snug">
                    {s.statSub}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA zum VELUX-Preisrechner */}
            <div className="mt-6 pt-6 border-t border-border">
              <a
                href="/velux-preisrechner-bochum"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
                data-testid="anim-cta-preisrechner"
              >
                Preise selbst kalkulieren — zum VELUX-Preisrechner
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* ── Bild-Spalte ── */}
          <div className="relative order-1 md:order-2">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                aspectRatio: "3 / 2",
                border: "6px solid hsl(var(--card))",
                transform: `perspective(1000px) rotateY(-4deg) translateY(${(
                  -6 +
                  eased * 14
                ).toFixed(1)}px)`,
                transition: "transform 0.08s linear",
              }}
            >
              {IMAGES.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: imgOpacities[i],
                    transition: "opacity 0.35s ease",
                    zIndex: i + 1,
                  }}
                  loading="lazy"
                  decoding="async"
                  width={1536}
                  height={1024}
                  data-testid={`anim-img-${i}`}
                />
              ))}

              {/* Floating Info-Tag */}
              <div
                className="absolute bottom-4 right-4 z-10 rounded-xl p-3 max-w-52"
                style={{
                  background: "rgba(15, 15, 15, 0.62)",
                  backdropFilter: "blur(10px)",
                  opacity: 0.65 + eased * 0.35,
                  transform: `translateY(${(12 - eased * 12).toFixed(1)}px)`,
                  transition: "opacity 0.2s linear",
                }}
                data-testid="anim-tag"
              >
                <strong className="block text-white text-sm mb-0.5">
                  {current.tagTitle}
                </strong>
                <span className="text-white/78 text-xs leading-snug">
                  {current.tagBody}
                </span>
              </div>
            </div>

            {/* Fortschritts-Schiene (nur Desktop) */}
            {!useStaticLayout && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 rounded-full bg-border overflow-hidden hidden md:block"
                style={{ height: "44%" }}
                aria-hidden="true"
              >
                <span
                  className="block w-full rounded-full bg-primary"
                  style={{
                    height: `${progress * 100}%`,
                    transition: "height 0.1s linear",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
