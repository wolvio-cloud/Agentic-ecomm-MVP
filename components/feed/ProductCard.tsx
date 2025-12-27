'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ContactButton } from './ContactButton'
import { SellerBadge } from '@/components/seller/SellerBadge'
import { formatPrice } from '@/lib/currency'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  sellerPhone: string
  onView: (productId: string) => void
  onWhatsAppClick: (productId: string) => void
  onContact?: (productId: string, channel: 'whatsapp' | 'sms' | 'copy') => void
}

export function ProductCard({
  product,
  sellerPhone,
  onView,
  onWhatsAppClick,
  onContact,
}: ProductCardProps) {
  useEffect(() => {
    // Track view when card is mounted
    onView(product.id)
  }, [product.id, onView])

  const location = [product.city, product.region].filter(Boolean).join(', ')

  const handleContact = (channel: 'whatsapp' | 'sms' | 'copy') => {
    if (channel === 'whatsapp') {
      onWhatsAppClick(product.id)
    }
    onContact?.(product.id, channel)
  }

  return (
    <div className="relative h-screen w-screen bg-ink snap-start">
      {/* Product Image */}
      <div className="absolute inset-0">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/80" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 safe-area-inset">
        {/* Top: Price + Verified Badge */}
        <div className="mt-6 flex items-start justify-between">
          <div className="inline-block bg-surface/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
            <p className="text-4xl font-mono font-bold text-ink">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          {product.seller_verified && (
            <div className="bg-surface/95 backdrop-blur-sm px-3 py-2 rounded-full">
              <SellerBadge
                verified={product.seller_verified}
                listingCount={product.seller_listings}
                compact
              />
            </div>
          )}
        </div>

        {/* Bottom: Info + CTA */}
        <div className="space-y-4">
          {/* Seller Trust Signal */}
          <SellerBadge
            verified={product.seller_verified || false}
            listingCount={product.seller_listings || 0}
            className="text-surface/90"
          />

          {/* Product Info */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface line-clamp-2">
              {product.title}
            </h2>

            <div className="flex items-center gap-3 text-sm text-surface/80">
              {product.category && (
                <>
                  <span>{product.category}</span>
                  <span>•</span>
                </>
              )}
              {product.color && (
                <>
                  <span>{product.color}</span>
                  {product.size && <span>•</span>}
                </>
              )}
              {product.size && <span>{product.size}</span>}
            </div>

            {location && (
              <div className="flex items-center gap-2 text-sm text-surface/60">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Multi-Channel Contact */}
          <ContactButton
            phone={sellerPhone || product.seller_phone || ''}
            countryCode={product.seller_country_code}
            productTitle={product.title}
            productId={product.id}
            price={formatPrice(product.price, product.currency)}
            onContact={handleContact}
          />
        </div>
      </div>
    </div>
  )
}
