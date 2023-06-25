document.getElementById("search-form").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    let cityInput = document.getElementById("city-input");
    let city = cityInput.value.trim();
  
    if (city === "") return;
  
    let apiKey = "e932e508bcb29838927bef8e0efbe316";
    let geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
    let [location] = await geoResponse.json();
  
    if (!location) {
      console.log("No results found.");
      return;
    }
  
    let { lat, lon } = location;
  
    let weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let weatherData = await weatherResponse.json();
    let temperatureFahrenheit = ((weatherData.main.temp - 273.15) * 9 / 5) + 32;
    let currentWeatherInfo = document.getElementById("current-weather-info");
    currentWeatherInfo.textContent = `Temperature: ${temperatureFahrenheit.toFixed(2)}°F`;
  
    let forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    let forecastData = await forecastResponse.json();
  
    let forecastInfo = document.getElementById("forecast-info");
    forecastInfo.innerHTML = "";
  
    forecastData.list
      .filter((_, index) => index % 8 === 0)
      .forEach(forecastItem => {
        let forecastDate = new Date(forecastItem.dt_txt);
        let temperatureFahrenheit = ((forecastItem.main.temp - 273.15) * 9 / 5) + 32;
  
        let forecastElement = document.createElement("div");
        forecastElement.innerHTML = `
          <p>Date: ${forecastDate.toLocaleDateString()}</p>
          <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
        `;
  
        forecastInfo.appendChild(forecastElement);
      });
  
    let historyList = document.getElementById("history-list");
    let listItem = document.createElement("li");
    listItem.textContent = location.name;
    historyList.appendChild(listItem);
  
    cityInput.value = "";
  });
  