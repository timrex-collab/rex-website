import { Helmet } from "react-helmet";

export default function Datenschutz() {
  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung - Rex Bedachungs GmbH</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Datenschutzerklärung</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-xl font-semibold mb-3">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Datenerfassung auf dieser Website</h2>
              <h3 className="text-xl font-semibold mb-3">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser 
                Datenschutzerklärung entnehmen.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Wie erfassen wir Ihre Daten?</h3>
              <p>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei 
                kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
              </p>
              <p>
                Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website 
                durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. 
                Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Hosting</h2>
              <p>
                Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser 
                Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann 
                es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, 
                Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine 
                Website generiert werden, handeln.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Allgemeine Hinweise und Pflicht­informationen</h2>
              <h3 className="text-xl font-semibold mb-3">Datenschutz</h3>
              <p>
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
                Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den 
                gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Datenerfassung auf dieser Website</h2>
              <h3 className="text-xl font-semibold mb-3">Server-Log-Dateien</h3>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so 
                genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. 
                Dies sind:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="mt-4">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Kontaktformular</h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Analyse-Tools und Werbung</h2>
              <p>
                Diese Website verwendet derzeit keine Analyse-Tools oder Tracking-Cookies. 
                Sollten wir in Zukunft Analysewerkzeuge einsetzen (z. B. Plausible Analytics), 
                werden wir Sie darüber in dieser Datenschutzerklärung informieren.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Plugins und Tools</h2>
              <p>
                Diese Website bindet derzeit keine externen Plugins oder Tools ein, die 
                personenbezogene Daten verarbeiten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Ihre Rechte</h2>
              <p>Sie haben jederzeit das Recht:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
                <li>Die Berichtigung unrichtiger Daten zu verlangen</li>
                <li>Die Löschung Ihrer Daten zu verlangen</li>
                <li>Die Einschränkung der Verarbeitung zu verlangen</li>
                <li>Widerspruch gegen die Verarbeitung einzulegen</li>
                <li>Datenübertragbarkeit zu verlangen</li>
              </ul>
              <p className="mt-4">
                Für diese Anliegen wenden Sie sich bitte an: info@rex-bedachung.de
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
