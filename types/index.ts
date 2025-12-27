export interface User {
  id: string
  phone: string
  phone_verified: boolean
  country_code: string
  city: string | null
  region: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  seller_id: string
  image_url: string
  image_blurhash: string | null
  title: string
  category: string | null
  color: string | null
  size: string | null
  price: number
  currency: string
  quantity: number
  city: string | null
  region: string | null
  country: string
  country_code: string
  status: 'live' | 'sold' | 'expired' | 'deleted'
  expires_at: string
  views: number
  whatsapp_clicks: number
  created_at: string
  updated_at: string
  seller?: User
}

export interface AIAnalysisResult {
  title: string
  category: string
  color: string | null
  size: string | null
  confidence: number
}

export interface ProductFormData {
  image_url: string
  image_blob?: Blob
  title: string
  category: string | null
  color: string | null
  size: string | null
  price: number | null
  quantity: number
  city: string | null
  region: string | null
}

export type ProductCategory =
  | 'Clothing'
  | 'Electronics'
  | 'Home'
  | 'Accessories'
  | 'Textiles'
  | 'Crafts'
  | 'Other'

export interface GeolocationData {
  city: string | null
  region: string | null
  country: string
  country_code: string
}

export type AnalyticsEvent =
  | { event: 'listing_started' }
  | { event: 'listing_completed'; productId: string; timeSeconds: number }
  | { event: 'listing_abandoned'; step: 'camera' | 'confirm' }
  | { event: 'feed_view'; productId: string }
  | { event: 'whatsapp_click'; productId: string }
  | { event: 'listing_renewed'; productId: string }
  | { event: 'listing_sold'; productId: string }
