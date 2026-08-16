import { useState, useMemo } from 'react'
import { CountryCodes } from '../CountryCodes'

export type GeoCity = {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

export type WeatherData = {
  name: string
  main: {
    temp: number
    feels_like: number
  }
  weather: { main: string }[]
  sys: {
    country: string
  }
}

export type View = 'idle' | 'results' | 'weather' | 'error-notfound' | 'error-empty' | 'loading'

const API_KEY = import.meta.env.VITE_API_KEY as string
const BASE = import.meta.env.VITE_BASE as string

const getCountryName = (code: string) =>
  CountryCodes.find((c) => c.alpha2 === code.toLowerCase())?.name ?? code

export const useWeather = () => {
  const [query, setQuery] = useState('')
  const [otherCities, setOtherCities] = useState<GeoCity[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [view, setView] = useState<View>('idle')

  return useMemo(
    () => ({
      query,
      setQuery,
      otherCities,
      weather,
      view,
      getCountryName,
      getBgClass: () => {
        if (!weather || view !== 'weather') return 'app cold'
        if (weather.main.temp > 16) return 'app warm'
        if (weather.main.temp < 5) return 'app'
        return 'app cold'
      },
      handleSearch: async (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key !== 'Enter') return
        if (!query.trim()) {
          setView('error-empty')
          return
        }
        setView('loading')
        try {
          const res = await fetch(
            `${BASE}/geo/1.0/direct?q=${query}&limit=10&appid=${API_KEY}`
          )
          const result: unknown = await res.json()
          const cities = Array.isArray(result) ? (result as GeoCity[]) : []
          setQuery('')
          if (cities.length === 0) {
            setView('error-notfound')
            return
          }
          setOtherCities(cities.slice(1))
          setView('loading')
          const first = cities[0]
          const weatherRes = await fetch(
            `${BASE}/data/2.5/weather?lat=${first.lat}&lon=${first.lon}&units=metric&APPID=${API_KEY}`
          )
          if (!weatherRes.ok) throw new Error('Weather fetch failed')
          const weatherData: WeatherData = await weatherRes.json()
          setWeather(weatherData)
          setView('weather')
        } catch {
          setView('error-notfound')
        }
      },
      handleCitySelect: async (city: GeoCity) => {
        setOtherCities([])
        setView('loading')
        try {
          const res = await fetch(
            `${BASE}/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&APPID=${API_KEY}`
          )
          if (!res.ok) throw new Error('Weather fetch failed')
          const result: WeatherData = await res.json()
          setWeather(result)
          setView('weather')
        } catch {
          setView('error-notfound')
        }
      },
    }),
    [query, otherCities, weather, view]
  )
}
