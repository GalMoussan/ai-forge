import { COPY } from '@/lib/copy'
import { SubmitIdeaForm } from './SubmitIdeaForm'

export function IdeaLabSection() {
  return (
    <section id="idea-lab" className="py-24 px-6" aria-label="Idea Lab — submit your AI tool concept">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-3 mb-10">
          <p className="text-body-sm font-semibold uppercase tracking-widest text-cta">
            {COPY.ideaLab.eyebrow}
          </p>
          <h2 className="text-display-md font-semibold text-accent">
            {COPY.ideaLab.heading}
          </h2>
          <p className="text-heading-md text-text-muted">
            {COPY.ideaLab.subheading}
          </p>
        </div>
        <SubmitIdeaForm />
      </div>
    </section>
  )
}
