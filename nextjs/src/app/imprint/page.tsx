import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Imprint } from '@/components/Imprint'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Imprint />
      </main>
      <Footer />
    </>
  )
}
