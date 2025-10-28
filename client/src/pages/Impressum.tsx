import { Helmet } from "react-helmet";

export default function Impressum() {
  return (
    <>
      <Helmet>
        <title>Impressum - Rex Bedachungs GmbH</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Impressum</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Angaben gemäß § 5 TMG</h2>
              <p>
                Rex Bedachungs GmbH<br />
                Paulinenstr. 22<br />
                44799 Bochum
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Vertreten durch</h2>
              <p>Geschäftsführer: Peter Rex, Tim Rex</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
              <p>
                Telefon: 0234-583100<br />
                E-Mail: info@rex-bedachung.de
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Registereintrag</h2>
              <p>
                Eintragung im Handelsregister<br />
                Registergericht: [Gericht einfügen]<br />
                Registernummer: [Nummer einfügen]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                [USt-IdNr. einfügen]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
              <p>
                Berufsbezeichnung: Dachdecker-Meisterbetrieb<br />
                Zuständige Kammer: Handwerkskammer Dortmund<br />
                Verliehen in: Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">EU-Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
                <br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
