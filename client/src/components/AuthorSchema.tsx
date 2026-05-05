export default function AuthorSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.rex-bedachung.de/#author",
        "name": "Tim Rex",
        "jobTitle": "Geschäftsführer & Dachdeckermeister",
        "image": "https://www.rex-bedachung.de/images/Tim_Rex_Dachdeckermeister_Bochum.webp",
        "description": "Tim Rex ist Dachdeckermeister und Geschäftsführer der Rex Bedachungs GmbH in Bochum. Sein fachlicher Schwerpunkt liegt auf energetischer Dachsanierung, Dachbegrünung, BEG-Förderberatung und VELUX-Dachfenstertechnik.",
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "name": "Dachdeckermeister",
          "credentialCategory": "Meistertitel",
          "recognizedBy": {
            "@type": "Organization",
            "name": "Handwerkskammer Dortmund"
          }
        },
        "knowsAbout": [
          "Dachsanierung",
          "Flachdachabdichtung",
          "Steildacheindeckung",
          "Dachfenster VELUX",
          "Aufsparrendämmung",
          "BEG EM BAFA-Förderung",
          "GEG 2024",
          "ZVDH-Regelwerk",
          "DIN 18531",
          "FLL-Richtlinien Dachbegrünung",
          "Dachbegrünung",
          "NRW-Solardachpflicht"
        ],
        "worksFor": {
          "@id": "https://www.rex-bedachung.de/#organization"
        },
        "url": "https://www.rex-bedachung.de/ueber-uns"
      },
      {
        "@type": "Person",
        "@id": "https://www.rex-bedachung.de/#author-peter",
        "name": "Peter Rex",
        "jobTitle": "Geschäftsführer",
        "description": "Peter Rex hat die Rex Bedachungs GmbH 1984 gegründet. Seine Schwerpunkte sind das klassische Dachdeckerhandwerk sowie kaufmännische Verwaltung und Abrechnungswesen.",
        "knowsAbout": [
          "Dachdeckerhandwerk",
          "Bauklempnerei",
          "Steildach",
          "Flachdach",
          "Unternehmensführung im Handwerk",
          "Kaufmännische Verwaltung",
          "Abrechnungswesen"
        ],
        "worksFor": {
          "@id": "https://www.rex-bedachung.de/#organization"
        },
        "url": "https://www.rex-bedachung.de/ueber-uns"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
