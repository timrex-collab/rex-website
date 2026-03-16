import type { Context } from "https://edge.netlify.com";

interface OGData {
  title: string;
  description: string;
  image: string;
  imageWidth?: string;
  imageHeight?: string;
}

const BASE_URL = "https://www.rex-bedachung.de";
const DEFAULT_IMAGE = `${BASE_URL}/images/dach-hintergrund-rex-bedachung.webp`;

const routes: Record<string, OGData> = {
  "/": {
    title: "Dachdecker Bochum – Rex Bedachungs GmbH",
    description: "Ihr Dachdecker in Bochum seit über 30 Jahren. Flachdach, Steildach, Dachsanierung, Bauklempnerei. Jetzt kostenlos anfragen: 0234 583100.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/flachdach-bochum": {
    title: "Flachdach Bochum – Abdichtung, Sanierung & Neubau | Rex Bedachungs GmbH",
    description: "Flachdach-Experten in Bochum: Abdichtung, Sanierung, Neubau und Gründach. Kostenlose Beratung. Tel. 0234 583100.",
    image: `${BASE_URL}/images/flachdach-sanierung-bochum-rex-bedachung.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/steildach-bochum": {
    title: "Steildach Bochum – Eindeckung, Sanierung & Dämmung | Rex Bedachungs GmbH",
    description: "Steildach-Arbeiten in Bochum: Neueindeckung, Sanierung, Aufsparrendämmung. BAFA/KfW-gefördert. Tel. 0234 583100.",
    image: `${BASE_URL}/images/dachdecker-bochum-steildach-hero.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/dachreparatur-bochum": {
    title: "Dachreparatur Bochum – Schnell & Zuverlässig | Rex Bedachungs GmbH",
    description: "Dachreparatur in Bochum: Sturmschäden, undichte Stellen, Ziegel tauschen. Schnelle Reaktionszeit. Tel. 0234 583100.",
    image: `${BASE_URL}/images/dachreparatur-bochum-rex-bedachung.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/bauklempnerei-bochum": {
    title: "Bauklempnerei Bochum – Dachrinnen & Blecharbeiten | Rex Bedachungs GmbH",
    description: "Bauklempnerei in Bochum: Dachrinnen, Fallrohre, Blechverkleidungen, Dachabdichtungen. Tel. 0234 583100.",
    image: `${BASE_URL}/images/kamin-sanierung-bochum-dachdecker.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/dachwartung-bochum": {
    title: "Dachwartung Bochum – Inspektion & Wartung | Rex Bedachungs GmbH",
    description: "Professionelle Dachwartung in Bochum: Inspektion, Wartung, Schadensprävention. Regelmäßige Dachpflege spart Kosten. Tel. 0234 583100.",
    image: `${BASE_URL}/images/dachdecker-inspektion-dachwartung-bochum.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/dachfenster-bochum": {
    title: "Dachfenster Bochum – Einbau & Austausch | Rex Bedachungs GmbH",
    description: "Dachfenster in Bochum: Einbau, Austausch und Reparatur. Velux-Fachpartner. Kostenlose Beratung. Tel. 0234 583100.",
    image: `${BASE_URL}/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/gruendach-dachbegrunung-bochum": {
    title: "Gründach Bochum – Dachbegrünung & Extensive Begrünung | Rex Bedachungs GmbH",
    description: "Gründach-Experten in Bochum: extensive und intensive Dachbegrünung. Förderung möglich. Tel. 0234 583100.",
    image: `${BASE_URL}/images/gruendach-bochum-dachbegruenung-experten.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/foerderung": {
    title: "Förderung Dachsanierung Bochum – BAFA & KfW | Rex Bedachungs GmbH",
    description: "Bis zu 20% Förderung für Dachsanierung in Bochum. BAFA und KfW Zuschüsse für Dämmung und Sanierung. Jetzt beraten lassen.",
    image: `${BASE_URL}/images/foerderung-hero.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/solarpflicht": {
    title: "Solarpflicht NRW – Was Eigentümer in Bochum wissen müssen | Rex Bedachungs GmbH",
    description: "Solarpflicht NRW: Wer ist betroffen? Was kostet es? Rex Bedachung berät Eigentümer in Bochum. Tel. 0234 583100.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/velux-dachfenster-austausch-bochum": {
    title: "Velux Dachfenster Austausch Bochum | Rex Bedachungs GmbH",
    description: "Velux Dachfenster austauschen in Bochum: GGL, GGU, GPU, Integra. Festpreis ab 1.800 €. Zertifizierter Velux-Partner. Tel. 0234 583100.",
    image: `${BASE_URL}/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/velux-dachfenster-rolllaeden-bochum": {
    title: "Velux Dachfenster Rollläden Bochum | Rex Bedachungs GmbH",
    description: "Velux Rollläden für Dachfenster in Bochum: Montage, Austausch, Reparatur. Zertifizierter Velux-Partner. Tel. 0234 583100.",
    image: `${BASE_URL}/images/velux-dachfenster-bochum-typ2.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/leistungen": {
    title: "Dachdecker Leistungen Bochum – Rex Bedachungs GmbH",
    description: "Alle Dachdeckerleistungen in Bochum: Flachdach, Steildach, Reparatur, Bauklempnerei, Gründach und mehr. Tel. 0234 583100.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/ueber-uns": {
    title: "Über uns – Rex Bedachungs GmbH Bochum",
    description: "Rex Bedachungs GmbH – Ihr Dachdecker in Bochum seit über 30 Jahren. Inhabergeführt, regional verwurzelt. Tel. 0234 583100.",
    image: `${BASE_URL}/images/rex-bedachung-unternehmen-bochum.webp`,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/kontakt": {
    title: "Kontakt – Rex Bedachungs GmbH Bochum",
    description: "Kontakt zu Rex Bedachung Bochum: Paulinenstraße 22, 44799 Bochum. Tel. 0234 583100. Kostenlose Beratung und Angebote.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/referenzen": {
    title: "Referenzen – Rex Bedachungs GmbH Bochum",
    description: "Abgeschlossene Dachprojekte in Bochum und dem Ruhrgebiet. Überzeugen Sie sich von der Qualität unserer Arbeit.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/lexikon": {
    title: "Dachlexikon – Fachbegriffe rund ums Dach | Rex Bedachungs GmbH",
    description: "Das Dachlexikon von Rex Bedachung erklärt Fachbegriffe rund ums Dach verständlich und praxisnah.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/faq": {
    title: "FAQ – Häufige Fragen zum Dach | Rex Bedachungs GmbH Bochum",
    description: "Antworten auf die häufigsten Fragen rund ums Dach: Kosten, Förderung, Ablauf, Materialien. Rex Bedachung Bochum.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/karriere": {
    title: "Karriere – Dachdecker Jobs Bochum | Rex Bedachungs GmbH",
    description: "Karriere bei Rex Bedachung Bochum: Stellenangebote für Dachdecker, Auszubildende und Fachkräfte. Jetzt bewerben. Tel. 0234 583100.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/impressum": {
    title: "Impressum – Rex Bedachungs GmbH Bochum",
    description: "Impressum der Rex Bedachungs GmbH, Paulinenstraße 22, 44799 Bochum. Geschäftsführer, Handelsregister und Kontaktdaten.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/datenschutz": {
    title: "Datenschutz – Rex Bedachungs GmbH Bochum",
    description: "Datenschutzerklärung der Rex Bedachungs GmbH Bochum. Informationen zur Datenverarbeitung gemäß DSGVO.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
  "/danke": {
    title: "Vielen Dank – Rex Bedachungs GmbH Bochum",
    description: "Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen. Rex Bedachungs GmbH Bochum.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  },
};

function buildOGTags(og: OGData, url: string): string {
  return `
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${og.title}" />
    <meta property="og:description" content="${og.description}" />
    <meta property="og:image" content="${og.image}" />
    ${og.imageWidth ? `<meta property="og:image:width" content="${og.imageWidth}" />` : ""}
    ${og.imageHeight ? `<meta property="og:image:height" content="${og.imageHeight}" />` : ""}
    <meta property="og:site_name" content="Rex Bedachungs GmbH" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${og.title}" />
    <meta name="twitter:description" content="${og.description}" />
    <meta name="twitter:image" content="${og.image}" />
  `.trim();
}

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);

  const userAgent = request.headers.get("user-agent") || "";
  const isSocialCrawler = [
    "facebookexternalhit",
    "Twitterbot",
    "LinkedInBot",
    "WhatsApp",
    "TelegramBot",
    "Slackbot",
    "Discordbot",
  ].some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));

  if (isSocialCrawler) {
    return context.next();
  }

  const pathname = url.pathname.replace(/\/$/, "") || "/";

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const ogData = routes[pathname] ?? {
    title: "Rex Bedachungs GmbH Bochum",
    description: "Ihr Dachdecker in Bochum. Tel. 0234 583100.",
    image: DEFAULT_IMAGE,
    imageWidth: "1200",
    imageHeight: "630",
  };

  const ogTags = buildOGTags(ogData, `${BASE_URL}${pathname}`);
  const html = await response.text();

  if (!html.includes("<head") && !html.includes("<HEAD")) {
    return response;
  }

  const modified = html.replace(
    /<head([^>]*)>/i,
    `<head$1>\n${ogTags}`
  );

  const newHeaders = new Headers(response.headers);
  newHeaders.delete("content-length");
  newHeaders.set("x-og-inject", "fired");
  newHeaders.set("content-type", "text/html; charset=utf-8");

  return new Response(modified, {
    status: response.status,
    headers: newHeaders,
  });
}

export const config = { path: "/*" };
