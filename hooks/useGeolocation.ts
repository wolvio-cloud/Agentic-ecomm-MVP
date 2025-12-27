import { useState, useEffect } from 'react'
import type { GeolocationData } from '@/types'

/**
 * Hook to get user's geolocation (city, region, country)
 * Uses browser geolocation API + reverse geocoding
 */
export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationData>({
    city: null,
    region: null,
    country: 'India',
    country_code: 'IN',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    setLoading(true)
    setError(null)

    // First try HTML5 Geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode using OpenStreetMap Nominatim (free, no API key)
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            const data = await response.json()

            setLocation({
              city: data.address?.city || data.address?.town || data.address?.village || null,
              region: data.address?.state || null,
              country: data.address?.country || 'India',
              country_code: data.address?.country_code?.toUpperCase() || 'IN',
            })
          } catch (err) {
            console.error('Reverse geocoding failed:', err)
            // Fallback to default India location
            setLocation({
              city: null,
              region: null,
              country: 'India',
              country_code: 'IN',
            })
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          console.error('Geolocation error:', err)
          setError('Location access denied')
          setLoading(false)
          // Fallback to default
          setLocation({
            city: null,
            region: null,
            country: 'India',
            country_code: 'IN',
          })
        }
      )
    } else {
      setError('Geolocation not supported')
      setLoading(false)
    }
  }

  return { location, loading, error, refetch: getLocation }
}
