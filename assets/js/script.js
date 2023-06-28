document.getElementById("search").addEventListener("submit", async function (event) {
  event.preventDefault();

  let cityOfChoice = document.getElementById("city").value.trim();
  if (cityOfChoice === "") return;

  //api key within the fetch
  const apiKey = "e932e508bcb29838927bef8e0efbe316";
  let [location] = await (await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityOfChoice}&limit=1&appid=${apiKey}`)).json();
  if (!location) {
      console.log("No results found.");
      return;
  }

  //let and lon for location
  let { lat, lon } = location;

  fetchWeatherData(lat, lon);

  // History list of the cities searched for
  let historyDataSet = document.getElementById("listed-history");
  let listedItem = document.createElement("li");
  listedItem.textContent = location.name;
  listedItem.addEventListener("click", () => {
      fetchWeatherData(lat, lon);
  });
  historyDataSet.appendChild(listedItem);

  document.getElementById("city").value = "";
});

async function fetchWeatherData(lat, lon) {
  const apiKey = "e932e508bcb29838927bef8e0efbe316";
  let weather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json();
  let temperatureF = ((weather.main.temp - 273.15) * 9 / 5) + 32;
  document.getElementById("current-weather-information").textContent = `Temperature: ${temperatureF.toFixed(2)}°F`;

  let forecastStructure = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)).json();

  let forecastInfo = document.getElementById("forecast-information");
  forecastInfo.innerHTML = "";

  forecastStructure.list
    .filter((_, index) => index % 8 === 0)
    .forEach(forecastItem => {
      let forecastDate = new Date(forecastItem.dt_txt);
      let temperatureF = ((forecastItem.main.temp - 273.15) * 9 / 5) + 32;

      let forecastElement = document.createElement("div");
      forecastElement.innerHTML = `
        <p>Date: ${forecastDate.toLocaleDateString()}</p>
        <p>Temperature: ${temperatureF.toFixed(2)}°F</p>
      `;
//used from StackOverflow
      forecastInfo.appendChild(forecastElement);
    });
}

