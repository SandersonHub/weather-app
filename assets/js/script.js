document.getElementById("search").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Input for the city name, may add something to this in the future to be clear to the user.
  let cityOfChoice = document.getElementById("city-name").value.trim();
  if (cityOfChoice === "") return;

  let apiKey = "e932e508bcb29838927bef8e0efbe316";
  //API fetch for await....this will pause the promise
  let [location] = await (await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityOfChoice}&limit=1&appid=${apiKey}`)).json();
  if (!location) {
    console.log("No results found.");
    return;
  }
  //this is good up to this point

  // Calls for the latitude and longitude for the location of the weather
  let { lat, lon } = location;

  // Fetch weather information
  let weatherInfo = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json();
  let temperatureF = ((weatherInfo.main.temp - 273.15) * 9 / 5) + 32;
  document.getElementById("current-weather-information").textContent = `Temperature: ${temperatureF.toFixed(2)}°F`;

  let forecastData = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json();

  let forecastInfo = document.getElementById("forecast-information");
  forecastInfo.innerHTML = "";

  forecastData.list
    .filter((_, index) => index % 8 === 0)
    .forEach(forecastItem => {
      let forecastDate = new Date(forecastItem.dt_txt);
      let temperatureF = ((forecastItem.main.temp - 273.15) * 9 / 5) + 32;

// Create a div element
var forecastElement = document.createElement("div");

// Create a paragraph element for the date
var dateElement = document.createElement("p");
dateElement.textContent = "Date: " + forecastDate.toLocaleDateString();

// Created a Par for the temp
var temperatureElement = document.createElement("p");
temperatureElement.textContent = "Temperature: " + temperatureF.toFixed(2) + "°F";

// Append the date and temperature par
forecastElement.appendChild(dateElement);
forecastElement.appendChild(temperatureElement);

      forecastInfo.appendChild(forecastElement);
    });

  // History list of the cities searched for
  let historyList = document.getElementById("history-list");
  let listItem = document.createElement("li");
  listItem.textContent = location.name;
  historyList.appendChild(listItem);

  document.getElementById("city-name").value = "";
});
