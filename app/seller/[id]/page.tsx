'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/currency'
import Image from 'next/image'
import { SellerBadge } from '@/components/seller/SellerBadge'

export const dynamic = 'force-dynamic'

interface Seller {
  id: string
  phone_verified: boolean
  city: string | null
  region: string | null
  created_at: string
  total_contacts: number
  total_listings: number
}

interface Product {
  id: string
  title: string
  price: number
  currency: string
  image_url: string
  status: string
  created_at: string
}

export default function SellerPage() {
  const params = useParams()
  const router = useRouter()
  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    listings: 0,
    memberSince: '',
    responseLabel: '', // GUARDRAIL 2: Qualitative only
  })

  useEffect(() => {
    fetchSellerData()
  }, [params.id])

  const fetchSellerData = async () => {
    const supabase = createClient()

    // Fetch seller info
    const { data: sellerData } = await supabase
      .from('users')
      .select('id, phone_verified, city, region, created_at, total_contacts, total_listings')
      .eq('id', params.id)
      .single()

    if (sellerData) {
      setSeller(sellerData as any)

      // Calculate member since
      const memberDate = new Date((sellerData as any).created_at)
      const now = new Date()
      const months = Math.floor(
        (now.getTime() - memberDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )
      const memberSince =
        months < 1
          ? 'New member'
          : months === 1
            ? '1 month'
            : months < 12
              ? `${months} months`
              : `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''}`

      // GUARDRAIL 2: Response rate is UI-silent
      // Only show qualitative labels, never percentages
      let responseLabel = ''
      const totalContacts = (sellerData as any).total_contacts || 0
      const responseRate = totalContacts > 0 ? 0.7 : 0 // Placeholder - need actual tracking
      if (totalContacts < 5) {
        responseLabel = 'New seller'
      } else if (responseRate >= 0.5) {
        responseLabel = 'Usually responds'
      }
      // If neither condition met, show nothing (silence is neutral)

      setStats((prev) => ({ ...prev, memberSince, responseLabel }))
    }

    // Fetch seller's products
    const { data: productsData } = await supabase
      .from('products')
      .select('id, title, price, currency, image_url, status, created_at')
      .eq('seller_id', params.id)
      .eq('status', 'live')
      .order('created_at', { ascending: false })

    if (productsData) {
      setProducts(productsData as any)
      setStats((prev) => ({ ...prev, listings: productsData.length }))
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <p className="text-muted">Seller not found</p>
        <button onClick={() => router.back()} className="mt-4 text-accent">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header - GUARDRAIL 4: Say "Seller" not "Shop" */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-ink">
          <ArrowLeft className="w-5 h-5" />
          <span>Seller</span>
        </button>
      </header>

      {/* Seller Info - GUARDRAIL 4: Minimal, no branding */}
      <div className="px-4 py-6 border-b bg-white">
        {/* Verified badge only if verified */}
        {seller.phone_verified && (
          <div className="mb-3">
            <SellerBadge verified={seller.phone_verified} listingCount={0} compact={false} />
          </div>
        )}

        {/* Basic stats only - no bio, no branding, no banner */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {seller.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {seller.city}
              {seller.region ? `, ${seller.region}` : ''}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            {stats.listings} listing{stats.listings !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {stats.memberSince}
          </span>
          {/* GUARDRAIL 2: Qualitative response label only */}
          {stats.responseLabel && <span className="text-muted">• {stats.responseLabel}</span>}
        </div>

        {/* ❌ NO: Follow button, Shop name, Banner, Bio, Branding */}
      </div>

      {/* Products Grid - Just items, nothing else */}
      <div className="p-4">
        {products.length === 0 ? (
          <div className="text-center py-12 text-muted">No active listings</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-ink line-clamp-2 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold font-mono text-ink">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ❌ NO: "Follow this seller", "More from this shop", Store policies */}
    </div>
  )
}
