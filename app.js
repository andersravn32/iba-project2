// Global API key
const API_KEY = "49b4cd9bd298bc73a9a91553c7db7213";

// Get searchHistory if any was found
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Shorthand query selector
const $ = (element) => {
  if (document.querySelectorAll(element).length > 1) {
    return document.querySelectorAll(element);
  }
  return document.querySelector(element);
};

// Get weather data for a specific location
const getWeatherData = async ({ lat, lon }) => {
  const request = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return request;
};

const update = async ({ lat, lon }) => {
  // Request weather data regarding location
  const request = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  ).then((res) => res.json());

  console.log(request);
  // Update main view location title
  $("#app-weather-location-data")
    .querySelector("h1")
    .querySelector("span").innerText = request.name;

  // Update date
  $("#app-weather-location-data").querySelectorAll("p")[0].innerText =
    new Intl.DateTimeFormat("da-DK", { dateStyle: "full", timeStyle: "short" })
      .format(new Date(Date.now() + 1000 * request.timezone))
      .split("kl.")[0];

  // Update time
  $("#app-weather-location-data").querySelectorAll("p")[1].innerText =
    new Intl.DateTimeFormat("da-DK", { dateStyle: "full", timeStyle: "short" })
      .format(new Date(Date.now() + 1000 * request.timezone))
      .split("kl.")[1].replace(".", ":");

  // Update celcius temperature
  $("#app-weather-data-temperature").querySelector(
    "h2"
  ).innerText = `${Math.floor(request.main.temp - 273.15)}°C`;

  // Update arrow rotation and wind speed
  $("#app-weather-data-wind").querySelector(
    "svg"
  ).style.transform = `rotate(${request.wind.deg}deg)`;
  $("#app-weather-data-wind").querySelector(
    "p"
  ).innerText = `${request.wind.speed} m/s`;

  // Update app background
  if (request.weather[0].id >= 200 && request.weather[0].id <= 232) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Tordenvejr";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-rain");
  }

  if (request.weather[0].id >= 300 && request.weather[0].id <= 321) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Let regnvejr";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-rain");
  }

  if (request.weather[0].id >= 500 && request.weather[0].id <= 531) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Regnvejr";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-rain");
  }

  if (request.weather[0].id >= 600 && request.weather[0].id <= 622) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Snevejr";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-snow");
  }

  if (request.weather[0].id >= 701 && request.weather[0].id <= 800) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Skyfrit";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-neutral");
  }

  if (request.weather[0].id >= 801 && request.weather[0].id <= 804) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Overskyet";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-snow");
  }
};

// Add event listener for toggling favourites panel
$("#app-header")
  .querySelectorAll("button")[0]
  .addEventListener("click", () => {
    $("#favourites").classList.toggle("show");
    $("#app-header").classList.toggle("hide-right");
  });

// Add event listener for toggling search panel
$("#app-header")
  .querySelectorAll("button")[1]
  .addEventListener("click", () => {
    $("#search").classList.toggle("show");
    $("#app-header").classList.toggle("hide-left");

    // Reset search history UI
    $("#search-history").querySelector("ul").innerHTML = "";

    if (searchHistory.length) {
      // Add history items
      searchHistory.reverse().forEach((location) => {
        // Create list item
        const item = document.createElement("li");
        item.innerHTML = `<h3>${location.name}</h3><span>${location.state}, ${location.country}</span>`;

        // Add event listener to list item
        item.addEventListener("click", (e) => {
          e.preventDefault();

          // Update base app layout
          update({ lat: location.lat, lon: location.lon });

          $("#search").classList.toggle("show");
          $("#app-header").classList.toggle("hide-left");
        });

        // Append list item to search results
        $("#search-history").querySelector("ul").appendChild(item);
      });

      $("#search-history").style.display = "flex";
    }
  });

// Add event listener for toggling favourites panel by X button
$("#favourites")
  .querySelector("header")
  .querySelector("button")
  .addEventListener("click", () => {
    $("#favourites").classList.toggle("show");
    $("#app-header").classList.toggle("hide-right");
  });

// Add event listener for toggling search panel by X button
$("#search")
  .querySelector("header")
  .querySelector("button")
  .addEventListener("click", () => {
    $("#search").classList.toggle("show");
    $("#app-header").classList.toggle("hide-left");
  });

// Add event listener for clearing searchHistory
$("#search-history")
  .querySelector("button")
  .addEventListener("click", (e) => {
    e.preventDefault();

    // Reset to empty array
    searchHistory.length = 0;

    // Update localStorage with new searchHistory
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Hide searchHistory
    $("#search-history").style.display = "none";
  });

// Handle location searching
$("#search")
  .querySelector("form")
  .addEventListener("submit", async (e) => {
    // Prevent default behavior
    e.preventDefault();

    // Fetch location data
    const request = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${
        $("#search").querySelector("input").value
      }&limit=5&appid=${API_KEY}`
    ).then((res) => res.json());

    // Reset UI
    $("#search-results").querySelector("ul").innerHTML = "";

    // Add results to UI
    request.forEach((location) => {
      // Create list item
      const item = document.createElement("li");
      item.innerHTML = `<div><h3>${location.name}</h3><span>${location.state}, ${location.country}</span><div>`;

      // Add event listener to list item
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Add location to searchHistory
        searchHistory.push(location);

        // Update localStorage with new searchHistory
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Update base app layout
        update({ lat: location.lat, lon: location.lon });

        // Reset searchTab
        $("#search").classList.toggle("show");
        $("#app-header").classList.toggle("hide-left");
        $("#search-results").querySelector("ul").innerHTML = "";
        $("#search").querySelector("input").value = "";
        $("#search-results").style.display = "none";
      });

      // Append list item to search results
      $("#search-results").querySelector("ul").appendChild(item);
    });

    // Display search tab
    $("#search-results").style.display = "flex";
  });
