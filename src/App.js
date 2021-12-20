import './App.css';
import { useEffect, useState } from 'react'
import env from 'react-dotenv';

const API_KEY = process.env.REACT_APP_API_KEY
const BASE = process.env.REACT_APP_BASE

const api = {
  key: API_KEY,
  base: BASE
}

function App() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({})
  const [city, setCity] = useState({})
  const [weatherShown, setWeatherShown] = useState(false)
  const [linksShown, setLinksShown] = useState(false)
  const [initialMessageShown, setInitialMessageShown] = useState(true)

  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setCity(result)
        setQuery('')
        setInitialMessageShown(false)
        setLinksShown(true)
        setWeatherShown(false)

      })
    }
  }


  const searchWeather = (index) => {

         fetch(`${api.base}weather?lat=${index.lat}&lon=${index.lon}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
              setWeather(result)
              setLinksShown(false)
              setWeatherShown(true)
            })
  }


  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }


  return (
    <div className={
      (typeof weather.main != "undefined") 
      ? (
        (weather.main.temp > 16) ? 'app warm' :
        (weather.main.temp < 5) ? 'app' : 'app cold' ) 
      : 'app cold'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        
        { initialMessageShown && 
          <div id='initialMessage'>
            <p>Please type a city or country name to get the current weather</p>
        </div>
        }

        <div>
          {(weather.message) ? (
            <p className='error'>Please make sure the name is correct and try again</p>
          ) :(''),
          console.log(weather.message)}
        </div>


    { linksShown &&      
       <div className='linksContainer'>
          {(city.length > 0) ? (
            <div>
            {
              city.map((index, id) => {
                return (
                  <p className='linksCities' key={id} onClick={() => searchWeather(index)}>{ index.name }, { index.state}, { index.country }
                  </p>
                )
          })}
          </div>
          ) : ('')      
          }
        </div>
}

        { weatherShown  ? (
          <div id="weather-container" style={{ display: weatherShown ? "block" : "none" }}>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°C
              <p className="weather-feels">Feels like {Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
