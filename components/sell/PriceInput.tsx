'use client'

import { useTranslations } from '@/lib/i18n'

interface PriceInputProps {
  value: number | null
  currency: string
  onChange: (value: number) => void
  error?: string
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function PriceInput({ value, currency, onChange, error }: PriceInputProps) {
  const { t } = useTranslations()
  const symbol = CURRENCY_SYMBOLS[currency] || currency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(numValue)) {
      onChange(Math.min(numValue, 1000000)) // Max 10 lakh
    } else {
      onChange(0)
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted mb-3">
        {t('confirm.price')}
      </label>

      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-5xl font-mono text-ink">
          {symbol}
        </div>

        <input
          type="tel"
          inputMode="numeric"
          value={value || ''}
          onChange={handleChange}
          placeholder="0"
          className={`
            w-full h-24 pl-20 pr-6 rounded-3xl
            border-2 bg-surface
            text-5xl font-mono text-ink placeholder:text-muted/30
            focus:outline-none focus:ring-4 focus:ring-accent/20
            transition-all tap-highlight-none
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-ink/10 focus:border-accent'}
          `}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {value && value > 0 && (
        <div className="mt-2 text-xs text-muted text-right">
          Min: {symbol}1 • Max: {symbol}10,00,000
        </div>
      )}
    </div>
  )
}
