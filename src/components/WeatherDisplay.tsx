import type { GeoCity, WeatherData } from '../hooks/useWeather'
import { getCountryName } from '../hooks/useWeather'

type Props = {
  weather: WeatherData
  today: string
  otherCities: GeoCity[]
  onCitySelect: (city: GeoCity) => void
}

const WeatherDisplay = ({ weather, today, otherCities, onCitySelect }: Props) => (
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
        {Math.round(weather.main.temp)}°C
        <p className="weather-feels">Feels like {Math.round(weather.main.feels_like)}°C</p>
      </div>
      <div className="weather">{weather.weather[0].main}</div>
    </div>
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

export default WeatherDisplay
