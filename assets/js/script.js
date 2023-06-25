document.getElementById("search-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  //input for the city name, may add something to this in the future to be clear to the user.
  let city = document.getElementById("city-input").value.trim();
  if (city === "") return;

  let apiKey = "e932e508bcb29838927bef8e0efbe316";
  let [location] = await (await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)).json();
  if (!location) {
    console.log("No results found.");
    return;
  }
//calls for the lat lon for the location of the weather
  let { lat, lon } = location;
//fetch weather
  let weatherData = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json();
  let temperatureFahrenheit = ((weatherData.main.temp - 273.15) * 9 / 5) + 32;
  document.getElementById("current-weather-info").textContent = `Temperature: ${temperatureFahrenheit.toFixed(2)}°F`;

  let forecastData = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json();

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
//history list of the cities search for
  let historyList = document.getElementById("history-list");
  let listItem = document.createElement("li");
  listItem.textContent = location.name;
  historyList.appendChild(listItem);

  document.getElementById("city-input").value = "";
});
