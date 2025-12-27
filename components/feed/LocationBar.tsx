'use client'

import type { FeedMode } from '@/types'

interface LocationBarProps {
  city: string | null
  loading: boolean
  permissionDenied: boolean
  feedMode: FeedMode
  onModeChange: (mode: FeedMode) => void
  onLocationClick?: () => void
}

export function LocationBar({
  city,
  loading,
  permissionDenied,
  feedMode,
  onModeChange,
  onLocationClick,
}: LocationBarProps) {
  const tabs: Array<{ id: FeedMode; label: string }> = [
    { id: 'nearby', label: 'Nearby' },
    { id: 'national', label: 'All India' },
    { id: 'global', label: '🌍 Global' },
  ]

  return (
    <div className="bg-surface border-b border-ink/10 px-4 py-3 sticky top-0 z-10 shadow-sm">
      {/* Location Display */}
      <button
        onClick={onLocationClick}
        className="flex items-center gap-2 text-sm mb-3 tap-highlight-none"
      >
        <svg
          className="w-4 h-4 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-ink font-medium">
          {loading
            ? 'Detecting location...'
            : permissionDenied
            ? 'Set your location'
            : `Items near ${city || 'you'}`}
        </span>
        <svg className="w-3 h-3 text-muted" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Feed Mode Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onModeChange(tab.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all tap-highlight-none ${
              feedMode === tab.id
                ? 'bg-ink text-surface shadow-sm'
                : 'bg-ink/5 text-muted hover:bg-ink/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
