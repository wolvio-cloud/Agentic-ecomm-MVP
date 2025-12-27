'use client'

import { useCallback, useState } from 'react'
import { FeedContainer } from '@/components/feed/FeedContainer'
import { LocationBar } from '@/components/feed/LocationBar'
import { useProducts } from '@/hooks/useProducts'
import { useLocation } from '@/hooks/useLocation'
import { createClient } from '@/lib/supabase/client'
import type { FeedMode } from '@/types'

export const dynamic = 'force-dynamic'

export default function FeedPage() {
  const location = useLocation()
  const [feedMode, setFeedMode] = useState<FeedMode>('nearby')

  const { products, loading, error, hasMore, loadMore, refresh } = useProducts({
    limit: 10,
    mode: feedMode,
    latitude: location.latitude,
    longitude: location.longitude,
  })

  const supabase = createClient()

  const handleView = useCallback(async (productId: string) => {
    try {
      // Increment view count
      await supabase.rpc('increment_product_views', { product_id: productId } as any)
    } catch (err) {
      console.error('Failed to track view:', err)
    }
  }, [supabase])

  const handleWhatsAppClick = useCallback(async (productId: string) => {
    try {
      // Increment WhatsApp click count
      await supabase.rpc('increment_whatsapp_clicks', { product_id: productId } as any)
    } catch (err) {
      console.error('Failed to track WhatsApp click:', err)
    }
  }, [supabase])

  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <LocationBar
        city={location.city}
        loading={location.loading}
        permissionDenied={location.permissionDenied}
        feedMode={feedMode}
        onModeChange={setFeedMode}
        onLocationClick={() => location.refresh()}
      />
      <div className="flex-1 overflow-hidden">
        <FeedContainer
          products={products}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onView={handleView}
          onWhatsAppClick={handleWhatsAppClick}
        />
      </div>
    </main>
  )
}
