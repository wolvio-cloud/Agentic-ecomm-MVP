/**
 * Multi-channel contact utilities
 * Supports WhatsApp, SMS, and clipboard copy
 */

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)

  // Detect mobile vs desktop
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    // Mobile: Use WhatsApp app URL scheme
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`
  } else {
    // Desktop: Use WhatsApp Web
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }
}

export function generateSMSLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)

  // iOS uses & for body, Android uses ?
  // Both work with ?body= for compatibility
  return `sms:${cleanPhone}?body=${encodedMessage}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch {
      return false
    }
  }
}

export function formatPhoneForDisplay(phone: string, countryCode: string = '+91'): string {
  // Remove country code if present
  let cleaned = phone.replace(countryCode, '').replace(/\D/g, '')

  // Format as XXX XXX XXXX for Indian numbers
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone
}
