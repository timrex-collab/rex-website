export default function AuthorSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.rex-bedachung.de/#author",
        "name": "Tim Rex",
        "jobTitle": "Geschäftsführer & Dachdeckermeister",
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
          "FLL-Richtlinien Dachbegrünung"
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
