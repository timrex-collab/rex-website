import { useEffect } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";

export default function Datenschutz() {
  // Direktsprung auf einen Abschnitt, z. B. /datenschutz#google-maps aus dem Kartenhinweis auf
  // /kontakt. ScrollToTop setzt beim Seitenwechsel nach oben, deshalb erst nach dem Rendern springen.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung - Rex Bedachungs GmbH</title>
        <meta name="description" content="Datenschutzerklärung der Rex Bedachungs GmbH aus Bochum – Informationen zur Verarbeitung personenbezogener Daten und zu Ihren Rechten gemäß DSGVO." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.rex-bedachung.de/datenschutz" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Datenschutzerklärung - Rex Bedachungs GmbH" />
        <meta name="twitter:description" content="Datenschutzerklärung der Rex Bedachungs GmbH, Bochum." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
      </Helmet>
      <OrganizationSchema />

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
                Diese Website wird bei Netlify, Inc., USA, gehostet. Die personenbezogenen Daten, 
                die auf dieser Website erfasst werden, werden auf den Servern von Netlify gespeichert. 
                Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und 
                Kommunikationsdaten, Kontaktdaten, Namen und Websitezugriffe handeln. Über den 
                Dienst Netlify Forms nimmt Netlify auch die Eingaben aus unseren Formularen 
                entgegen und speichert sie.
              </p>
              <p>
                Netlify verarbeitet diese Daten in unserem Auftrag auf Grundlage eines Vertrags zur 
                Auftragsverarbeitung nach Art. 28 DSGVO. Dabei werden Daten in die USA übermittelt. 
                Die Übermittlung stützt sich auf den Angemessenheitsbeschluss der Europäischen 
                Kommission zum EU-US Data Privacy Framework (Art. 45 DSGVO); ergänzend sieht der 
                Vertrag mit Netlify Standardvertragsklauseln der Europäischen Kommission vor 
                (Art. 46 Abs. 2 lit. c DSGVO).
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
              <h3 className="text-xl font-semibold mb-3 mt-6">Hinweis zur verantwortlichen Stelle</h3>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
                Rex Bedachungs GmbH<br />
                Paulinenstraße 22<br />
                44799 Bochum<br />
                Telefon: 0234 / 58 31 00<br />
                E-Mail: info@rex-bedachung.de
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
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt 
                im sicheren und fehlerfreien Betrieb der Website.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Kontaktformular</h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, verarbeiten wir Ihre 
                Angaben aus dem Formular inklusive der angegebenen Kontaktdaten zur Bearbeitung der 
                Anfrage und für Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, 
                soweit Ihre Anfrage auf einen Vertrag oder vorvertragliche Maßnahmen zielt, im 
                Übrigen Art. 6 Abs. 1 lit. f DSGVO (Beantwortung Ihrer Anfrage). Die Eingaben werden 
                über Netlify Forms verarbeitet (siehe Abschnitt 3) und uns per E-Mail zugestellt. 
                Darüber hinaus geben wir Ihre Daten nicht ohne Ihre Einwilligung weiter.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">VELUX-Preisrechner und Angebotsanfragen</h3>
              <p>
                Wenn Sie über unseren VELUX-Preisrechner ein Angebot anfragen, verarbeiten wir Ihren 
                Namen, Ihre E-Mail-Adresse und/oder Telefonnummer sowie freiwillig mitgeteilte 
                Adressdaten und Anmerkungen. Zusätzlich werden Ihre Fensterkonfiguration, die 
                berechnete Kostenschätzung und Ihre Antworten zu den Fördervoraussetzungen 
                übermittelt. Diese Angaben verwenden wir zur Bearbeitung Ihrer Anfrage, zur 
                Rückmeldung, zur Angebotserstellung und zur Berücksichtigung möglicher Förderwege. 
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung für diese 
                vorvertraglichen Maßnahmen erforderlich ist.
              </p>
              <p>
                Für die Angebotsanfrage benötigen wir Ihren Namen und mindestens eine 
                Kontaktmöglichkeit (E-Mail oder Telefon). Adresse und Anmerkung sind freiwillig. Die 
                Eingaben werden über Netlify Forms verarbeitet (siehe Abschnitt 3). Die 
                PDF-Kostenschätzung erstellt Ihr Browser lokal; die PDF-Datei selbst wird nicht an 
                uns übertragen.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Speicherdauer von Anfragen</h3>
              <p>
                Formulareingaben löschen wir bei Netlify spätestens drei Monate nach Eingang. 
                Anfragen in unserem E-Mail-Postfach, aus denen kein Auftrag entsteht, löschen wir 
                spätestens zwölf Monate nach Eingang. Entsteht ein Auftrag, bewahren wir die 
                Unterlagen so lange auf, wie gesetzliche Aufbewahrungspflichten es vorschreiben.
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
              <h3 id="google-maps" className="text-xl font-semibold mb-3 scroll-mt-28">
                Google Maps (erst nach Klick)
              </h3>
              <p>
                Auf unserer Kontaktseite können Sie eine Karte von Google Maps einblenden. Wir
                verwenden Google Maps, um unseren Standort darzustellen und Ihnen die Anfahrt zu
                erleichtern. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street,
                Dublin 4, Irland („Google“).
              </p>
              <p>
                Die Nutzung ist freiwillig und für eine Kontaktaufnahme nicht erforderlich. Die Karte
                wird erst geladen, wenn Sie auf „Google Maps laden“ klicken. Ohne Ihre Aktivierung
                werden über diese Karteneinbindung keine Daten an Google übertragen; unsere
                Kontaktdaten und das Kontaktformular können Sie trotzdem nutzen.
              </p>
              <p>
                Mit der Aktivierung stellt Ihr Browser eine Verbindung zu Servern von Google her.
                Dabei erhält Google insbesondere Ihre IP-Adresse, Angaben zu Browser und Endgerät,
                Informationen über die aufgerufene Seite sowie Datum und Uhrzeit. Google kann
                außerdem Cookies oder ähnliche Technologien auf Ihrem Endgerät einsetzen. Über die
                weitere Verarbeitung der an Google übermittelten Daten informiert Google in seiner{" "}
                <a
                  href="https://policies.google.com/privacy?hl=de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>
              <p>
                Die Verarbeitung im Zusammenhang mit unserer Karteneinbindung erfolgt auf Grundlage
                Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Soweit dabei Informationen auf
                Ihrem Endgerät gespeichert oder ausgelesen werden und eine Einwilligung erforderlich
                ist, erfolgt dies auf Grundlage von § 25 Abs. 1 TDDDG.
              </p>
              <p>
                Sie können Ihre Einwilligung in die Karteneinbindung jederzeit über „Karte
                deaktivieren / Einwilligung widerrufen“ mit Wirkung für die Zukunft widerrufen.
                Dadurch wird die Karte entfernt und die weitere Datenübertragung durch diese
                Einbindung beendet. Bereits an Google übermittelte Daten oder dort gesetzte Cookies
                werden dadurch nicht automatisch gelöscht. Die Rechtmäßigkeit der bis zum Widerruf
                erfolgten Verarbeitung bleibt unberührt.
              </p>
              <p>
                Wir speichern Ihre Kartenfreigabe nicht über den aktuellen Aufruf der Kontaktseite
                hinaus. Google kann übermittelte Daten darüber hinaus speichern; die Dauer hängt
                insbesondere von Datenart, Verarbeitungszweck, Ihren Einstellungen und gesetzlichen
                Aufbewahrungspflichten ab. Einzelheiten erläutert Google in seinen{" "}
                <a
                  href="https://policies.google.com/technologies/retention?hl=de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Informationen zur Datenspeicherung
                </a>
                .
              </p>
              <p>
                Google kann Daten auch an die Google LLC in den USA übermitteln. Die Übermittlung
                stützt sich auf den Angemessenheitsbeschluss der Europäischen Kommission zum EU-US
                Data Privacy Framework (Art. 45 DSGVO), unter dem die Google LLC zertifiziert ist.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Links zu anderen Anbietern</h3>
              <p>
                Unsere Website enthält einfache Links zu anderen Anbietern, etwa zu unserem Eintrag
                bei Google Maps, zu unserem Bewertungsprofil bei ProvenExpert und zu unseren Seiten
                bei Facebook und Instagram. Beim Aufruf unserer Website werden über diese Links keine
                Daten an die Anbieter übertragen. Erst wenn Sie einen Link anklicken, öffnet sich die
                Seite des Anbieters; dort gilt dessen Datenschutzerklärung.
              </p>
              <p>
                Darüber hinaus bindet diese Website keine externen Plugins oder Tools ein.
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
              <p className="mt-4">
                Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu 
                beschweren. Für uns zuständig ist die Landesbeauftragte für Datenschutz und 
                Informationsfreiheit Nordrhein-Westfalen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
