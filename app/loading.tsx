export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-surface rounded-full" />
          <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="space-y-1">
          <p className="text-ink font-medium">Loading...</p>
          <p className="text-sm text-muted">Please wait a moment</p>
        </div>
      </div>
    </div>
  )
}
