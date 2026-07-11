function WeatherCard({ weather }) {

  if (!weather) {
    return null;
  }


  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;


  return (

    <div className="weather-card">

      <div className="location">

        <h2>
          {weather.name}, {weather.sys.country}
        </h2>

      </div>


      <img
        src={icon}
        alt={weather.weather[0].description}
        className="weather-icon"
      />


      <h1>
        {Math.round(weather.main.temp)}°C
      </h1>


      <p className="description">
        {weather.weather[0].description}
      </p>


      <div className="details">


        <div>
          <span>💧</span>
          <p>
            Humidity
            <br />
            {weather.main.humidity}%
          </p>
        </div>


        <div>
          <span>💨</span>
          <p>
            Wind
            <br />
            {weather.wind.speed} m/s
          </p>
        </div>


        <div>
          <span>🌡️</span>
          <p>
            Feels Like
            <br />
            {Math.round(weather.main.feels_like)}°C
          </p>
        </div>


      </div>


    </div>

  );
}


export default WeatherCard;