import './App.css';
import { useState } from 'react'
import { CountryCodes } from './CountryCodes'

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
  const [emptyErrorShown, setEmptyErrorShown] = useState(false)
  const [genericErrorShown, setGenericErrorShown] = useState(false)

// This is the search function which is quering the API endpoint for the user input and then returns the result and sets the city state to it. It is used later in the rendering
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=10&appid=${api.key}`)
      .then(res => {
        if (res.status >= 200 && res.status <= 299) {
          res.json()
            .then(result => {
            setCity(result)
    //Set the query to empty string to make sure the user can search another town
            setQuery('')
    //These states are used to make sure that the component that is needed is shown and vise-versa
            setInitialMessageShown(false)
            setLinksShown(true)
            setWeatherShown(false)
            setEmptyErrorShown(false)
            setGenericErrorShown(false)
          })
//I added this extra if statement to make sure I show different errors based on the error type. Because the API does not return an error when incorrect city is typed and instead returns an empty array, I added the code here to show the error genericErrorShown which will be shown if incorrect data is typed. Alternatively, if the user types an empty string it will return the emptyErrorShown.
        } else if (city.length === 0) {
            setGenericErrorShown(true)
            setQuery('')
        } else {
            setEmptyErrorShown(true)
            setWeatherShown(false)
            setLinksShown(false)
            setInitialMessageShown(false)
            setQuery('')
            setGenericErrorShown(false)
        }
      })     
    }
  }

//This is a function that gets its parameter from the user click event. Once the user clicks on the selected city, it gets its geo coordinates and they are used in the fetch request to get the weather for that location 
  const searchWeather = (index) => {
         fetch(`${api.base}weather?lat=${index.lat}&lon=${index.lon}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
              setWeather(result)
              setLinksShown(false)
              setWeatherShown(true)
              setGenericErrorShown(false)
            })
          }

//This is a date builder function that gets the current day
  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

//The DOM's elements are being created here
  return (
    <div className={
//This part evaluates the weather and based on that displays an image (cold for less than 5, autumn image between 6 and 16 and beach for over 16)
      (typeof weather.main != "undefined") 
      ? (
        (weather.main.temp > 16) ? 'app warm' :
        (weather.main.temp < 5) ? 'app' : 'app cold' ) 
      : 'app cold'}>
      <main>
{/* This is the search bar */}
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
{/* This is the initial message shown which state changes when the search function is called and it gets hidden */}
        { initialMessageShown && 
          <div id='initialMessage'>
            <p>Please type a city name and press Enter to get the current weather</p>
          </div>
        }
{/* This is the error message which is displayed if the search function returns an empty array */}
        <div>
          {( genericErrorShown || city.length === 0 ) ? (
            <p className='error'>Please make sure the name is correct and try again</p>
            ) :('')
        }
{/* This is the error returned if the user searches for an empty string */}
        { (emptyErrorShown) ? (
            <p className='error'>Please type a city name</p>
          ) : ('')
        }
        </div>

{/* This is the cities list which are returned from the search function. I used map method to show each element on a separate line */}
    { linksShown &&      
       <div className='linksContainer'>
          {(city.length > 0) ? (
            <div>
            {
              city.map((index, id) => {
                return (
                  <p className='linksCities' key={id} onClick={() => searchWeather(index)}>
                    { index.name + ',' } { 
                    typeof(index.state) != 'undefined' && index.state + ',' 
// I used the filter method here to loop through the countyCode json file and find the country name for this particular country code. Then I display the whole name of the country in the cities list 
                  } { index.country ? `${CountryCodes.filter(country => country.alpha2 === index.country.toLowerCase())[0].name}` : ""}
                  </p>
                )
          })}
          </div>
          ) : ('')      
          }
        </div>
}
{/* This is where the weather is shown. I show the city name, full country name, date, temperature, feels like temperature and the weather condition. There is a condition to show this element only if there is any data in it in order to ensure that it does not show when the user tries to search for another town */}
        { weatherShown  ? (
          <div id="weather-container" style={{ display: weatherShown ? "block" : "none" }}>
            <div className="location-box">
              <div className="location">{weather.name}
              <p style={{fontSize: "20px"}}>
              {
              weather?.sys?.country ? `${CountryCodes?.filter(country => country?.alpha2 === weather?.sys?.country?.toLowerCase())[0]?.name}` : ""}
              </p>
              </div>
              <br></br>
              <div className="date">{dateBuilder(new Date())}
              </div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather?.main?.temp)}°C
              <p className="weather-feels">Feels like {Math.round(weather?.main?.feels_like)}°C</p>
              </div>
              <div className="weather">{weather?.weather[0]?.main}</div>
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;
