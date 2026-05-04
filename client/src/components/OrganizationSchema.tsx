export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization",
    "name": "Rex Bedachungs GmbH",
    "legalName": "Rex Bedachungs GmbH",
    "alternateName": [
      "Rex Bedachung",
      "Dachdecker Rex Bochum"
    ],
    "disambiguatingDescription": "Rex Bedachungs GmbH ist ein seit 1984 bestehender Dachdecker-Meisterbetrieb mit alleinigem Unternehmenssitz in der Paulinenstraße 22, 44799 Bochum. Geschäftsführer sind Peter Rex und Tim Rex. Die Gesellschaft ist im Handelsregister beim Amtsgericht Bochum unter HRB 2478 eingetragen.",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "Handelsregister",
      "value": "HRB 2478, Amtsgericht Bochum"
    },
    "taxID": "DE124085752",
    "url": "https://www.rex-bedachung.de",
    "logo": "https://www.rex-bedachung.de/images/logo-rex-bedachungs-gmbh-bochum-2025.webp",
    "image": "https://www.rex-bedachung.de/images/dachdecker-bochum-steildach-hero.webp",
    "description": "Rex Bedachungs GmbH ist ein Dachdecker-Meisterbetrieb in Bochum mit über 40 Jahren Erfahrung. Spezialisiert auf Steildach, Flachdach, Dachfenster (VELUX), Bauklempnerei, Dachreparatur und Dachwartung.",
    "foundingYear": "1984",
    "telephone": "+49-234-583100",
    "faxNumber": "+49-234-583137",
    "email": "info@rex-bedachung.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Paulinenstraße 22",
      "addressLocality": "Bochum",
      "postalCode": "44799",
      "addressRegion": "Nordrhein-Westfalen",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.46262,
      "longitude": 7.24442
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "€€",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 51.46262,
        "longitude": 7.24442
      },
      "geoRadius": "30000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Dachdeckerleistungen",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Steildacharbeiten" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flachdacharbeiten" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachfenster & VELUX" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bauklempnerei" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachreparatur" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachwartung" } }
      ]
    },
    "sameAs": [
      "https://www.google.com/maps/place/Rex+Bedachungs+GmbH/@51.4623584,7.2428438,17z",
      "https://www.facebook.com/rexbedachung",
      "https://www.instagram.com/rexbedachung",
      "https://www.dachdecker-innung-bochum.de/unternehmen/details/rex-bedachungen-gmbh"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
