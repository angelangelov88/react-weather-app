import './App.css'
import { useState } from 'react'
import { CountryCodes } from './CountryCodes'

type GeoCity = {
  name: string
  lat: number
  lon: number
  country: string
  state?: string
}

type WeatherData = {
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

const API_KEY = import.meta.env.VITE_API_KEY as string
const BASE = import.meta.env.VITE_BASE as string

const App = () => {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [cities, setCities] = useState<GeoCity[]>([])
  const [weatherShown, setWeatherShown] = useState(false)
  const [linksShown, setLinksShown] = useState(false)
  const [initialMessageShown, setInitialMessageShown] = useState(true)
  const [emptyErrorShown, setEmptyErrorShown] = useState(false)
  const [genericErrorShown, setGenericErrorShown] = useState(false)

  const search = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      if (!query.trim()) {
        setEmptyErrorShown(true)
        return
      }
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((result: GeoCity[]) => {
          setQuery('')
          setInitialMessageShown(false)
          setEmptyErrorShown(false)
          if (result.length === 0) {
            setGenericErrorShown(true)
            setLinksShown(false)
          } else {
            setCities(result)
            setLinksShown(true)
            setWeatherShown(false)
            setGenericErrorShown(false)
          }
        })
    }
  }

  const searchWeather = (city: GeoCity) => {
    fetch(`${BASE}data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&APPID=${API_KEY}`)
      .then((res) => res.json())
      .then((result: WeatherData) => {
        setWeather(result)
        setLinksShown(false)
        setWeatherShown(true)
        setGenericErrorShown(false)
      })
  }

  const dateBuilder = (d: Date) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const getCountryName = (code: string) =>
    CountryCodes.find((c) => c.alpha2 === code.toLowerCase())?.name ?? code

  const [today] = useState(() => dateBuilder(new Date()))

  const getBgClass = () => {
    if (!weather) return 'app cold'
    if (weather.main.temp > 16) return 'app warm'
    if (weather.main.temp < 5) return 'app'
    return 'app cold'
  }

  return (
    <div className={getBgClass()}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
        </div>

        {initialMessageShown && (
          <div id="initialMessage">
            <p>Please type a city name and press Enter to get the current weather</p>
          </div>
        )}

        {genericErrorShown && (
          <p className="error">Please make sure the name is correct and try again</p>
        )}
        {emptyErrorShown && <p className="error">Please type a city name</p>}

        {linksShown && cities.length > 0 && (
          <div className="linksContainer">
            {cities.map((city) => (
              <p
                className="linksCities"
                key={`${city.name}-${city.lat}-${city.lon}`}
                onClick={() => searchWeather(city)}
              >
                {city.name},{city.state ? ` ${city.state},` : ''} {getCountryName(city.country)}
              </p>
            ))}
          </div>
        )}

        {weatherShown && weather && (
          <div id="weather-container">
            <div className="location-box">
              <div className="location">
                {weather.name}
                <p style={{ fontSize: '20px' }}>{getCountryName(weather.sys.country)}</p>
              </div>
              <br />
              <div className="date">{today}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°C
                <p className="weather-feels">Feels like {Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
