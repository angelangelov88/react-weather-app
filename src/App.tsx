import './App.css'
import { useWeather } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import WeatherDisplay from './components/WeatherDisplay'

const dateBuilder = (d: Date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const today = dateBuilder(new Date())

const App = () => {
  const { query, setQuery, otherCities, weather, view, bgClass, handleSearch, handleCitySelect } =
    useWeather()

  return (
    <div className={bgClass}>
      <main>
        <SearchBar query={query} onChange={setQuery} onKeyDown={handleSearch} />

        {view === 'idle' && (
          <div id="initialMessage">
            <p>Please type a city name and press Enter to get the current weather</p>
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
            weather={weather}
            today={today}
            otherCities={otherCities}
            onCitySelect={handleCitySelect}
          />
        )}
      </main>
    </div>
  )
}

export default App
