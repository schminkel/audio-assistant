import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question:
        'Warum bekomme ich die Meldung, das mein freies Kontingent aufgebraucht ist?',
      answer:
        'Diese Service ist für Sie in gewissem Umfang zum Testen kostenlos. Wenn Sie mehr als 6 Anfragen am Tag benötigen, können Sie ein kostenpflichtiges Kontingent buchen. Weitere Informationen finden Sie auf den Seiten im Rahmen der Registrierung.',
    },
    {
      question: 'Wer kann meine Anfragen sehen?',
      answer:
        'Ihrem Browser wird beim Besuchen dieser Seite eine eindeutige User-Id zugewiesen. Diese Kennung identifiziert Sie und ist bei erneutem Besuchen der Seite immer gleich. Hierüber ist es uns möglich, Ihre Anfragen Ihnen (bzw. Ihrem Browser) eindeutig zuzuordnen, so das nur Sie Ihre eigenen Anfragen sehen und niemand sonst.',
    },
  ],
  [
    {
      question: 'In welchem Rahmen kann ich diesen Service nutzen?',
      answer:
        'Sie können jeden Tag bis zu 6 Anfragen völlig kostenfrei stellen. Der Service kann jedoch von vielen Nutzern gleichzeitig verwendet werden, daher gibt es ein Tageskontingent von 60 Anfragen pro Tag für alle kostenfreien Nutzer. Ist das Kontingent aufgebraucht, können Sie ein kostenpflichtiges Kontingent buchen oder am nächsten Tag wieder kostenfrei Anfragen stellen.',
    },
    {
      question: 'Kann ich meine Anfragen löschen?',
      answer:
        'ja, am Ende des Aktivitätsverlaufs finden Sie den Button "Alle Anfragen löschen", mit dem Sie alle Ihre Anfragen löschen können. Bitte beachten Sie, dass diese Aktion nicht rückgängig gemacht werden kann. Wenn Sie Ihre Anfragen löschen, sind diese für immer verloren. Wir können Ihnen diese nicht wiederherstellen. Nach der Aktion werden Platzhalter mit dem Hinweis "gelöscht" angezeigt.',
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
