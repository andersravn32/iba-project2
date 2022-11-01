// Global API key
const API_KEY = "";

// Shorthand query selector
const $ = (element) => {
    if (document.querySelectorAll(element).length > 1){
        return document.querySelectorAll(element);
    }
    return document.querySelector(element);
}

// Get geocoding for a specific location
const getLocation = async (input, limit = 5) => {
    await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${limit}&appid=${API_KEY}`)
    .then(res => res.json())
    .then((data) => {
        console.log(data)
    })
}

// Get weather data for a specific location
const getWeatherData = async ({lat, lon}) => {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(res => res.json())
    .then((data) => {
        console.log(data)
    })
}