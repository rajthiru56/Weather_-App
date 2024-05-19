import React, { useEffect, useState } from 'react'
import './App.css';
import searchIcon from "./assest/search-Icon.png";
import cloudIcon from "./assest/cloud-Icon.png";
import drizzleIcon from "./assest/drizzle-Icon.png";
import humidityIcon from "./assest/humidity-Icon.png" 
import rainIcon from "./assest/rain-Icon.png"; 
import snowIcon from "./assest/snow-Icon.png"; 
import clearIcon from "./assest/sun-Icon.png"; 
import windIcon from "./assest/wind-Icon.png"; 



const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return(
    <>
      <div className='image'>
        <img src={icon} alt="image" width="200px" />
      </div>
      <div className="temp">{temp}*C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>latitute</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>logitute</span>
          <span>{log}</span>
      </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='icon'/>
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="wind" className='icon'/>
          <div className='data'>
            <div className='wind-percent'>{wind} km/hr</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
        
      </div>
      
    </>
  )
}


const App = () => {
  let api_key ="bd5ac69f4e9a937d4873008c495f6b55";

  const [text, setText] = useState("chennai");
  const [cityNotFound, setCityNotFound] =useState(false);
  const [loading, setLoading] = useState(false);

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let Url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    
    try{
      const response = await fetch(Url);
      const data = await response.json();
      //console.log(data);
      if(data.cod === "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);     
    }catch(error){
      console.error("An error occurred:",error.message);
      setError("An error occurred while fetching weather data.");
    }finally{
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e)=>{
    if(e.key === "Enter") {
      search();
    }
  };
  useEffect (function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input 
            type="text" 
            className="cityInput" 
            placeholder='Search City' 
            value={text} 
            onChange={handleCity}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={()=>search()}>
            <img src={searchIcon} alt="search" />
          </div>  
        </div>
        
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-messagr">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}

        <p className='copyright'> Designed by <span>raj</span></p>
      </div>


    </>
  )
  
}

export default App;