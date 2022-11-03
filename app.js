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

if (navigator.geolocation) {
  // Get current postion via geo location
  navigator.geolocation.getCurrentPosition(
    async (location) => {
      // Update location UI
      await updateLocation(location.coords.latitude, location.coords.longitude);

      // Update forecasts UI
      await updateForecasts(location.coords.latitude, location.coords.longitude);

      // Show base layout
      $("#app-weather-data").style.display = "flex";
      $("#app-weather-forecasts-hours").style.display = "flex";
    },
    (error) => {
      // Show no-geo message
      $("#app-weather-no-geo").style.display = "flex";
    }
  );
}

const updateLocation = async (lat, lon) => {
  // Request weather data regarding location
  const request = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  ).then((res) => res.json());

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
      .split("kl.")[1]
      .replace(".", ":");

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
    $("#app-weather-data-temperature").querySelector("img").src =
      "https://openweathermap.org/img/wn/11n@2x.png";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-rain");
  }

  if (request.weather[0].id >= 300 && request.weather[0].id <= 321) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Let regnvejr";
    $("#app-weather-data-temperature").querySelector("img").src =
      "http://openweathermap.org/img/wn/10d@2x.png";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-rain");
  }

  if (request.weather[0].id >= 500 && request.weather[0].id <= 531) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Regnvejr";
    $("#app-weather-data-temperature").querySelector("img").src =
      "http://openweathermap.org/img/wn/09d@2x.png";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-rain");
  }

  if (request.weather[0].id >= 600 && request.weather[0].id <= 622) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Snevejr";
    $("#app-weather-data-temperature").querySelector("img").src =
      "http://openweathermap.org/img/wn/13d@2x.png";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-snow");
  }

  if (request.weather[0].id >= 701 && request.weather[0].id <= 800) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Skyfrit";
    $("#app-weather-data-temperature").querySelector("img").src =
      "http://openweathermap.org/img/wn/01d@2x.png";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-neutral");
  }

  if (request.weather[0].id >= 801 && request.weather[0].id <= 804) {
    $("#app-weather-data-temperature")
      .querySelector("p")
      .querySelector("span").innerText = "Overskyet";
    $("#app-weather-data-temperature").querySelector("img").src =
      "http://openweathermap.org/img/wn/02d@2x.png";
    $("#app").removeAttribute("class");
    $("#app").classList.toggle("bg-snow");
  }

  // Hide error and show weather data
  $("#app-weather-no-geo").style.display = "none";
  $("#app-weather-data").style.display = "flex";
};

const updateForecasts = async (lat, lon) => {
  // Request forecast data from API
  const request = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  ).then((res) => res.json());

  // Filter forecast data to only include relevant data for the current day
  const forecasts = request.list.filter((data) => {
    return data.dt_txt.includes(request.list[0].dt_txt.split(" ")[0]);
  });

  // Create forecast based on data
  $(".forecast-current").innerHTML = "";
  forecasts.forEach((forecast) => {
    // Create parent element
    const element = document.createElement("div");
    element.classList.add("forecast");

    // Create child elements

    // Time label
    let time = forecast.dt_txt.split(" ")[1];
    element.innerHTML += `<span>${time.split(":")[0]}:${
      time.split(":")[1]
    }</span>`;

    // Weather icon
    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("alt", "Icon");
    let weatherLabel = document.createElement("span");

    if (forecast.weather[0].id >= 200 && forecast.weather[0].id <= 232) {
      weatherIcon.src = "https://openweathermap.org/img/wn/11n@2x.png";
      weatherLabel.innerText = "Tordenvejr";
    }

    if (forecast.weather[0].id >= 300 && forecast.weather[0].id <= 321) {
      weatherIcon.src = "http://openweathermap.org/img/wn/10d@2x.png";
      weatherLabel.innerText = "Let regnvejr";
    }

    if (forecast.weather[0].id >= 500 && forecast.weather[0].id <= 531) {
      weatherIcon.src = "http://openweathermap.org/img/wn/09d@2x.png";
      weatherLabel.innerText = "Regnvejr";
    }

    if (forecast.weather[0].id >= 600 && forecast.weather[0].id <= 622) {
      weatherIcon.src = "http://openweathermap.org/img/wn/13d@2x.png";
      weatherLabel.innerText = "Snevejr";
    }

    if (forecast.weather[0].id >= 701 && forecast.weather[0].id <= 800) {
      weatherIcon.src = "http://openweathermap.org/img/wn/01d@2x.png";
      weatherLabel.innerText = "Skyfrit";
    }

    if (forecast.weather[0].id >= 801 && forecast.weather[0].id <= 804) {
      weatherIcon.src = "http://openweathermap.org/img/wn/02d@2x.png";
      weatherLabel.innerText = "Overskyet";
    }
    element.appendChild(weatherIcon);
    element.appendChild(weatherLabel);

    element.innerHTML += `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-6 h-6"
    >
      <path
        fill-rule="evenodd"
        d="M11.47 2.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06l-2.47-2.47V21a.75.75 0 01-1.5 0V4.81L8.78 7.28a.75.75 0 01-1.06-1.06l3.75-3.75z"
        clip-rule="evenodd"
      />
    </svg>`;
    element.querySelector(
      "svg"
    ).style.transform = `rotate(${forecast.wind.deg}deg)`;
    element.innerHTML += `
    <span>${forecast.wind.speed} m/s</span>`;
    // Append child elements to parent
    $(".forecast-current").appendChild(element);
      
    // Hide error message and show forecasts
    $("#app-weather-no-geo").style.display = "none";
    $("#app-weather-forecasts-hours").style.display = "flex";
  });
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
          updateLocation(location.lat, location.lon);

          // Update forecasts
          updateForecasts(location.lat, location.lon);

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

        // Add current location
        currentLocation = location;

        // Update localStorage with new searchHistory
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Update base app layout
        updateLocation(location.lat, location.lon);

        // Update forecasts
        updateForecasts(location.lat, location.lon);

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
