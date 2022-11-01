// Global API key
const API_KEY = "49b4cd9bd298bc73a9a91553c7db7213";

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

  // Used for searching for weather data
  const weatherQuery = await getWeatherData({ lat: locationQuery.lat, lon: locationQuery.lon });
    console.log(weatherQuery)
};
