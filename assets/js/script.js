var apiKey = "b52269beab4796c34581899d8460b531"



var getCoordinates = function (city) {
    // format api url
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
    console.log(apiUrl);

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                getWeather(data);
            })
        } else {
            alert("Error: City Not Found");
        }
    });
}

var getWeather = function (city) {
    // pull lon, lat, and name
    var lat = city[0].lat;
    var lon = city[0].lon;
    var name = city[0].name;

    // format the api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + apiKey;
    console.log(apiUrl);

    //make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    displayWeather(data,name);
                });
            } else {
                alert("Error: City Not Found");
            }
        })
        .catch(function(error) {
            //Notice this '.catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to OpenWeather");
        });
};

var displayWeather = function (data,name) {
    //pull data
    var date = moment().format("l");
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvindex = data.current.uvi;

    // append name to container
    $("#current-city").text(name + " " + date);

    //create li items for each weather data and append to ul
    var tempEl = document.createElement("li");
    tempEl.textContent = "Temp: " + temp + "°F";
    $("#current-weather").append(tempEl);

    var windEl = document.createElement("li");
    windEl.textContent = "Wind: " + wind + " MPH";
    $("#current-weather").append(windEl);

    var humidityEl = document.createElement("li");
    humidityEl.textContent = "Humidity: " + humidity + " %";
    $("#current-weather").append(humidityEl);

    var uvEl = document.createElement("li");
    uvEl.textContent = "UV Index: " + uvindex;
    $("#current-weather").append(uvEl);




}

getCoordinates("burlingame");