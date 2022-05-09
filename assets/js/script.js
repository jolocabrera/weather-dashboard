var apiKey = "b52269beab4796c34581899d8460b531"
var submitBtn = document.querySelector("#submit-btn");
var userInput = document.querySelector("#user-search");
var userFormEl = document.querySelector("#user-form");
var iconContainerEl = document.querySelector("#name-icon-container");



var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log("submitted");
    //get value from input element
    var userSearch = userInput.value.trim();

    if (userSearch) {
        clearDisplay();
        getCoordinates(userSearch);
        userInput.value = "";
    } else {
        alert("Please enter a valid city");
    }
};


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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;
    console.log(apiUrl);

    //make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    displayWeather(data, name);
                    displayForecast(data);
                });
            } else {
                alert("Error: City Not Found");
            }
        })
        .catch(function (error) {
            //Notice this '.catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to OpenWeather");
        });
};

var clearDisplay = function () {
    $("#name-icon-container").html("");
    $("#current-weather").html("");

}

var displayWeather = function (data, name) {
    //pull data
    var date = moment().format("l");
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var humidity = data.current.humidity;
    var uvindex = data.current.uvi;
    var iconcode = data.current.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png"

    // append name to container
    var nameEl = document.createElement("h2");
    nameEl.setAttribute("class", "d-inline");
    nameEl.textContent = name + " " + date + " ";
    iconContainerEl.appendChild(nameEl);


    // create img element
    var iconEl = document.createElement("img")
    iconEl.setAttribute("class", "d-inline");
    iconEl.setAttribute("src", iconUrl);


    //append img to div
    iconContainerEl.appendChild(iconEl);

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

};

var displayForecast = function (data) {
    for (var i = 1; i < data.daily.length;i++) {
        //create card div
        var card = document.createElement("div");
        card.className = "card"
        
        //pull data
        var date = moment.unix(data.daily[i].dt).format("L");
        var icon = data.daily[i].weather[0].icon
        var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png"
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;

        //set and append date to card
        var dateEl = document.createElement("h4");
        dateEl.className = "card-title";
        card.appendChild(dateEl);

        //create elements for card then append
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconUrl);
        card.appendChild(iconEl);

        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp: " + temp + "°F";
        card.appendChild(tempEl);
    
        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + wind + " MPH";
        card.appendChild(windEl);
    
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity + " %";
        card.appendChild(humidityEl);

        //append card to 5 day forecast
        $(".card-holder").append(card);

    }


}



// getCoordinates("burlingame");
userFormEl.addEventListener("submit", formSubmitHandler);
submitBtn.addEventListener("click", formSubmitHandler);