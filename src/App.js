import './App.css';
import { useState } from 'react'
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

  const [lon, setLon] = useState({})
  const [lat, setLat] = useState({})

  const search = evt => {
    if (evt.key === "Enter") {
      // fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setCity(result)
        setQuery('')
        document.getElementById('initialMessage').style.display = "none"
        console.log(result.lon)
        setLon(result.lan)
        setLat(result.lon)
      })
    }
  }

  const searchWeather = (lon, lat) => {

         fetch(`${api.base}weather?lat={lat}&lon={lon}&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
              setWeather(result)
              console.log(result)
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
        
        <div id='initialMessage'>
        <p>Please type a city or country name to get the current weather</p>
        <br></br>
        <p style={{fontSize: "12px"}}>Please note that the country code has to be added if the same city name is available in more than one country. For example, Cambridge, US or Cambridge, GB.</p>
        </div>

        <div>
          {(weather.message) ? (
            <p className='error'>Please make sure the name is correct and try again</p>
          ) :('')}
        </div>


        <div className='linksContainer'>
          {(city.length > 0) ? (
            <div>
            {
             console.log(city),
              city.map((index, id) => {
                return (
                  <p className='linksCities' key={id} onClick={searchWeather}>{ index.name }, { index.state}, { index.country }
                  </p>
                )
          })}
          </div>
          ) : ('')      
          }
        </div>

        {(typeof weather.main != "undefined") ? (
          <div>
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
