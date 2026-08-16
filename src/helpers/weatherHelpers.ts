import type { ForecastEntry } from '../hooks/useWeather'
import { CountryCodes } from '../CountryCodes'

export const getCountryName = (code: string) =>
  CountryCodes.find((c) => c.alpha2 === code.toLowerCase())?.name ?? code

export const iconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`

export const dateBuilder = (d: Date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export const formatHour = (dt: number, timezone: number) => {
  const localMs = (dt + timezone) * 1000
  const date = new Date(localMs)
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatDay = (dtTxt: string) =>
  new Date(dtTxt).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })

export const getTodayRange = (forecast: ForecastEntry[], weatherDt: number, timezone: number) => {
  const todayUtc = new Date((weatherDt + timezone) * 1000)
  const todayStr = `${todayUtc.getUTCFullYear()}-${String(todayUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(todayUtc.getUTCDate()).padStart(2, '0')}`
  const todayEntries = forecast.filter((e) => e.dt_txt.startsWith(todayStr))
  if (todayEntries.length === 0) return null
  return {
    temp_max: Math.max(...todayEntries.map((e) => e.main.temp)),
    temp_min: Math.min(...todayEntries.map((e) => e.main.temp)),
    todayStr,
  }
}

export const getDailyEntries = (forecast: ForecastEntry[]) => {
  const byDay = forecast
    .reduce<Record<string, ForecastEntry[]>>((acc, entry) => {
    const day = entry.dt_txt.split(' ')[0]
    if (!acc[day]) acc[day] = []
    acc[day].push(entry)
    return acc
  }, {})

  return Object.entries(byDay).map(([, entries]) => {
    const midday =
      entries.find((e) => e.dt_txt.includes('12:00:00')) ?? entries[Math.floor(entries.length / 2)]
    return {
      ...midday,
      main: {
        ...midday.main,
        temp_max: Math.max(...entries.map((e) => e.main.temp)),
        temp_min: Math.min(...entries.map((e) => e.main.temp)),
      },
    }
  })
}
