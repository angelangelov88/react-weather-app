import { useState, useCallback, useEffect } from 'react'
import type { GeoCity } from './useWeather'

const API_KEY = import.meta.env.VITE_API_KEY as string
const BASE = import.meta.env.VITE_BASE as string

export const useNearby = () => {
  const [nearbyCities, setNearbyCities] = useState<GeoCity[]>([])

  const fetchNearbyCities = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `${BASE}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`
      )
      if (!res.ok) return
      const cities = (await res.json()) as GeoCity[]
      setNearbyCities(cities)
    } catch {
      // silently fail — nearby cities are optional
    }
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      fetchNearbyCities(coords.latitude, coords.longitude)
    })
  }, [fetchNearbyCities])

  return nearbyCities
}
