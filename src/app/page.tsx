export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/hero'
import { IdeaLabSection } from '@/components/idea-lab'
import { FoundrySection } from '@/components/foundry'
import { Navbar, Footer } from '@/components/layout'
import { CtaSection } from '@/components/layout/CtaSection'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FoundrySection />
      <IdeaLabSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
