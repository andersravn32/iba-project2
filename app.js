// Global API key
const API_KEY = "49b4cd9bd298bc73a9a91553c7db7213";

// Get searchHistory if any was found
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// weatherData placeholder, stores data about currently loaded weather
const weatherData = {};

// Shorthand query selector
const $ = (element) => {
  if (document.querySelectorAll(element).length > 1) {
    return document.querySelectorAll(element);
  }
  return document.querySelector(element);
};

// Get geocoding for a specific location
const getLocation = async (input, limit = 1) => {
  const request = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${limit}&appid=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return request[0];
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

// Search in for correct geocoding and fetch new weather data
const search = async (query) => {
  // Used for searching for location data
  const locationQuery = await getLocation(query);

  // Push to searchHistory and update data
  searchHistory.push(locationQuery);

  // Update localStorage with new searchHistory
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  console.log(locationQuery);
  // Update the UI with the updated location
  update({
    lat: locationQuery.lat,
    lon: locationQuery.lon,
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
$("#search-history").querySelector("button").addEventListener("click", (e) => {
  e.preventDefault();

  // Reset to empty array
  searchHistory.length = 0;

  // Update localStorage with new searchHistory
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // Hide searchHistory
  $("#search-history").style.display = "none";
})

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
