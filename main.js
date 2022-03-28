//get function for temp, humidity, wind speed, location
// zip code

var apiKey = '8c2c17a4e303e0f8df7fd7c76dd384f1';
var userInput = document.getElementById('search-bar');
var cityDisplay = document.querySelector('.city');
var temp = document.querySelector('.temp');
var humidity = document.querySelector('.humid');
var windSpeed = document.querySelector('.wind');
var searchBtn = document.querySelector('.search-btn')

searchBtn.addEventListener('click', function() {
    // console.log(userInput.value);
    getLocation(userInput.value);
})

function getCurrent(lat, lon) {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
    const latt = 'lat=' + lat;
    const lonn = '&lon=' + lon;
    const rest = '&exclude=minutely,hourly&units=imperial&appid=8c2c17a4e303e0f8df7fd7c76dd384f1'
    fetch(baseUrl + latt + lonn + rest)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    // console.log(data);
                    // console.log(data.main.temp)
                    // console.log(data.main.humidity)
                    // console.log(data.weather[0].description)
                    // console.log(data.wind.speed);
                    displayProperties(data);
                })
        })
}

function getLocation(city) {
    var baseUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='
    const rest = '&limit=1&appid='
    fetch(baseUrl + city + rest + apiKey)
        .then(function(response) {
            response.json()
                .then(function(data) {
                    // console.log(data[0].lat, data[0].lon);
                    getCurrent(data[0].lat, data[0].lon);
                })
        })
}

function displayProperties(data) {
    cityDisplay.textContent = userInput.value;
    temp.textContent = data.main.temp + 'F'
    humidity.textContent = data.main.humidity + '%'
    windSpeed.textContent = 'Wind Speed: ' + data.wind.speed;


}