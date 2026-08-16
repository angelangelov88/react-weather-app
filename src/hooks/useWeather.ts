import { useState, useCallback, useMemo } from 'react'

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
  weather: { main: string; icon: string }[]
  sys: {
    country: string
  }
}

export type ForecastEntry = {
  dt: number
  dt_txt: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: { main: string; description: string; icon: string }[]
  wind: {
    speed: number
  }
  pop: number
}

export type ForecastData = {
  list: ForecastEntry[]
}

export type View = 'idle' | 'weather' | 'error-notfound' | 'error-empty' | 'loading'

const API_KEY = import.meta.env.VITE_API_KEY as string
const BASE = import.meta.env.VITE_BASE as string

export { getCountryName } from '../helpers/weatherHelpers'

export const useWeather = () => {
  const [query, setQuery] = useState('')
  const [mainCity, setMainCity] = useState<GeoCity | null>(null)
  const [otherCities, setOtherCities] = useState<GeoCity[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastEntry[] | null>(null)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [view, setView] = useState<View>('idle')

  const bgClass = useMemo(() => {
    if (!weather) return 'app cold'
    if (weather.main.temp > 16) return 'app warm'
    if (weather.main.temp < 5) return 'app'
    return 'app cold'
  }, [weather])

  const fetchWeather = useCallback(async (city: GeoCity): Promise<WeatherData | null> => {
    const res = await fetch(
      `${BASE}/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`
    )
    if (!res.ok) throw new Error('Weather fetch failed')
    return res.json() as Promise<WeatherData>
  }, [])

  const handleSearch = useCallback(
    async (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key !== 'Enter') return
      if (!query.trim()) {
        setView('error-empty')
        return
      }
      setView('loading')
      try {
        const res = await fetch(`${BASE}/geo/1.0/direct?q=${query}&limit=10&appid=${API_KEY}`)
        const result: unknown = await res.json()
        const cities = Array.isArray(result) ? (result as GeoCity[]) : []
        setQuery('')
        if (cities.length === 0) {
          setView('error-notfound')
          return
        }
        setForecast(null)
        setOtherCities(cities.slice(1))
        setMainCity(cities[0])
        const weatherData = await fetchWeather(cities[0])
        if (weatherData) {
          setWeather(weatherData)
          setView('weather')
        }
      } catch {
        setView('error-notfound')
      }
    },
    [query, fetchWeather]
  )

  const handleCitySelect = useCallback(
    async (city: GeoCity) => {
      setView('loading')
      try {
        const weatherData = await fetchWeather(city)
        if (weatherData && mainCity) {
          setForecast(null)
          setOtherCities((prev) => [
            mainCity,
            ...prev.filter((c) => c.lat !== city.lat || c.lon !== city.lon),
          ])
          setMainCity(city)
          setWeather(weatherData)
          setView('weather')
        }
      } catch {
        setView('error-notfound')
      }
    },
    [fetchWeather, mainCity]
  )

  const handleForecastRequest = useCallback(async () => {
    if (!mainCity) return
    setForecastLoading(true)
    try {
      const res = await fetch(
        `${BASE}/data/2.5/forecast?lat=${mainCity.lat}&lon=${mainCity.lon}&units=metric&appid=${API_KEY}`
      )
      if (!res.ok) throw new Error('Forecast fetch failed')
      const data = (await res.json()) as ForecastData
      setForecast(data.list)
    } catch {
      // silently fail — button stays visible to retry
    } finally {
      setForecastLoading(false)
    }
  }, [mainCity])

  return {
    query,
    setQuery,
    otherCities,
    weather,
    forecast,
    forecastLoading,
    view,
    bgClass,
    handleSearch,
    handleCitySelect,
    handleForecastRequest,
    mainCityKey: mainCity ? `${mainCity.lat}-${mainCity.lon}` : '',
  }
}
