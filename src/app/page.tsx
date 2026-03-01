export const dynamic = 'force-dynamic'

import { HeroSection } from '@/components/hero'
import { IdeaLabSection } from '@/components/idea-lab'
import { FoundrySection } from '@/components/foundry'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IdeaLabSection />
      <FoundrySection />
    </main>
  )
}
