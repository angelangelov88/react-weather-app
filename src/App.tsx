import './App.css'
import { useWeather } from './hooks/useWeather'
import { useNearby } from './hooks/useNearby'
import { dateBuilder } from './helpers/weatherHelpers'
import { getCountryName } from './helpers/weatherHelpers'
import SearchBar from './components/SearchBar'
import WeatherDisplay from './components/WeatherDisplay'

const today = dateBuilder(new Date())

const App = () => {
  const {
    query,
    setQuery,
    otherCities,
    weather,
    forecast,
    forecastTimezone,
    forecastLoading,
    view,
    bgClass,
    handleSearch,
    handleCitySelect,
    handleForecastRequest,
    mainCityKey,
  } = useWeather()

  const nearbyCities = useNearby()

  return (
    <div className={bgClass}>
      <main>
        <SearchBar query={query} onChange={setQuery} onKeyDown={handleSearch} />

        {view === 'idle' && (
          <div id="initialMessage">
            <p>Please type a city name and press Enter to get the current weather</p>
          </div>
        )}

        {view === 'idle' && nearbyCities.length > 0 && (
          <div className="linksContainer">
            <p className="other-cities-label">Nearby</p>
            {nearbyCities.map((city) => (
              <button
                key={`${city.lat}-${city.lon}`}
                className="linksCities"
                onClick={() => handleCitySelect(city)}
              >
                {city.name}{city.state ? `, ${city.state}` : ''}, {getCountryName(city.country)}
              </button>
            ))}
          </div>
        )}

        {view === 'loading' && (
          <div id="initialMessage">
            <p>Loading...</p>
          </div>
        )}

        {view === 'error-notfound' && (
          <p className="error">Please make sure the name is correct and try again</p>
        )}

        {view === 'error-empty' && <p className="error">Please type a city name</p>}

        {view === 'weather' && weather && (
          <WeatherDisplay
            key={mainCityKey}
            weather={weather}
            today={today}
            otherCities={otherCities}
            onCitySelect={handleCitySelect}
            forecast={forecast}
            forecastTimezone={forecastTimezone}
            forecastLoading={forecastLoading}
            onForecastRequest={handleForecastRequest}
          />
        )}
      </main>
    </div>
  )
}

export default App
