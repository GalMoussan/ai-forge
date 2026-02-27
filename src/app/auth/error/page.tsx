export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-heading-lg font-semibold text-text-primary mb-2">Authentication Error</h1>
        <p className="text-text-muted">Something went wrong during sign in. Please try again.</p>
        <a href="/" className="mt-4 inline-block text-cta hover:underline">Return home</a>
      </div>
    </div>
  )
}
