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
  localStorage.setItem(
    "searchHistory",
    JSON.stringify(searchHistory)
  );

  // Update the UI with the updated location
  update({
    lat: locationQuery.lat,
    lon: locationQuery.lon,
  });
};

// Is used to fetch newest weather data and update the UI
const update = async (location) => {
  // Used for searching for weather data
  const weatherQuery = await getWeatherData({
    lat: location.lat,
    lon: location.lon,
  });
};
