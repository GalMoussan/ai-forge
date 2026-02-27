'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRealtimeIdeas } from '@/lib/hooks/useRealtimeIdeas'
import type { IdeaWithProfile } from '@/types/database'
import type { IdeaCategory } from '@/types/database'
import { CategoryFilter } from './CategoryFilter'
import { IdeaCard } from './IdeaCard'
import { IdeaDrawer } from './IdeaDrawer'
import { COPY } from '@/lib/copy'

interface FoundryGalleryProps {
  initialIdeas: IdeaWithProfile[]
}

export function FoundryGallery({ initialIdeas }: FoundryGalleryProps) {
  const ideas = useRealtimeIdeas(initialIdeas) as IdeaWithProfile[]
  const [activeCategory, setActiveCategory] = useState<IdeaCategory | 'all'>('all')
  const [selectedIdea, setSelectedIdea] = useState<IdeaWithProfile | null>(null)

  const filtered =
    activeCategory === 'all' ? ideas : ideas.filter(idea => idea.category === activeCategory)

  if (ideas.length === 0) {
    return (
      <div className="text-center py-24">
        <h3 className="text-heading-md font-semibold text-text-primary mb-2">
          {COPY.foundry.empty_state.heading}
        </h3>
        <p className="text-text-muted mb-6">{COPY.foundry.empty_state.body}</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <AnimatePresence>
            {filtered.map(idea => (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <IdeaCard idea={idea} onOpenDrawer={() => setSelectedIdea(idea)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <IdeaDrawer idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
    </>
  )
}
