import { createClient } from '@/lib/supabase/server'
import type { IdeaWithProfile } from '@/types/database'
import { FoundryGallery } from './FoundryGallery'
import { COPY } from '@/lib/copy'

export async function FoundrySection() {
  const supabase = await createClient()
  const { data: ideas } = await supabase
    .from('ideas')
    .select('*, profiles(username, avatar_url)')
    .eq('status', 'active')
    .order('vote_count', { ascending: false })
    .returns<IdeaWithProfile[]>()

  return (
    <section id="foundry" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-body-sm font-semibold tracking-widest text-cta uppercase mb-3">{COPY.foundry.eyebrow}</p>
        <h2 className="font-sans text-heading-lg font-bold text-text-primary mb-2">{COPY.foundry.heading}</h2>
        <p className="text-body-lg text-text-muted mb-10 max-w-2xl">{COPY.foundry.subheading}</p>
        <FoundryGallery initialIdeas={ideas ?? []} />
      </div>
    </section>
  )
}
