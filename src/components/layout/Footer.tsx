'use client'

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm leading-none">A</span>
              </div>
              <span className="font-semibold text-text-primary text-lg tracking-tight">AI-Forge</span>
            </div>
            <p className="text-body-sm text-text-muted max-w-xs">
              The AI tools you wish existed — built by the community. Vote for ideas and watch them come to life.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Navigate</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', id: 'hero-section' },
                { label: 'Explore Ideas', id: 'foundry' },
                { label: 'Submit Idea', id: 'idea-lab' },
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left text-body-sm text-text-muted hover:text-cta transition-colors w-fit"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">Community</h3>
            <p className="text-body-sm text-text-muted">
              Submit your concept, vote on ideas that excite you, and watch the most-supported tools get built.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-body-sm text-text-muted">
            © {new Date().getFullYear()} AI-Forge. Building tomorrow's tools, today.
          </p>
        </div>
      </div>
    </footer>
  )
}
