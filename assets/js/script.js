var apiKey = "b52269beab4796c34581899d8460b531"
var submitBtn = document.querySelector("#submit-btn");
var userInput = document.querySelector("#user-search");
var userFormEl = document.querySelector("#user-form");
var iconContainerEl = document.querySelector("#name-icon-container");
var historyContainerEl = document.querySelector("#search-history-list");
var searchHistory = [];


var formSubmitHandler = function (event) {
    event.preventDefault();
    console.log("submitted");
    //get value from input element
    console.log(userInput);
    var userSearch = userInput.value.trim();

    if (userSearch) {
        clearDisplay();
        saveSearchHistory(userSearch);
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
    $(".card-group").html("");

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
    for (var i = 1; i < 6;i++) {
        //create card div
        var card = document.createElement("div");
        card.className = "card bg-dark text-white mx-2 px-1"
        
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
        dateEl.textContent = date;
        card.appendChild(dateEl);

        //create elements for card then append
        var iconElContainer = document.createElement("div")
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconUrl);
        iconElContainer.appendChild(iconEl);
        card.appendChild(iconElContainer);

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
        $(".card-group").append(card);

    }


}

var saveSearchHistory = function (city) {
    let cityCase = toTitleCase(city);
    let cityCheck = searchHistory.includes(cityCase);
    console.log(cityCheck);
    //add searched city to history array if it is not already there
    if (!cityCheck) {
        searchHistory.push(cityCase);
        localStorage.setItem("city", JSON.stringify(searchHistory));
    } else {
        localStorage.setItem("city", JSON.stringify(searchHistory));
    }
}

var loadSearchHistory = function() {
    //get local storage cities
    let savedCities = localStorage.getItem("city")
    //check if there is anything in local storage, if not, set "searchHistory" array to empty
    if (!savedCities) {
        searchHistory = [];
        return false;
    } 

    savedCities = JSON.parse(savedCities);
    //add saved cities to "searchHistory" array
    for (i=0; i < savedCities.length; i++) {
        searchHistory.push(savedCities[i]);
    }

    
    displaySearchHistory(searchHistory);
}

var displaySearchHistory = function(cityArray) {
    for (i=0; i < cityArray.length; i++) {
        //create li element
        let listEl = document.createElement("li")

        //create button element and style
        let buttonEl = document.createElement("button");
        buttonEl.textContent = cityArray[i];
        buttonEl.className = "btn btn-secondary"
        buttonEl.id = cityArray[i]
        buttonEl.type = "button"

        //append button to li and li to ul
        listEl.appendChild(buttonEl);
        historyContainerEl.appendChild(listEl);

        //add event listener
        buttonEl.addEventListener("click", function(event) {
            let cityText = event.target.id;
            userInput.value = cityText
            
            formSubmitHandler(event);
        })

    }
    // //create event handler for all search history buttons 
    // historyContainerEl.addEventListener("click", searchHistoryClick())
}

// var searchHistoryClick = function(event) {
//     let cityText = event.target.textContent
//     console.log(cityText);
//     // //change userinput to button text content
//     // userInput = text from button
//     // //run search
//     // formSubmitHandler()
// }

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

// getCoordinates("burlingame");
loadSearchHistory();
userFormEl.addEventListener("submit", formSubmitHandler);
submitBtn.addEventListener("click", formSubmitHandler);