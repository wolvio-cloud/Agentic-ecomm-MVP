'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useTranslations } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslations()
  const productId = searchParams.get('id')

  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/feed` // For MVP, share feed URL

  const handleShare = async () => {
    const shareText = `Check out my listing on SnapSell!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SnapSell',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled share
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      {/* Success Icon */}
      <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6 animate-fade-up">
        <svg
          className="w-12 h-12 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Message */}
      <h1 className="text-3xl font-bold text-ink mb-2 text-center animate-fade-up">
        {t('success.title')}
      </h1>

      <p className="text-muted text-center mb-8 max-w-sm animate-fade-up">
        Buyers can now see your item in the feed. They'll contact you on WhatsApp when interested.
      </p>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3 animate-fade-up">
        <Button
          onClick={handleShare}
          variant="secondary"
          size="lg"
        >
          {copied ? 'Link copied!' : t('success.share')}
        </Button>

        <Link href="/sell" className="block">
          <Button variant="primary" size="lg">
            {t('success.sell_another')}
          </Button>
        </Link>

        <Link href="/feed" className="block text-center">
          <button className="text-muted hover:text-ink transition-colors py-2">
            View in feed
          </button>
        </Link>
      </div>

      {/* Confetti Effect (optional enhancement) */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Simple celebration particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent rounded-full animate-fade-up opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
