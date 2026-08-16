import { useState, useRef } from 'react'
import type { ForecastEntry, GeoCity, WeatherData } from '../hooks/useWeather'
import { getCountryName } from '../hooks/useWeather'

type Props = {
  weather: WeatherData
  today: string
  otherCities: GeoCity[]
  onCitySelect: (city: GeoCity) => void
  forecast: ForecastEntry[] | null
  forecastLoading: boolean
  onForecastRequest: () => void
}

const iconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`

const formatHour = (dtTxt: string) =>
  new Date(dtTxt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const formatDay = (dtTxt: string) =>
  new Date(dtTxt).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })

const getDailyEntries = (forecast: ForecastEntry[]) => {
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

const WeatherDisplay = ({
  weather,
  today,
  otherCities,
  onCitySelect,
  forecast,
  forecastLoading,
  onForecastRequest,
}: Props) => {
  const [showHourly, setShowHourly] = useState(false)
  const [showDaily, setShowDaily] = useState(false)
  const fetchInitiatedRef = useRef(false)

  const requestForecast = () => {
    if (!fetchInitiatedRef.current) {
      fetchInitiatedRef.current = true
      onForecastRequest()
    }
  }

  const handleHourlyToggle = () => {
    requestForecast()
    setShowHourly((prev) => !prev)
    setShowDaily(false)
  }

  const handleDailyToggle = () => {
    requestForecast()
    setShowDaily((prev) => !prev)
    setShowHourly(false)
  }

  return (
    <div id="weather-container">
      <div className="location-box">
        <div className="location">
          {weather.name}
          <p style={{ fontSize: '20px' }}>{getCountryName(weather.sys.country)}</p>
        </div>
        <div className="date">{today}</div>
      </div>

      <div className="weather-box">
        <div className="temp">
          <img
            src={iconUrl(weather.weather[0].icon)}
            alt={weather.weather[0].main}
            className="weather-icon"
          />
          {Math.round(weather.main.temp)}°C
          <p className="weather-feels">Feels like {Math.round(weather.main.feels_like)}°C</p>
        </div>
        <div className="weather">{weather.weather[0].main}</div>
      </div>

      <div className="forecast-btn-container">
        <button
          className={`forecast-btn${showHourly ? ' active' : ''}`}
          onClick={handleHourlyToggle}
          disabled={forecastLoading}
        >
          {forecastLoading ? 'Loading...' : showHourly ? 'Hide hourly' : 'Hourly forecast'}
        </button>
        <button
          className={`forecast-btn${showDaily ? ' active' : ''}`}
          onClick={handleDailyToggle}
          disabled={forecastLoading}
        >
          {forecastLoading ? 'Loading...' : showDaily ? 'Hide 5-day' : '5-day forecast'}
        </button>
      </div>

      {forecast && showHourly && (
        <div className="forecast-container">
          <p className="forecast-label">Hourly forecast</p>
          <div className="forecast-scroll">
            {forecast.slice(0, 8).map((entry) => (
              <div className="forecast-item" key={entry.dt}>
                <span className="forecast-time">{formatHour(entry.dt_txt)}</span>
                <img
                  src={iconUrl(entry.weather[0].icon)}
                  alt={entry.weather[0].main}
                  className="forecast-icon"
                />
                <span className="forecast-temp">{Math.round(entry.main.temp)}°C</span>
                <span className="forecast-desc">{entry.weather[0].description}</span>
                <span className="forecast-meta">💧 {entry.main.humidity}%</span>
                <span className="forecast-meta">🌧 {Math.round(entry.pop * 100)}%</span>
                <span className="forecast-meta">💨 {Math.round(entry.wind.speed)} m/s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {forecast && showDaily && (
        <div className="forecast-container">
          <p className="forecast-label">5-day forecast</p>
          <div className="forecast-scroll">
            {getDailyEntries(forecast).map((entry) => (
              <div className="forecast-item" key={entry.dt}>
                <span className="forecast-time">{formatDay(entry.dt_txt)}</span>
                <img
                  src={iconUrl(entry.weather[0].icon)}
                  alt={entry.weather[0].main}
                  className="forecast-icon"
                />
                <span className="forecast-temp">
                  {Math.round(entry.main.temp_max)}° / {Math.round(entry.main.temp_min)}°
                </span>
                <span className="forecast-desc">{entry.weather[0].description}</span>
                <span className="forecast-meta">💧 {entry.main.humidity}%</span>
                <span className="forecast-meta">🌧 {Math.round(entry.pop * 100)}%</span>
                <span className="forecast-meta">💨 {Math.round(entry.wind.speed)} m/s</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherCities.length > 0 && (
        <div className="linksContainer">
          <p className="other-cities-label">Other results:</p>
          {otherCities.map((city) => (
            <button
              className="linksCities"
              key={`${city.name}-${city.lat}-${city.lon}`}
              onClick={() => onCitySelect(city)}
            >
              {city.name},{city.state ? ` ${city.state},` : ''} {getCountryName(city.country)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default WeatherDisplay
