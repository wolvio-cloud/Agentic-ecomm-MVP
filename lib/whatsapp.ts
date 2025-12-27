import type { Product } from '@/types'

/**
 * Generates WhatsApp deep link with prefilled message
 * Works on both mobile (opens app) and desktop (opens web.whatsapp.com)
 */
export function generateWhatsAppLink(product: Product, sellerPhone: string): string {
  const message = `Hi! I'm interested in: ${product.title} (#${product.id.slice(0, 8)}). Is it available?`
  const encodedMessage = encodeURIComponent(message)

  // Remove any non-numeric characters from phone
  const cleanPhone = sellerPhone.replace(/[^0-9]/g, '')

  // Detect mobile vs desktop
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    // Mobile: Use WhatsApp app URL scheme
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`
  } else {
    // Desktop: Use WhatsApp Web
    return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`
  }
}

/**
 * Opens WhatsApp with the given link
 */
export function openWhatsApp(link: string) {
  window.open(link, '_blank')
}
