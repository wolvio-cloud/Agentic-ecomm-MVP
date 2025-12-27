export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          phone_verified: boolean
          country_code: string
          city: string | null
          region: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          phone_verified?: boolean
          country_code?: string
          city?: string | null
          region?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          phone_verified?: boolean
          country_code?: string
          city?: string | null
          region?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
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
        }
        Insert: {
          id?: string
          seller_id: string
          image_url: string
          image_blurhash?: string | null
          title: string
          category?: string | null
          color?: string | null
          size?: string | null
          price: number
          currency?: string
          quantity?: number
          city?: string | null
          region?: string | null
          country?: string
          country_code?: string
          status?: 'live' | 'sold' | 'expired' | 'deleted'
          expires_at?: string
          views?: number
          whatsapp_clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          image_url?: string
          image_blurhash?: string | null
          title?: string
          category?: string | null
          color?: string | null
          size?: string | null
          price?: number
          currency?: string
          quantity?: number
          city?: string | null
          region?: string | null
          country?: string
          country_code?: string
          status?: 'live' | 'sold' | 'expired' | 'deleted'
          expires_at?: string
          views?: number
          whatsapp_clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      expire_old_products: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_product_views: {
        Args: { product_id: string }
        Returns: undefined
      }
      increment_whatsapp_clicks: {
        Args: { product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
