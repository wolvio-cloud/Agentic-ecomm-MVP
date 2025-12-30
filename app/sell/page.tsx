'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CaptureChoice } from '@/components/sell/CaptureChoice'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const dynamic = 'force-dynamic'

export default function SellPage() {
  const router = useRouter()
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCapture = async (imageBase64: string, source: 'camera' | 'gallery') => {
    setAnalyzing(true)
    setError(null)

    try {
      // Extract base64 data (remove data URL prefix if present)
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')

      // Analyze image with Claude Vision (max 3 seconds)
      const analysisResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64Data }),
      })

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze image')
      }

      const aiData = await analysisResponse.json()

      // Store capture data for next page
      sessionStorage.setItem(
        'snapSell_capture',
        JSON.stringify({
          imageUrl: imageBase64, // Keep as base64 for now, will upload on final submit
          title: aiData.title,
          category: aiData.category,
          color: aiData.color,
          size: aiData.size,
          material: aiData.material,
          condition: aiData.condition,
          suggestedPrice: aiData.suggestedPrice,
        })
      )

      // Navigate to price page
      router.push('/sell/price')
    } catch (err) {
      console.error('Analysis failed:', err)
      setError('Failed to analyze image. Please try again.')
      setAnalyzing(false)
    }
  }

  if (analyzing) {
    return (
      <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="text-surface mt-4 animate-pulse">Analyzing image...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-surface flex flex-col items-center justify-center p-6">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button onClick={() => setError(null)} className="text-accent underline">
          Try again
        </button>
      </div>
    )
  }

  return <CaptureChoice onCapture={handleCapture} />
}
