'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/currency'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

type ItemStatus = 'live' | 'sold' | 'expired'

export default function MyItemsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<ItemStatus>('live')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  useEffect(() => {
    filterProducts()
  }, [products, activeTab])

  const checkAuth = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      router.push('/auth?redirect=/my-items')
      return
    }

    setUser(authUser)
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Classify products by status
      const now = new Date()
      const classifiedProducts = (data || []).map((product: any) => {
        const expiresAt = new Date(product.expires_at)
        const isExpired = expiresAt < now

        return {
          ...product,
          status: product.status === 'sold' ? 'sold' : isExpired ? 'expired' : 'live',
        }
      })

      setProducts(classifiedProducts as Product[])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    const filtered = products.filter((product) => product.status === activeTab)
    setFilteredProducts(filtered)
  }

  const handleRenew = async (productId: string) => {
    try {
      setActionLoading(productId)

      const { error } = await supabase.rpc('renew_listing' as any, {
        product_id: productId,
      } as any)

      if (error) {
        // Fallback if RPC function doesn't exist
        // First get current renewal count
        const { data: currentProduct } = await supabase
          .from('products')
          .select('renewal_count')
          .eq('id', productId)
          .single()

        const newExpiresAt = new Date()
        newExpiresAt.setDate(newExpiresAt.getDate() + 7)

        const { error: updateError } = await (supabase
          .from('products') as any)
          .update({
            expires_at: newExpiresAt.toISOString(),
            renewal_count: ((currentProduct as any)?.renewal_count || 0) + 1,
            status: 'live',
          })
          .eq('id', productId)

        if (updateError) throw updateError
      }

      // Refresh products
      await fetchProducts()
    } catch (err) {
      console.error('Failed to renew listing:', err)
      alert('Failed to renew listing. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAsSold = async (productId: string) => {
    try {
      setActionLoading(productId)

      const { error } = await (supabase
        .from('products') as any)
        .update({ status: 'sold' })
        .eq('id', productId)

      if (error) throw error

      // Refresh products
      await fetchProducts()
    } catch (err) {
      console.error('Failed to mark as sold:', err)
      alert('Failed to mark as sold. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
      return
    }

    try {
      setActionLoading(productId)

      const { error } = await supabase.from('products').delete().eq('id', productId)

      if (error) throw error

      // Refresh products
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete listing:', err)
      alert('Failed to delete listing. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()

    if (diff < 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`
    return 'Expires soon'
  }

  const counts = {
    live: products.filter((p) => p.status === 'live').length,
    sold: products.filter((p) => p.status === 'sold').length,
    expired: products.filter((p) => p.status === 'expired').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted">Loading your items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <div className="bg-white border-b border-surface sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-ink">My Items</h1>
            <button
              onClick={() => router.push('/sell')}
              className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent/90"
            >
              + New Listing
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-surface sticky top-[73px] z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-6">
            {(['live', 'sold', 'expired'] as ItemStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {activeTab === 'live' && '📦'}
              {activeTab === 'sold' && '✅'}
              {activeTab === 'expired' && '⏰'}
            </div>
            <h2 className="text-xl font-semibold text-ink mb-2">
              No {activeTab} items
            </h2>
            <p className="text-muted mb-6">
              {activeTab === 'live' && "You don't have any active listings"}
              {activeTab === 'sold' && "You haven't sold anything yet"}
              {activeTab === 'expired' && 'No expired listings'}
            </p>
            {activeTab === 'live' && (
              <button
                onClick={() => router.push('/sell')}
                className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90"
              >
                Create Your First Listing
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface">
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink truncate">{product.title}</h3>
                    <p className="text-lg font-mono font-bold text-ink mt-1">
                      {formatPrice(product.price, product.currency)}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 mt-2 text-sm text-muted">
                      <span>👁 {product.views || 0} views</span>
                      <span>💬 {product.whatsapp_clicks || 0} contacts</span>
                    </div>

                    {/* Status */}
                    {activeTab === 'live' && (
                      <div className="mt-2">
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {getTimeRemaining(product.expires_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-surface p-4">
                  <div className="flex gap-2">
                    {activeTab === 'live' && (
                      <>
                        <button
                          onClick={() => handleMarkAsSold(product.id)}
                          disabled={actionLoading === product.id}
                          className="flex-1 bg-green-50 text-green-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-100 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === product.id ? 'Processing...' : 'Mark as Sold'}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={actionLoading === product.id}
                          className="flex-1 bg-red-50 text-red-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === product.id ? 'Processing...' : 'Delete'}
                        </button>
                      </>
                    )}

                    {activeTab === 'expired' && (
                      <>
                        <button
                          onClick={() => handleRenew(product.id)}
                          disabled={actionLoading === product.id}
                          className="flex-1 bg-accent text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === product.id ? 'Processing...' : 'Renew (7 days)'}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={actionLoading === product.id}
                          className="flex-1 bg-red-50 text-red-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === product.id ? 'Processing...' : 'Delete'}
                        </button>
                      </>
                    )}

                    {activeTab === 'sold' && (
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={actionLoading === product.id}
                        className="flex-1 bg-red-50 text-red-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === product.id ? 'Processing...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav Spacer */}
      <div className="h-20" />
    </div>
  )
}
