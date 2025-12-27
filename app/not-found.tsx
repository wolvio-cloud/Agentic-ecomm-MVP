import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Icon */}
        <div className="space-y-2">
          <div className="text-8xl font-bold text-ink/10">404</div>
          <div className="text-4xl">🔍</div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ink">Page Not Found</h1>
          <p className="text-muted">
            Sorry, we couldn't find the page you're looking for. It might have been moved or
            deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/feed"
            className="block w-full bg-accent text-white font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Browse Items
          </Link>
          <Link
            href="/"
            className="block w-full bg-surface text-ink font-medium py-3 px-6 rounded-xl hover:bg-surface/80 transition-colors"
          >
            Go to Home
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-6 border-t border-surface">
          <p className="text-sm text-muted mb-3">Popular pages:</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/sell" className="text-accent hover:underline">
              Sell Item
            </Link>
            <Link href="/my-items" className="text-accent hover:underline">
              My Items
            </Link>
            <Link href="/test" className="text-accent hover:underline">
              Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
