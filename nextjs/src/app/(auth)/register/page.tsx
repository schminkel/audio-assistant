import Link from 'next/link'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { Button } from '@/components/Button'
import { SelectField, TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function Register() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>

      <div className="mt-16 rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Achtung, Achtung!
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Aufgrund der hohen Nachfrage ist eine Registrierung derzeit
                leider <b>nicht</b> möglich.
              </p>
              <p className="mt-3">
                Bitte schreiben Sie eine E-Mail an <br />
                <a
                  className="font-bold hover:underline"
                  href="mailto:thorsten@schminkel.de"
                >
                  Thorsten Schminkel
                </a>{' '}
                und ich werden Sie benachrichtigen, sobald dies wieder möglich
                ist.
              </p>
              <p className="mt-3">Vielen Dank für Ihr Verständnis.</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mt-16 text-lg font-semibold text-gray-900">
        Registrierung für den Premium-Zugang
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Bereits registriert? Hier geht es zur{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Anmeldung
        </Link>
        .
      </p>
      <form
        action="#"
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
      >
        <TextField
          label="Vorname"
          name="first_name"
          type="text"
          autoComplete="given-name"
          disabled={true}
          required
        />
        <TextField
          label="Nachname"
          name="last_name"
          type="text"
          autoComplete="family-name"
          disabled={true}
          required
        />
        <TextField
          className="col-span-full"
          label="E-Mail"
          name="email"
          type="email"
          autoComplete="email"
          disabled={true}
          required
        />
        <TextField
          className="col-span-full"
          label="Passwort"
          name="password"
          type="password"
          autoComplete="new-password"
          disabled={true}
          required
        />
        <SelectField
          className="col-span-full"
          label="Woher hast du von uns erfahren?"
          name="referral_source"
          disabled={true}
        >
          <option>Google Suche</option>
          <option>Von Freunden</option>
          <option>Aus Funk und Fernsehen</option>
        </SelectField>
        <div className="col-span-full">
          <Button
            aria-disabled={true}
            type="submit"
            variant="solid"
            color="blue"
            className="w-full bg-gray-500 text-white hover:bg-gray-500 hover:text-white active:bg-gray-500 active:text-white"
            disabled={true}
          >
            <span>
              Registrierung abschließen <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  )
}
