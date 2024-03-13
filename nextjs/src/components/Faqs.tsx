import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question:
        'Warum bekomme ich die Meldung, das mein freies Kontingent aufgebraucht ist?',
      answer:
        'Dieser Service steht Ihnen bis zu einem gewissen Umfang zum kostenlosen Testen zur Verfügung. Sollten Sie mehr als 6 Anfragen pro Tag benötigen, besteht die Möglichkeit, ein kostenpflichtiges Kontingent zu buchen. Detaillierte Informationen hierzu finden Sie im Registrierungsprozess und auf den entsprechenden Informationsseiten.',
    },
    {
      question: 'Wer kann meine Anfragen sehen?',
      answer:
        'Bei jedem Besuch dieser Seite wird Ihrem Browser eine eindeutige User-ID zugewiesen. Diese Kennung dient dazu, Sie wiederzuerkennen und ist bei jedem erneuten Besuch identisch. Dadurch können wir Ihre Anfragen eindeutig Ihrem Browser zuordnen, sodass nur Sie Zugriff auf Ihre eigenen Anfragen haben und diese vor Dritten geschützt sind.',
    },
  ],
  [
    {
      question: 'In welchem Rahmen kann ich diesen Service nutzen?',
      answer:
        'Sie haben die Möglichkeit, täglich bis zu 6 Anfragen kostenfrei zu stellen. Da der Service jedoch simultan von einer Vielzahl an Nutzern in Anspruch genommen wird, besteht ein limitiertes Tageskontingent von insgesamt 60 Anfragen für alle kostenfreien Nutzer. Sollte dieses Kontingent erschöpft sein, besteht die Option, ein kostenpflichtiges Kontingent zu erwerben oder am folgenden Tag erneut kostenfrei Anfragen zu stellen.',
    },
    {
      question: 'Kann ich meine Anfragen löschen?',
      answer:
        'Ja, am Ende des Aktivitätsverlaufs finden Sie den Button „Alle Anfragen löschen“. Durch Klicken auf diesen Button können Sie alle Ihre Anfragen löschen. Bitte beachten Sie, dass diese Aktion irreversibel ist. Einmal gelöschte Anfragen sind endgültig verloren und können nicht wiederhergestellt werden. Nach dem Löschen werden Platzhalter mit dem Hinweis „Gelöscht“ angezeigt.',
    },
  ],
  [
    {
      question: 'Warum ist der Service nicht unbegrenzt nutzbar?',
      answer:
        'Die zugrundeliegende Infrastruktur bei AWS oder die Anfragen bei ChatGPT sind auch für uns kostenpflichtig. Wir möchten Ihnen jedoch die Möglichkeit geben, den Service kostenfrei zu testen. Daher ist die Nutzung auf 6 Anfragen pro Tag begrenzt. Wenn Sie mehr Anfragen haben, können Sie ein kostenpflichtiges Kontingent buchen. Weitere Informationen finden Sie auf den Seiten im Rahmen der Registrierung.',
    },
    {
      question: 'Wie lange kann ich auf meine Anfragen zugreifen?',
      answer:
        'Es werden im Aktivitätsverlauf die Anfragen der letzten 3 Tage angezeigt. Ältere Anfragen werden automatisch gelöscht. Sie können Ihre Anfragen jedoch auch manuell löschen.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="FAQ"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Häufig gestellte Fragen (FAQs)
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Wenn Sie nicht finden, wonach Sie suchen, schreiben Sie unserem
            Support-Team eine E-Mail.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
