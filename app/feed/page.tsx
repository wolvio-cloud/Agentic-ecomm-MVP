'use client'

import { useCallback } from 'react'
import { FeedContainer } from '@/components/feed/FeedContainer'
import { useProducts } from '@/hooks/useProducts'
import { useGeolocation } from '@/hooks/useGeolocation'
import { createClient } from '@/lib/supabase/client'

export default function FeedPage() {
  const { location } = useGeolocation()
  const { products, loading, error, hasMore, loadMore, refresh } = useProducts({
    limit: 10,
    userLocation: {
      country_code: location.country_code,
      region: location.region,
    },
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
    <main className="h-screen overflow-hidden">
      <FeedContainer
        products={products}
        loading={loading}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onView={handleView}
        onWhatsAppClick={handleWhatsAppClick}
      />
    </main>
  )
}
