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

export const formatHour = (dtTxt: string) =>
  new Date(dtTxt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const formatDay = (dtTxt: string) =>
  new Date(dtTxt).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })

export const getDailyEntries = (forecast: ForecastEntry[]) => {
  const byDay = forecast.reduce<Record<string, ForecastEntry[]>>((acc, entry) => {
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
