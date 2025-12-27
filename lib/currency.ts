/**
 * Currency symbols mapping
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
}

/**
 * Formats price with currency symbol
 */
export function formatPrice(price: number, currency: string = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)

  return `${symbol}${formatted}`
}

/**
 * Formats price for display in buyer's locale
 * Shows original currency with conversion hint if different
 */
export function formatPriceForLocale(
  price: number,
  originalCurrency: string,
  locale?: string
): string {
  // For MVP, just show original currency
  // Future: Add currency conversion API
  return formatPrice(price, originalCurrency)
}
