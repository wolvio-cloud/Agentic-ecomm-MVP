'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { WhatsAppButton } from './WhatsAppButton'
import { formatPrice } from '@/lib/currency'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  sellerPhone: string
  onView: (productId: string) => void
  onWhatsAppClick: (productId: string) => void
}

export function ProductCard({
  product,
  sellerPhone,
  onView,
  onWhatsAppClick,
}: ProductCardProps) {
  useEffect(() => {
    // Track view when card is mounted
    onView(product.id)
  }, [product.id, onView])

  const location = [product.city, product.region].filter(Boolean).join(', ')

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
        {/* Top: Price */}
        <div className="mt-6">
          <div className="inline-block bg-surface/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
            <p className="text-4xl font-mono font-bold text-ink">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
        </div>

        {/* Bottom: Info + CTA */}
        <div className="space-y-4">
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

          {/* WhatsApp CTA */}
          <WhatsAppButton
            product={product}
            sellerPhone={sellerPhone}
            onClick={() => onWhatsAppClick(product.id)}
          />
        </div>
      </div>
    </div>
  )
}
