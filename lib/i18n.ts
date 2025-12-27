type Locale = 'en' | 'ta' | 'hi'

type Messages = {
  [key: string]: string
}

const messages: Record<Locale, Messages> = {
  en: {
    'camera.hint': 'Take a photo to sell',
    'camera.fallback': 'Choose from gallery',
    'confirm.price': 'Your price',
    'confirm.quantity': 'Quantity',
    'confirm.golive': 'GO LIVE',
    'confirm.countdown': 'Live in ~10 seconds',
    'confirm.editing': 'You can edit these',
    'confirm.ai_suggested': 'AI suggested',
    'success.title': 'Your item is live!',
    'success.share': 'Share',
    'success.sell_another': 'Sell another',
    'feed.buy': 'Buy on WhatsApp',
    'feed.empty': 'No items nearby. Check back soon!',
    'feed.loading': 'Loading...',
    'auth.title': 'Welcome to SnapSell',
    'auth.subtitle': 'Sell in 30 seconds',
    'auth.phone': 'Phone number',
    'auth.send_otp': 'Send code',
    'auth.verify_otp': 'Enter code',
    'auth.verify': 'Verify',
    'auth.resend': 'Resend code',
    'category.clothing': 'Clothing',
    'category.electronics': 'Electronics',
    'category.home': 'Home',
    'category.accessories': 'Accessories',
    'category.textiles': 'Textiles',
    'category.crafts': 'Crafts',
    'category.other': 'Other',
  },
  ta: {
    'camera.hint': 'விற்க ஒரு புகைப்படம் எடுங்கள்',
    'camera.fallback': 'கேலரியில் இருந்து தேர்வு செய்க',
    'confirm.price': 'உங்கள் விலை',
    'confirm.quantity': 'அளவு',
    'confirm.golive': 'நேரலைக்கு செல்',
    'confirm.countdown': '~10 வினாடிகளில் நேரலை',
    'confirm.editing': 'இவற்றை திருத்தலாம்',
    'confirm.ai_suggested': 'AI பரிந்துரை',
    'success.title': 'உங்கள் பொருள் நேரலையில் உள்ளது!',
    'success.share': 'பகிர்',
    'success.sell_another': 'மற்றொன்றை விற்க',
    'feed.buy': 'WhatsApp-ல் வாங்கு',
    'feed.empty': 'அருகில் பொருட்கள் இல்லை. விரைவில் பாருங்கள்!',
    'feed.loading': 'ஏற்றுகிறது...',
    'auth.title': 'SnapSell-க்கு வரவேற்கிறோம்',
    'auth.subtitle': '30 வினாடிகளில் விற்க',
    'auth.phone': 'தொலைபேசி எண்',
    'auth.send_otp': 'குறியீட்டை அனுப்பு',
    'auth.verify_otp': 'குறியீட்டை உள்ளிடவும்',
    'auth.verify': 'சரிபார்',
    'auth.resend': 'மீண்டும் அனுப்பு',
    'category.clothing': 'உடைகள்',
    'category.electronics': 'மின்னணுவியல்',
    'category.home': 'வீடு',
    'category.accessories': 'துணைக்கருவிகள்',
    'category.textiles': 'ஜவுளி',
    'category.crafts': 'கைவினைப்பொருட்கள்',
    'category.other': 'மற்றவை',
  },
  hi: {
    'camera.hint': 'बेचने के लिए फोटो लें',
    'camera.fallback': 'गैलरी से चुनें',
    'confirm.price': 'आपकी कीमत',
    'confirm.quantity': 'मात्रा',
    'confirm.golive': 'लाइव करें',
    'confirm.countdown': '~10 सेकंड में लाइव',
    'confirm.editing': 'आप इन्हें संपादित कर सकते हैं',
    'confirm.ai_suggested': 'AI सुझाव',
    'success.title': 'आपका आइटम लाइव है!',
    'success.share': 'साझा करें',
    'success.sell_another': 'एक और बेचें',
    'feed.buy': 'WhatsApp पर खरीदें',
    'feed.empty': 'आस-पास कोई आइटम नहीं। जल्द ही देखें!',
    'feed.loading': 'लोड हो रहा है...',
    'auth.title': 'SnapSell में आपका स्वागत है',
    'auth.subtitle': '30 सेकंड में बेचें',
    'auth.phone': 'फोन नंबर',
    'auth.send_otp': 'कोड भेजें',
    'auth.verify_otp': 'कोड दर्ज करें',
    'auth.verify': 'सत्यापित करें',
    'auth.resend': 'फिर से भेजें',
    'category.clothing': 'कपड़े',
    'category.electronics': 'इलेक्ट्रॉनिक्स',
    'category.home': 'घर',
    'category.accessories': 'सहायक उपकरण',
    'category.textiles': 'वस्त्र',
    'category.crafts': 'शिल्प',
    'category.other': 'अन्य',
  },
}

/**
 * Gets the browser's locale and maps to supported locale
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const browserLang = navigator.language.split('-')[0]

  if (browserLang === 'ta') return 'ta'
  if (browserLang === 'hi') return 'hi'
  return 'en'
}

/**
 * Translates a message key to the current locale
 */
export function t(key: string, locale?: Locale): string {
  const currentLocale = locale || getBrowserLocale()
  return messages[currentLocale][key] || messages.en[key] || key
}

/**
 * Hook for using translations in components
 */
export function useTranslations(locale?: Locale) {
  const currentLocale = locale || getBrowserLocale()

  return {
    t: (key: string) => t(key, currentLocale),
    locale: currentLocale,
  }
}
