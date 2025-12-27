import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

interface UseProductsOptions {
  limit?: number
  userLocation?: {
    country_code: string
    region: string | null
  }
}

export function useProducts(options: UseProductsOptions = {}) {
  const { limit = 10, userLocation } = options
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

      let query = supabase
        .from('products')
        .select(`
          *,
          seller:users!products_seller_id_fkey(phone, country_code)
        `)
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .range(pageNum * limit, (pageNum + 1) * limit - 1)

      // Prioritize same region if user location is available
      if (userLocation?.region) {
        // TODO: Implement location-based sorting
        // For now, just fetch in chronological order
      }

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
    fetchProducts(0)
  }, [])

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
