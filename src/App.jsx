import { useEffect, useState } from "react";
import { Logo } from "../public/index.js";
import "./App.css";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [searchText, setSearchText] = useState("Addis Ababa");
  const [latLon, setLatLon] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSearch = () => {
    getLatLon(searchText);
  };

  const getLatLon = async (city) => {
    setLoading(true);
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.length > 0) {
        setLatLon(data[0]);
      } else {
        console.error("No data found for the given city.");
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const getWeatherData = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  useEffect(() => {
    getLatLon(searchText);
  }, []);

  useEffect(() => {
    if (latLon) {
      getWeatherData(latLon.lat, latLon.lon);
    }
  }, [latLon]);

  // Handle key down event to detect Enter key
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="grid-container">
      <div className="header">
        <div className="heading">
          <img src={Logo} alt="Logo" />
          <h1>NJK Weather</h1>
        </div>
        <div className="search-container">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown} // Add key down event listener
            placeholder="Search City"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        ) : (
          <>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt="Weather Icon"
            />
            <h2>
              {weatherData.main.temp}
              <span>&deg;C</span>
            </h2>
            <h4>Feels Like</h4>
            <h3>
              {weatherData.main.feels_like}
              <span>&deg;C</span>
            </h3>
            <h4>{weatherData.name}</h4>
            <p>{weatherData.sys.country}</p>
          </>
        )}
      </div>
      <div className="related-info">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        ) : (
          <>
            <h4 style={{ margin: "0" }}>
              Min Temp <br />{" "}
              <h3 style={{ marginBottom: "20px" }}>
                {weatherData.main.temp_min}
                <span>&deg;C</span>
              </h3>
            </h4>
            <h4 style={{ margin: "0" }}>
              Max Temp <br />{" "}
              <h3 style={{ marginBottom: "10px" }}>
                {weatherData.main.temp_max}
                <span>&deg;C</span>
              </h3>
            </h4>
            <h3 style={{ margin: "0" }}>
              {weatherData.weather[0].description.charAt(0).toUpperCase() +
                weatherData.weather[0].description.slice(1)}
            </h3>
          </>
        )}
      </div>
      <div className="feels-like">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        ) : (
          <>
            <h4>
              Sunrise <br />{" "}
              <h3 style={{ marginBottom: "20px" }}>
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
              </h3>
            </h4>
            <h4>
              Sunset <br />{" "}
              <h3>
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
              </h3>
            </h4>
          </>
        )}
      </div>
      <div className="more-info">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Loading...</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <h4 style={{ margin: "0" }}>Humidity</h4>
              <h3 style={{ margin: "0" }}>{weatherData.main.humidity}%</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <h4 style={{ margin: "0" }}>Pressure</h4>
              <h3 style={{ margin: "0" }}>{weatherData.main.pressure} hPa</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <h4 style={{ margin: "0" }}>Wind Speed</h4>
              <h3 style={{ margin: "0" }}>{weatherData.wind.speed} m/s</h3>
            </div>
          </>
        )}
      </div>
      <footer className="footer">
        <p>Developed by Nathanael &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;
