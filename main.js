//get function for temp, humidity, wind speed, location
// zip code

var apiKey = "8c2c17a4e303e0f8df7fd7c76dd384f1";
var userInput = document.getElementById("search-bar");
var cityDisplay = document.querySelector(".city");
var tempEl = document.querySelector(".temp");
var humidityEl = document.querySelector(".humid");
var windSpeedEl = document.querySelector(".wind");
var searchBtn = document.querySelector(".search-btn");
var forecastBtn = document.querySelector(".forecast");
var historyEl = document.querySelector(".history-container");
var savedCity = localStorage.getItem("cities");
var timeEl = document.querySelector(".time-container");
var cities = JSON.parse(savedCity);

if (cities === null) {
    cities = [];
} else {
    for (i = 0; i < cities.length; i++) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = cities[i];
        newDiv.addEventListener("click", function() {
            getLocation2(cities[i]);
        });
        historyEl.append(newDiv);
    }
}

console.log(cities);

searchBtn.addEventListener("click", function() {
    getLocation1(userInput.value);
    if (cities.length >= 10) {
        cities.pop();
        historyEl.removeChild(historyEl.lastChild);
    }
    cities.unshift(userInput.value);
    var newDiv = document.createElement("div");
    newDiv.innerHTML = userInput.value;

    newDiv.addEventListener("click", function() {
        getLocation2(newDiv.innerHTML);
    });
    historyEl.prepend(newDiv);
    // console.log(cities);
    var stringifyCity = JSON.stringify(cities);
    console.log(stringifyCity);
    localStorage.setItem("cities", stringifyCity);
});

forecastBtn.addEventListener("click", function() {
    getLocation2(userInput.value);
});

function getLocation1(city) {
    var baseUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
    const rest = "&limit=1&appid=";
    fetch(baseUrl + city + rest + apiKey).then(function(response) {
        response.json().then(function(data) {
            // console.log(data[0].lat, data[0].lon);
            getCurrent(data[0].lat, data[0].lon);
        });
    });
}

function getLocation2(city) {
    var baseUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
    const rest = "&limit=1&appid=";
    fetch(baseUrl + city + rest + apiKey).then(function(response) {
        response.json().then(function(data) {
            // console.log(data[0].lat, data[0].lon);
            getForecast(data[0].lat, data[0].lon);
        });
    });
}

function getCurrent(lat, lon) {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    const latt = "lat=" + lat;
    const lonn = "&lon=" + lon;
    const rest =
        "&exclude=minutely,hourly&units=imperial&appid=8c2c17a4e303e0f8df7fd7c76dd384f1";
    fetch(baseUrl + latt + lonn + rest).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            // console.log(data.main.temp)
            // console.log(data.main.humidity)
            // console.log(data.weather[0].description)
            // console.log(data.wind.speed);
            displayProperties(data);

            const time = new Date(Date.now());
            var timeStr = new Intl.DateTimeFormat("default", {
                weekday: "long",
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(time);
            timeEl.innerText = timeStr;
            // const currentTime = new Date((utcTime + data.timezone) * 1000);
            // console.log(currentTime);
        });
    });
}

function getForecast(lat, lon) {
    const baseUrl = "https://api.openweathermap.org/data/2.5/forecast?";
    const latt = "lat=" + lat;
    const lonn = "&lon=" + lon;
    const rest = "&appid=" + apiKey;
    fetch(baseUrl + latt + lonn + rest).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            //alert(data.list[7]["dt"])
            display5Day(data.list);
            const time = new Date(Date.now());
            var timeStr = new Intl.DateTimeFormat("default", {
                weekday: "long",
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(time);
            timeEl.innerText = timeStr;
        });
    });
}

function displayProperties(data) {
    cityDisplay.textContent =
        userInput.value[0].toUpperCase() + userInput.value.slice(1);
    tempEl.textContent = Math.round(data.main.temp) + "F°";
    humidityEl.textContent = data.main.humidity + "%";
    document.querySelector(".currentWind").textContent =
        "Wind Speed: " + Matound(data.wind.speed) + " mph";
}

function display5Day(data) {
    let windSpeed = [];
    let temp = [];
    let humidity = [];
    let weatherCondition = [];
    console.log(data);
    // let loc = 0;
    // alert(document.getElementsByClassName("wind").length);
    data.map((item, index) => {
        if (index != 0 && index % 7 == 0) {
            // loc++;
            // if (loc >= 4) {
            //     loc = 0;
            // }

            windSpeed.push(item.wind.speed);
            temp.push(Math.round((item.main.temp - 273.15) * 1.8 + 32));
            humidity.push(item.main.humidity);
            weatherCondition.push(item.weather[0].icon);
        }
        if (index === 0) {
            console.log(index);
            cityDisplay.textContent =
                userInput.value[0].toUpperCase() + userInput.value.slice(1);
            tempEl.textContent =
                Math.round((item.main.temp - 273.15) * 1.8 + 32) + "F°";
            humidityEl.textContent = item.main.humidity + "%";
            windSpeedEl.textContent =
                "Wind Speed: " + Math.round(item.wind.speed) + " mph";
        }
    });

    for (let i = 0; i < 5; i++) {
        document.getElementsByClassName("wind")[
            i
        ].innerText = `Wind: ${windSpeed[i]}
        Temp: ${temp[i]}F°
        Humidity: ${humidity[i]}%
        `;
        document.querySelectorAll(".icon-container")[i].innerHTML = "";
        let weatherIcon = document.createElement("img");
        weatherIcon.src =
            "http://openweathermap.org/img/wn/" + weatherCondition[i] + "@2x.png";
        document.querySelectorAll(".icon-container")[i].append(weatherIcon);
    }

    //SHOULD I PUT 5 FUNCTIONS HERE FOR EACH DAY TO BE DISPLAYED?
}