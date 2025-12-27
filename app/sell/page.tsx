'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CameraCapture } from '@/components/sell/CameraCapture'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { blobToBase64 } from '@/lib/image'

export default function SellPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleCapture = async (imageBlob: Blob, imageUrl: string) => {
    setUploading(true)
    setError(null)

    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to auth, then come back
        localStorage.setItem('pendingImage', imageUrl)
        localStorage.setItem('pendingImageBlob', await blobToDataUrl(imageBlob))
        router.push('/auth?redirect=/sell')
        return
      }

      // Upload image to Supabase Storage
      const fileName = `${user.id}/${Date.now()}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      // Analyze image with Claude Vision
      const base64Image = await blobToBase64(imageBlob)
      const analysisResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Image }),
      })

      const aiSuggestions = await analysisResponse.json()

      // Store in session storage and navigate to confirm page
      sessionStorage.setItem('newProduct', JSON.stringify({
        imageUrl: publicUrl,
        ...aiSuggestions,
      }))

      router.push('/sell/confirm')
    } catch (err) {
      console.error('Upload failed:', err)
      setError('Failed to process image. Please try again.')
      setUploading(false)
    }
  }

  const handleError = (err: Error) => {
    setError(err.message)
  }

  // Helper to convert blob to data URL
  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  if (uploading) {
    return (
      <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-surface mt-4 animate-pulse-subtle">
          Processing your photo...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-surface flex flex-col items-center justify-center p-6">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="text-accent underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return <CameraCapture onCapture={handleCapture} onError={handleError} />
}
