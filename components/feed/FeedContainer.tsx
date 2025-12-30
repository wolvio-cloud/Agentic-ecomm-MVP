'use client'

import { useEffect, useRef, useCallback } from 'react'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useTranslations } from '@/lib/i18n'
import type { Product } from '@/types'

interface FeedContainerProps {
  products: Product[]
  loading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
  onView: (productId: string) => void
  onWhatsAppClick: (productId: string) => void
  onContact?: (productId: string, channel: 'whatsapp' | 'sms' | 'copy') => void
}

export function FeedContainer({
  products,
  loading,
  error,
  hasMore,
  onLoadMore,
  onView,
  onWhatsAppClick,
  onContact,
}: FeedContainerProps) {
  const { t } = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastProductRef = useRef<HTMLDivElement>(null)

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [hasMore, loading, onLoadMore]
  )

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    }

    observerRef.current = new IntersectionObserver(handleObserver, option)

    if (lastProductRef.current) {
      observerRef.current.observe(lastProductRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-surface">
        <div className="text-center">
          <p className="text-ink text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-accent underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-surface">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-ink text-lg">{t('feed.empty')}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      {products.map((product, index) => {
        const isLastProduct = index === products.length - 1

        return (
          <div
            key={product.id}
            ref={isLastProduct ? lastProductRef : null}
          >
            <ProductCard
              product={product}
              sellerPhone={product.seller?.phone || ''}
              onView={onView}
              onWhatsAppClick={onWhatsAppClick}
              onContact={onContact}
            />
          </div>
        )
      })}

      {loading && (
        <div className="h-screen flex items-center justify-center bg-surface">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}
