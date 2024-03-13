import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { RecordingHero } from '@/components/RecordingHero'
import { Notification } from '@/components/Notification'
import { TechCaller } from '@/components/TechCaller'
import { ActionHistory } from '@/components/ActionHistory'
import { Dashboard } from '@/components/Dashboard'

export default function Home() {
  return (
    <>
      <Notification />
      <Header />
      <main>
        <RecordingHero />
        <TechCaller />
        <ActionHistory />
        {/*<PrimaryFeatures />*/}
        {/*<SecondaryFeatures />*/}
        {/*<ActionCaller />*/}
        {/*<Testimonials />*/}
        {/*<Pricing />*/}
        <Dashboard />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
