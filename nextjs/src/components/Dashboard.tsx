'use client'
import Image from 'next/image'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'
import { dashboardStore } from '@/stores/dashboardStore'

export function Dashboard() {
  const {
    userRequests,
    allUserRequests,
    globalRequests,
    userLimit,
    globalLimit,
    userId,
  } = dashboardStore()

  const stats = [
    {
      id: 1,
      name: 'Deine heutigen Anfragen',
      value: ' ' + Math.round(parseFloat(userRequests)),
    },
    {
      id: 2,
      name: 'Deine frei verfügbaren Anfragen',
      value:
        ' ' +
        Math.round(
          parseFloat(
            String(Number.parseInt(userLimit) - Number.parseInt(userRequests)),
          ),
        ) +
        ' ',
    },
    {
      id: 6,
      name: 'Alle Anfragen Gesamt/Tag',
      value: ' ' + Math.round(parseFloat(globalRequests)) + ' ',
    },

    {
      id: 4,
      name: 'Alle Deine bisherigen Anfragen',
      value: ' ' + Math.round(parseFloat(allUserRequests)) + ' ',
    },

    {
      id: 5,
      name: 'Kostenfreie Anfragen pro Benutzer/Tag',
      value: ' ' + Math.round(parseFloat(userLimit)) + ' ',
    },
    {
      id: 3,
      name: 'Kostenfreie Anfragen aller Benutzer/Tag',
      value: ' ' + Math.round(parseFloat(globalLimit)) + ' ',
    },
  ]

  return (
    <section
      id="Dashboard"
      className="relative overflow-hidden bg-blue-600 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        priority={true}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Anfragen Dashboard
              </h2>
              <div className="mt-4 flex flex-row items-center justify-center text-lg leading-8 text-gray-800">
                <div className="text-xs font-bold text-gray-100 md:text-sm">
                  User-Id:&nbsp;
                </div>
                <div className="text-xs text-gray-200 md:text-sm">{userId}</div>
              </div>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col bg-gray-600/20 p-10"
                >
                  <dt className="text-sm font-medium leading-8 text-gray-200">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  )
}
