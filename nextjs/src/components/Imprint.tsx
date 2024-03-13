import { Container } from '@/components/Container'

export function Imprint() {
  return (
    <Container className="font-left mx-auto max-w-4xl pb-32 pt-8 text-left lg:pt-12">
      <h1 className="font-display text-5xl font-medium tracking-tight">
        Impressum
      </h1>
      <p className="mt-4">Angaben gemäß § 5 TMG</p>
      <h2 className="mt-6 font-display text-2xl font-medium tracking-tight">
        Herausgeber
      </h2>
      <p className="mt-4">
        Thorsten Schminkel
        <br />
        Haselnußweg 19
        <br />
        70955 Stuttgart
      </p>
      <h2 className="mt-6 font-display text-2xl font-medium tracking-tight">
        Kontakt
      </h2>
      <p className="mt-4">
        E-Mail: thorsten@schminkel.de
        <br />
        Telefon: 0711 / 693 14 10
      </p>

      <h2 className="mt-6 font-display text-2xl font-medium tracking-tight">
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
      </h2>
      <p className="mt-4">Thorsten Schminkel</p>

      <h2 className="mt-12 font-display text-3xl font-medium tracking-tight">
        Haftungsausschluss
      </h2>

      <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">
        Haftung für Inhalte
      </h3>
      <p className="mt-4">
        Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
        jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7
        Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
        Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
        Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
        gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
        forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
        Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
        Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von
        entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
        entfernen.
      </p>

      <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">
        Haftung für Links
      </h3>
      <p className="mt-4">
        Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
        Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
        Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
        Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
        verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
        waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
        inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
        Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden
        von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </p>

      <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">
        Urheberrecht
      </h3>
      <p className="mt-4">
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
        Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
        sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden,
        werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
        Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
        Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
        entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden
        wir derartige Inhalte umgehend entfernen.
      </p>

      <h3 className="mt-4 font-display text-2xl font-medium tracking-tight">
        Verwendung von Archivfotos
      </h3>
      <p className="mt-4">
        Wir verwenden Stockfotos, um die Effektivität und die Wirkung
        verschiedener Inhalte für unterschiedliche Zielgruppen zu verbessern.
        Die meisten unserer Bilder werden von Unsplash zur Verfügung gestellt.
        Wir nutzen aber auch kommerzielle Partner, um unseren Medienauftritt zu
        verbessern.
      </p>
    </Container>
  )
}
