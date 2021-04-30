// Tutorial by http://youtube.com/CodeExplained
// api key : 82005d27a116c2880c8f0fcb866998a0

//SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//App data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

//App Consts and vars
const KELVIN = 273;
//API KEY
const key = "72ae13f31458b43f253a1553d3609afb";
//check if browser Supports Geolocation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//SET USER'S POSITION
function setPosition(Position) {
    let latitude = Position.coords.latitude;
    let longitude = Position.coords.longitude;
    getWeather(latitude, longitude);
}

//Show Eror when  THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}
async function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api);
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        })
}



//DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//C to F conversion
function celsiusTOFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

//WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENT
tempElement.addEventListener("click", function () {

    if (weather.temperature.value === undefined) return
    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusTOFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        weather.temperature.unit = "fahrenheit";
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
        console.log("ffff")
    }
})



//SEARCH BY NAME OF CITY
let inputCityName = document.querySelector(".inputCityName");
let searchRes = document.querySelector(".searchRes ul");
let city = document.querySelector(".inputCityName");
inputCityName.addEventListener('keyup', () => {
    searchRes.innerHTML = null;
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${inputCityName.value}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            "x-rapidapi-key": "fa76437ebcmsh8207d89692cd31ep18b531jsneb4cb4f600d6"
        }
    })
        .then(response => {
            //   console.log(response);
            let data = response.json();
            return data;
        }).then(data => {
            data.data.forEach(dt => {
                // console.log(dt.city);
                searchRes.innerHTML += `<li>${dt.city} <span>${dt.country}</span></li>`

            });

        })
        .catch(err => {
            console.log(err);

        });

})
// choose city from list of suggestions

searchRes.addEventListener('click', (e) => {
    if (e.target.localName == "span") {
        city.value = e.target.parentElement.childNodes[0].data;
    }
    if (e.target.localName == "li") {
        city.value = e.target.childNodes[0].data;
    }


})

// SHOW THE RESULT OF THE CHOSEN CITY
city.addEventListener('keyup', (e) => {
    if (e.which == 13) {
        searchRes.remove();
        let api = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${key}`;
        console.log(api);
        fetch(api)
            .then(function (response) {
                let data = response.json();
                return data;
            })
            .then(function (data) {
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
            })
            .then(function () {
                displayWeather();
            })
    }
})
