export function IdeaCardSkeleton() {
  return (
    <div
      className="bg-surface rounded-2xl border border-border p-6 animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-border" />
        <div className="flex-1">
          <div className="h-4 bg-border rounded w-3/4 mb-2" />
          <div className="h-3 bg-border rounded w-1/3" />
        </div>
      </div>
      <div className="h-5 bg-border rounded w-full mb-2" />
      <div className="h-5 bg-border rounded w-4/5 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-border rounded-full w-20" />
        <div className="h-6 bg-border rounded-full w-16" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-border rounded w-20" />
        <div className="h-4 bg-border rounded w-16" />
      </div>
    </div>
  )
}
