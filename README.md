# Weather App 🌤️

A responsive weather application built with React and a small Express server.

I created this project to practice working with APIs, handling user input, managing state, and building a real-world application instead of only learning concepts separately.

The app lets you search for a city and see the current weather, the next day of hourly readings, and a 5-day forecast. The browser talks to our own server. The server talks to OpenWeather, so the API key stays in `.env`.


## ✨ Features

- Search weather by city name
- City suggestions while you type
- Press Enter or click the search button
- Current temperature, feels like, humidity, wind, pressure, visibility, sunrise, and sunset
- Hourly forecast and 5-day forecast
- Background changes for sunny, rainy, cloudy, and night conditions
- Saves the last 5 searched cities on the server
- Click a recent city to view it again
- Loading and error states
- Responsive layout for mobile and laptop


## 🛠️ Technologies Used

- React.js
- Tailwind CSS
- JavaScript
- Node.js and Express
- OpenWeather API
- Vite


## 📚 What I Learned

While building this project, I practiced:

- How React components communicate with each other using props
- Managing application data with useState
- Fetching data through my own backend instead of calling the weather API from the browser
- Keeping an API key in a `.env` file
- Saving a short search history in a JSON file
- Handling loading and error states
- Creating reusable components
- Building a responsive layout


## 🚀 How It Works

1. You enter a city name.
2. The React app asks our Express server for the weather.
3. The server uses the API key from `.env` and calls OpenWeather.
4. React shows the current conditions, hourly forecast, and 5-day forecast.
5. The city is saved in `server/data/history.json`. Only the last 5 are kept.


## 📂 Project Structure

```
server/
│
├── index.js              # Express app
├── openweather.js        # OpenWeather requests
├── historyStore.js       # Last 5 cities
└── routes/

src/
│
├── components/
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── WeatherCard.jsx
│   ├── HourlyForecast.jsx
│   ├── ForecastCard.jsx
│   └── History.jsx
│
├── App.jsx
├── api.js
└── main.jsx
```


## ⚙️ Installation

Install dependencies:

```
npm install
```

Create a `.env` file in the project folder:

```
OPENWEATHER_API_KEY=your_api_key
PORT=5000
```

Do not name the key `VITE_API_KEY`. A `VITE_` name would be copied into the browser.

Start the website and the server together:

```
npm run dev
```

Open the local address Vite prints. It is usually http://localhost:5173

The page calls `/api`, and Vite forwards that to the server on port 5000.


## 🙌 Author

Maryam Ishfaq

Frontend Developer
