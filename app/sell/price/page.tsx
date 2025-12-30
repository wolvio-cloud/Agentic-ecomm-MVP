'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Edit2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function PricePage() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [price, setPrice] = useState<string>('')
  const [priceGuidance, setPriceGuidance] = useState<{ min: number; max: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [aiData, setAiData] = useState<any>(null)

  useEffect(() => {
    // Get data from previous step (stored in sessionStorage)
    const captureData = sessionStorage.getItem('snapSell_capture')
    if (captureData) {
      const data = JSON.parse(captureData)
      setImageUrl(data.imageUrl)
      setTitle(data.title || '')
      setPriceGuidance(data.suggestedPrice || null)
      setAiData(data)

      // If no title, auto-enter edit mode
      if (!data.title) {
        setIsEditingTitle(true)
      }
    } else {
      // No capture data, redirect to camera
      router.push('/sell')
    }
  }, [router])

  const handlePriceChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '')
    setPrice(numericValue)
  }

  const handleGoLive = async () => {
    if (!price || parseInt(price) < 10) {
      alert('Please enter a price (minimum ₹10)')
      return
    }

    if (!title.trim()) {
      setIsEditingTitle(true)
      alert('Please add a title for your item')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Store current state and redirect to auth
        router.push('/auth?redirect=/sell/price')
        return
      }

      // Get user's location from cache or default
      const location = JSON.parse(localStorage.getItem('snapsell_location') || '{}')

      // Upload image to storage first
      const imageBlob = await fetch(imageUrl).then((r) => r.blob())
      const fileName = `${user.id}/${Date.now()}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageBlob, { contentType: 'image/jpeg' })

      if (uploadError) throw uploadError

      const publicUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl

      // Create product with minimal data (instant live)
      const { data: product, error } = await (supabase.from('products') as any).insert({
        seller_id: user.id,
        title: title.trim(),
        price: parseInt(price),
        currency: 'INR',
        quantity: 1,
        image_url: publicUrl,
        status: 'live',
        city: location.city || 'Unknown',
        region: location.region || null,
        country: location.country || 'India',
        country_code: location.country_code || 'IN',
        // Store AI data for later use
        category: aiData?.category || null,
        color: aiData?.color || null,
        size: aiData?.size || null,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
        .select()
        .single()

      if (error) throw error

      // Clear capture data
      sessionStorage.removeItem('snapSell_capture')

      // Navigate to success page
      router.push(`/sell/success?id=${product.id}`)
    } catch (error) {
      console.error('Failed to create listing:', error)
      alert('Failed to create listing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (value: string) => {
    if (!value) return ''
    return parseInt(value).toLocaleString('en-IN')
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-ink">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Image Preview */}
        {imageUrl && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden mb-6">
            <Image src={imageUrl} alt="Product" fill className="object-cover" />
          </div>
        )}

        {/* Title (AI-generated, editable) */}
        <div className="mb-6">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => title.trim() && setIsEditingTitle(false)}
              placeholder="What are you selling?"
              className="w-full text-lg font-medium bg-transparent border-b-2 border-accent
                         focus:outline-none pb-1 text-ink"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 text-lg font-medium hover:text-accent
                         transition-colors w-full text-left text-ink"
            >
              <span className="flex-1">{title || 'Tap to add title'}</span>
              <Edit2 className="w-4 h-4 text-muted" />
            </button>
          )}
          {!title && (
            <p className="text-sm text-red-600 mt-1">Title is required</p>
          )}
        </div>

        {/* Price Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-ink">Your Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-ink">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={formatPrice(price)}
              onChange={(e) => handlePriceChange(e.target.value.replace(/,/g, ''))}
              placeholder="0"
              className="w-full text-3xl font-bold pl-12 pr-4 py-4 border-2 rounded-xl
                         focus:outline-none focus:border-accent transition-colors bg-white text-ink"
            />
          </div>

          {/* Price Guidance */}
          {priceGuidance && (
            <p className="flex items-center gap-1 text-sm text-muted mt-2">
              <Sparkles className="w-4 h-4" />
              Similar items: ₹{priceGuidance.min.toLocaleString('en-IN')} - ₹
              {priceGuidance.max.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {/* GO LIVE Button */}
        <button
          onClick={handleGoLive}
          disabled={isLoading || !price || !title}
          className="w-full py-4 bg-accent text-white font-semibold text-lg
                     rounded-xl disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-accent/90 transition-colors"
        >
          {isLoading ? 'Creating...' : '🚀 GO LIVE'}
        </button>

        <p className="text-center text-sm text-muted mt-4">
          Your item will be visible to buyers near you
        </p>
      </main>
    </div>
  )
}
