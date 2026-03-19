export default function AuthorSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.rex-bedachung.de/#author",
    "name": "Tim Rex",
    "jobTitle": "Geschäftsführer & Dachdeckermeister",
    "worksFor": {
      "@id": "https://www.rex-bedachung.de/#organization"
    },
    "url": "https://www.rex-bedachung.de/ueber-uns"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
