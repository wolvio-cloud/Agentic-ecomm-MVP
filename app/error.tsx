'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="text-6xl">⚠️</div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
          <p className="text-muted">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
            <p className="text-xs font-mono text-red-800 break-all">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-surface text-ink font-medium py-3 px-6 rounded-xl hover:bg-surface/80 transition-colors"
          >
            Go to Home
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted">
          If this problem persists, please try refreshing the page or clearing your browser
          cache.
        </p>
      </div>
    </div>
  )
}
