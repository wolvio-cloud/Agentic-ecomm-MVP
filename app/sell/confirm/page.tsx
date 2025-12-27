'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AISuggestions } from '@/components/sell/AISuggestions'
import { PriceInput } from '@/components/sell/PriceInput'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useTranslations } from '@/lib/i18n'
import type { AIAnalysisResult, ProductFormData } from '@/types'

export default function ConfirmPage() {
  const router = useRouter()
  const { t } = useTranslations()
  const { location } = useGeolocation()
  const supabase = createClient()

  const [productData, setProductData] = useState<ProductFormData | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load product data from session storage
    const stored = sessionStorage.getItem('newProduct')
    if (!stored) {
      router.push('/sell')
      return
    }

    const data = JSON.parse(stored)
    setProductData({
      image_url: data.imageUrl,
      title: data.title,
      category: data.category,
      color: data.color,
      size: data.size,
      price: null,
      quantity: 1,
      city: location.city,
      region: location.region,
    })
  }, [router, location])

  const handleUpdate = (field: string, value: string) => {
    if (!productData) return
    setProductData({ ...productData, [field]: value })
  }

  const handleSubmit = async () => {
    if (!productData || !price) {
      setError('Please enter a price')
      return
    }

    if (price < 1 || price > 1000000) {
      setError('Price must be between ₹1 and ₹10,00,000')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth?redirect=/sell/confirm')
        return
      }

      // Insert product
      const { data: product, error: insertError } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          image_url: productData.image_url,
          title: productData.title,
          category: productData.category,
          color: productData.color,
          size: productData.size,
          price,
          currency: 'INR',
          quantity,
          city: productData.city || location.city,
          region: productData.region || location.region,
          country: location.country,
          country_code: location.country_code,
          status: 'live',
        } as any)
        .select()
        .single()

      if (insertError) throw insertError

      // Clear session storage
      sessionStorage.removeItem('newProduct')

      // Navigate to success page
      router.push(`/sell/success?id=${(product as any)?.id || 'new'}`)
    } catch (err) {
      console.error('Failed to create listing:', err)
      setError('Failed to publish listing. Please try again.')
      setSubmitting(false)
    }
  }

  if (!productData) {
    return (
      <div className="fixed inset-0 bg-surface flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  const aiSuggestions: AIAnalysisResult = {
    title: productData.title,
    category: productData.category || 'Other',
    color: productData.color,
    size: productData.size,
    confidence: 0.8,
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Image Preview */}
      <div className="relative h-64 w-full bg-ink">
        <Image
          src={productData.image_url}
          alt="Product preview"
          fill
          className="object-cover"
        />
      </div>

      {/* Form */}
      <div className="p-6 space-y-6 pb-32">
        {/* AI Suggestions */}
        <AISuggestions
          suggestions={aiSuggestions}
          onUpdate={handleUpdate}
        />

        {/* Price Input */}
        <PriceInput
          value={price}
          currency="INR"
          onChange={setPrice}
          error={error || undefined}
        />

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">
            {t('confirm.quantity')}
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center
                active:scale-95 transition-transform"
            >
              <span className="text-2xl text-ink">−</span>
            </button>
            <span className="text-2xl font-mono text-ink min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center
                active:scale-95 transition-transform"
            >
              <span className="text-2xl text-ink">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface border-t border-ink/10 safe-area-inset">
        <Button
          onClick={handleSubmit}
          loading={submitting}
          disabled={!price || price < 1}
          variant="primary"
          size="lg"
        >
          {t('confirm.golive')}
        </Button>
        {!submitting && (
          <p className="text-center text-xs text-muted mt-2">
            {t('confirm.countdown')}
          </p>
        )}
      </div>
    </div>
  )
}
