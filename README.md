# Weather App 🌤️

A simple and responsive weather application built with React.

I created this project to practice working with APIs, handling user input, managing state, and building a real-world application instead of only learning concepts separately.

The app allows users to search for any city and get current weather information like temperature, humidity, wind speed, and weather conditions.


## ✨ Features

- Search weather by city name
- Press Enter or click the search button to find weather
- Shows current temperature and weather condition
- Displays humidity and wind speed
- Shows weather icons according to conditions
- Saves recent searched cities
- Click previous searches to view weather again
- Handles loading and error states
- Responsive design for mobile and desktop


## 🛠️ Technologies Used

- React.js
- JavaScript
- CSS
- OpenWeather API
- Vite


## 📚 What I Learned

While building this project, I practiced:

- How React components communicate with each other using props
- Managing application data with useState
- Fetching external data using APIs
- Handling asynchronous operations
- Working with loading and error states
- Creating reusable components
- Improving user experience with better UI


## 🚀 How It Works

1. User enters a city name.
2. The app sends a request to OpenWeather API.
3. Weather data is received from the API.
4. React updates the UI with the latest information.
5. Searched cities are stored in history for quick access.


## 📂 Project Structure

src/
│
├── components/
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── WeatherCard.jsx
│   └── History.jsx
│
├── App.jsx
├── App.css
└── main.jsx


## ⚙️ Installation

Clone this repository:

git clone your-repository-link


Install dependencies:

npm install


Create a `.env` file:

VITE_API_KEY=your_api_key


Run the project:

npm run dev


## 🌱 Future Improvements

- Add weather forecast for upcoming days
- Add dark mode
- Add current location weather
- Add more animations
- Improve UI design


## 🙌 Author

Maryam Ishfaq

Frontend Developer