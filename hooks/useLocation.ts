'use client'

import { useState, useEffect } from 'react'
import type { LocationData } from '@/types'

/**
 * Hook for detecting user's location with caching
 * Uses browser geolocation + reverse geocoding
 * Caches result for 1 hour
 */
export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    city: null,
    region: null,
    loading: true,
    error: null,
    permissionDenied: false,
  })

  useEffect(() => {
    // Check for cached location first (1 hour TTL)
    const cached = localStorage.getItem('snapsell_location')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        // Use cache if less than 1 hour old
        if (Date.now() - parsed.timestamp < 3600000) {
          setLocation({ ...parsed, loading: false })
          return
        }
      } catch {
        localStorage.removeItem('snapsell_location')
      }
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: 'Geolocation not supported',
      }))
      return
    }

    // Request current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Reverse geocode to get city/region using free BigDataCloud API
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await response.json()

          const locationData: LocationData = {
            latitude,
            longitude,
            city: data.city || data.locality || 'Your Area',
            region: data.principalSubdivision || data.countryName,
            loading: false,
            error: null,
            permissionDenied: false,
          }

          // Cache location with timestamp
          localStorage.setItem(
            'snapsell_location',
            JSON.stringify({ ...locationData, timestamp: Date.now() })
          )

          setLocation(locationData)
        } catch (err) {
          // Fallback if reverse geocoding fails
          const fallbackData: LocationData = {
            latitude,
            longitude,
            city: 'Your Area',
            region: null,
            loading: false,
            error: null,
            permissionDenied: false,
          }

          localStorage.setItem(
            'snapsell_location',
            JSON.stringify({ ...fallbackData, timestamp: Date.now() })
          )

          setLocation(fallbackData)
        }
      },
      (error) => {
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          permissionDenied: error.code === error.PERMISSION_DENIED,
        }))
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    )
  }, [])

  const refresh = () => {
    localStorage.removeItem('snapsell_location')
    setLocation({
      latitude: null,
      longitude: null,
      city: null,
      region: null,
      loading: true,
      error: null,
      permissionDenied: false,
    })
    // Trigger re-run of useEffect
    window.location.reload()
  }

  return { ...location, refresh }
}
