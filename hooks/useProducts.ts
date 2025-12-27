import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product, FeedMode } from '@/types'

interface UseProductsOptions {
  limit?: number
  mode?: FeedMode
  latitude?: number | null
  longitude?: number | null
}

export function useProducts(options: UseProductsOptions = {}) {
  const { limit = 10, mode = 'global', latitude, longitude } = options
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const supabase = createClient()

  const fetchProducts = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)

      // Use products_with_seller view for trust signals
      let query = supabase
        .from('products_with_seller' as any)
        .select('*')
        .eq('status', 'live')

      // Apply location filtering based on mode
      if (mode === 'nearby' && latitude && longitude) {
        // For nearby mode, we'd use RPC function but for simplicity fallback to all for now
        // In production, call get_nearby_products() RPC
        query = query.order('created_at', { ascending: false })
      } else if (mode === 'national') {
        // National: Filter by country (India)
        query = query.eq('country_code', 'IN').order('created_at', { ascending: false })
      } else {
        // Global: Show all
        query = query.order('created_at', { ascending: false })
      }

      query = query.range(pageNum * limit, (pageNum + 1) * limit - 1)

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      if (data) {
        setProducts((prev) => (pageNum === 0 ? data : [...prev, ...data]))
        setHasMore(data.length === limit)
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
    setProducts([])
    fetchProducts(0)
  }, [mode, latitude, longitude])

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchProducts(nextPage)
    }
  }

  const refresh = () => {
    setPage(0)
    setProducts([])
    fetchProducts(0)
  }

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}
