import "./App.css";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import History from "./components/History";

import { useEffect, useState } from "react";


function App() {

  const API_KEY = import.meta.env.VITE_API_KEY;


  const [city, setCity] = useState("Lahore");
  const [weather, setWeather] = useState(null);

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const getWeather = async (searchCity = city) => {

    if (!searchCity.trim()) {
      setError("Please enter a city name");
      return;
    }


    try {

      setLoading(true);
      setError("");


      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );


      const data = await response.json();


      if (data.cod !== 200) {

        setWeather(null);
        setError(data.message);

        return;
      }


      setWeather(data);


      setHistory((prev)=>{

        const updatedHistory = prev.includes(data.name)
          ? prev
          : [data.name, ...prev];


        localStorage.setItem(
          "history",
          JSON.stringify(updatedHistory)
        );


        return updatedHistory;

      });


    } catch (error) {

      setError("Something went wrong!");

    } finally {

      setLoading(false);

    }

  };


  useEffect(()=>{

    getWeather("Lahore");

  },[]);



  return (

    <div className="app">

      <div className="container">

        <Header />


        <SearchBar
          city={city}
          setCity={setCity}
          getWeather={getWeather}
        />


        {loading && <h2>Loading...</h2>}


        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {weather && (
          <WeatherCard 
            weather={weather}
          />
        )}


        <History

          history={history}

          setCity={setCity}

          getWeather={getWeather}

        />


      </div>

    </div>

  );
}


export default App;