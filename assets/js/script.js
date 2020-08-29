// Testing AirVisual API & Hiking API
// AirVisual API: https://api-docs.airvisual.com/?version=latest
// Hiking Project API: https://www.hikingproject.com/data
// MapBox API: https://docs.mapbox.com/mapbox-gl-js/api/

// Global Variables
var lon;
var lat;
let trails = [];
let userInputs;
let weatherInfo;

$(document).ready(function () {
  // Retrieve the city input by the user
  $("#hikeButton").on("click", function (event) {
    // console.log(event.keyCode);
    // Get the city the user input
    // city = $("#startLocation").val().trim();
    // if (event.keyCode === 13) {
    //   weatherAPI(city); // call weather function w/ city input
    //   $("#startLocation").val("");
    // }

    // Store all input data in an object:
    userInputs = {
      city: "Bend",
      state: "Oregon",
      // city: $("#startLocation").val().trim(),
      // state: $("#state").val(),
      minDistance: $("#hikeMin").val().trim(),
      maxDistance: $("#hikeMax").val().trim(),
      minElevation: $("#elevationMin").val().trim(),
      maxElevation: $("#elevationMax").val().trim(),
      difficulty: $("#difficulty").val(),
      minTemp: $("#tempMin").val().trim(),
      maxTemp: $("#tempMax").val().trim()
      // weatherConditions: $().val(),
    };
    // console.log(userInputs.difficulty);

    // Checking if a city and state were entered
    if (userInputs.city == "") {
      alert("Please enter a city");
    }
    if (userInputs.state == null) {
      alert("Please select a state");
    }

    // call functions based on user inputs
    weatherAPI(userInputs.city, userInputs.state);

    // clear all input fields
    $(".w3-input").val("");
    $(".w3-check").val("");
    $(".w3-select").val("");
  });
});

function unitsConverter(t, ws) {
  // Use math.js to convert metric units to imperial
  t = math.unit(t, "degC").value; // converts Celsius to Kelvin
  tempF = math.format(t * (9 / 5) - 459.67, { precision: 14 }); // converts Kelvin to Fahrenheit

  // ws = math.unit(ws, 'm/s').value;
  mph = math.format(ws * 2.237, { notation: "fixed", precision: 2 }); // convert m/s to mph
  var arr1 = [tempF, mph];

  return arr1;
}

function weatherAPI(city, state) {
  var apiKey = "0146d325-a946-4208-8c5f-c9c2cb554ac6";
  var queryURL =
    "https://api.airvisual.com/v2/city?city=" +
    city +
    "&state=" +
    state +
    "&country=USA&key=" +
    apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // console.log(response); // JSON return for Oregon, USA

    // Weather Data we want:
    // Lat/lon coordinates
    lon = response.data.location.coordinates[0];
    lat = response.data.location.coordinates[1];

    // Call function to convert units from Metric to Imperial
    const t = response.data.current.weather.tp;
    const ws = response.data.current.weather.ws;
    var arr1 = unitsConverter(t, ws);

    weatherInfo = {
      minTemp: arr1[0], // F
      humidity: response.data.current.weather.hu, // %
      windSpeed: arr1[1], // mph
      pollution: response.data.current.pollution.aqius,
      weatherIcon: response.data.current.weather.ic
    };
    console.log(weatherInfo.weatherIcon);
    // Display weather data
    $("#weatherData").empty();
    $("#weatherData")
      .append($("<h1>").text(response.data.city + ", " + state))
      .css("color", "white");
    $("#weatherData").append(
      $("<p>")
        .text("Temperature: " + weatherInfo.minTemp + " °F")
        .addClass("temp")
    );
    $("#weatherData").append(
      $("<p>")
        .text("Humidity: " + weatherInfo.humidity + "%")
        .addClass("humidity")
    );
    $("#weatherData").append(
      $("<p>").text("Wind Speed: " + weatherInfo.windSpeed + " m/s")
    );
    $("#weatherData").append(
      $("<p>")
        .text("Air Quality Index: ")
        .append($("<span>").text(weatherInfo.pollution).addClass("aqi"))
    );

    // $text("Air Quality Index: " + pollutionSpan)
    // AQI level
    if (weatherInfo.pollution <= 50) {
      // Good (0-50)
      $(".aqi").css("background-color", "#9cd94e");
    } else if (weatherInfo.pollution >= 51 || weatherInfo.pollution <= 100) {
      // Moderate (51-100)
      $(".aqi").css("background-color", "#facf3a");
    } else if (weatherInfo.pollution >= 101 || weatherInfo.pollution <= 150) {
      // Unhealthy for Sensitive Groups (101-150)
      $(".aqi").css("background-color", "#f99049");
    } else if (weatherInfo.pollution >= 151 || weatherInfo.pollution <= 200) {
      // Unhealthy (151-200)
      $(".aqi").css("background-color", "#f65e5f");
    } else if (weatherInfo.pollution >= 201 || weatherInfo.pollution <= 300) {
      // Very Unhealthy (201-300)
      $(".aqi").css("background-color", "#a070b7");
    } else {
      // Hazardous (301-500)
      $(".aqi").css("background-color", "#a06a7b");
    }

    // weather conditions based on icon:
    if (weatherInfo.weatherIcon === "01d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Clear Skies (day)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/01d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "01n") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Clear Skies (night)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/01n.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "02d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Few Clouds (day)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/02d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "02n") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Few Clouds (night)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/02n.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "03d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Scattered Clouds")
          .append(
            $("<img>")
              .attr("src", "./assets/images/03d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "04d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Broken Clouds")
          .append(
            $("<img>")
              .attr("src", "./assets/images/04d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "04n") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Broken Clouds (night)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/04d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "09d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Rain Showers")
          .append(
            $("<img>")
              .attr("src", "./assets/images/09d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "09n") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Rain Showers (night)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/09d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "10d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Rain (day)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/10d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "10n") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Rain (night)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/10n.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "11d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Thunderstorms")
          .append(
            $("<img>")
              .attr("src", "./assets/images/11d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "11n") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Thunderstorms (night)")
          .append(
            $("<img>")
              .attr("src", "./assets/images/11d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "13d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Snow")
          .append(
            $("<img>")
              .attr("src", "./assets/images/13d.png")
              .addClass("weatherIcon")
          )
      );
    } else if (weatherInfo.weatherIcon === "50d") {
      $("#weatherData").append(
        $("<p>")
          .text("Weather Conditions: Mist")
          .append(
            $("<img>")
              .attr("src", "./assets/images/50d.png")
              .addClass("weatherIcon")
          )
      );
    } else {
    }

    // call function for weather forecast
    forecast(lat, lon);

    // AJAX call for the hiking API
    hikingAPI(lat, lon);
  });
}

function forecast(lat, lon) {
  // Get the 7 day forecast
  // Date, Icon, Temp, Humidity

  // Second/Main AJAX Call to get weather data
  var queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,minutely&appid=e68a6c498567148d8870611b117efac1&units=imperial";
  //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=daily&appid=e68a6c498567148d8870611b117efac1&units=imperial

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // console.log(response);

    $(".forecast").empty();

    // See which weather conditons were selected by the user
    let selectedConditions = [];
    $(".weatherCondition input:checked").each(function () {
      selectedConditions.push($(this).data());
    });
    // console.log(selectedConditions); //display array of checked boxes for the weather

    // Get data for 5-day forecast
    for (var i = 1; i < 6; i++) {
      let day = response.daily[i].dt; // ( date of forecast )
      let dailyTemp = response.daily[i].temp.day;
      let dailyHumidity = response.daily[i].humidity;
      let sunrise = response.daily[i].sunrise;
      let sunset = response.daily[i].sunset;
      let icon = response.daily[i].weather[0].icon;
      let iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // Compare forecast conditions to user input condidtions
      // for (var i=0; i <selectedConditions.length; i++) {
      //   if (selectedConditions[i] == ) {

      //   }
      //   else if() {

      //   }
      // }

      // Switch statement to display the 5-day forecast
      switch (i) {
        case 1:
          $("#1").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#1").append($("<img>").attr("src", iconURL));
          $("#1").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#1").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#1").append($("<div>").text("Sunrise: " + unixTimeSun(sunrise)));
          $("#1").append($("<div>").text("Sunset: " + unixTimeSun(sunset)));
          break;

        case 2:
          $("#2").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#2").append($("<img>").attr("src", iconURL));
          $("#2").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#2").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#2").append($("<div>").text("Sunrise: " + unixTimeSun(sunrise)));
          $("#2").append($("<div>").text("Sunset: " + unixTimeSun(sunset)));
          break;

        case 3:
          $("#3").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#3").append($("<img>").attr("src", iconURL));
          $("#3").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#3").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#3").append($("<div>").text("Sunrise: " + unixTimeSun(sunrise)));
          $("#3").append($("<div>").text("Sunset: " + unixTimeSun(sunset)));
          break;

        case 4:
          $("#4").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#4").append($("<img>").attr("src", iconURL));
          $("#4").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#4").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#4").append($("<div>").text("Sunrise: " + unixTimeSun(sunrise)));
          $("#4").append($("<div>").text("Sunset: " + unixTimeSun(sunset)));
          break;

        case 5:
          $("#5").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#5").append($("<img>").attr("src", iconURL));
          $("#5").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#5").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#5").append($("<div>").text("Sunrise: " + unixTimeSun(sunrise)));
          $("#5").append($("<div>").text("Sunset: " + unixTimeSun(sunset)));
          break;
      }
    }
  });
}

function unixTimestamp(t) {
  var date = new Date(t * 1000);
  var months_arr = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ];
  var month = months_arr[date.getMonth()];
  var year = date.getFullYear();
  var day = date.getDate();
  var dateDisplay = month + "/" + day + "/" + year;

  return dateDisplay;
}

function unixTimeSun(s) {
  // TimeStamp for sunrise and sunset
  var date = new Date(s * 1000);
  var hour = date.getHours();
  var minute = date.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }
  var timeStamp = hour + ":" + minute;
  return timeStamp;
}

function hikingAPI(
  lat,
  lon,
  maxDistance = 30,
  maxResults = 15,
  sort = "quality",
  minLength = 0,
  minStars = 0
) {
  const authKey = "200881533-cbba50330892ef7f2dd269f567c7d3dd";
  let queryURL =
    "https://www.hikingproject.com/data/get-trails?lat=" +
    lat +
    "&lon=" +
    lon +
    "&maxDistance=" +
    maxDistance +
    "&maxResults=" +
    maxResults +
    "&sort=" +
    sort +
    "&minLength=" +
    minLength +
    "&minStars=" +
    minStars +
    "&key=" +
    authKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // console.log(response);

    $("#hikingList").empty(); // clear screen for new info
    trails = []; // clear trail list
    // Data from API
    for (var i = 0; i < response.trails.length; i++) {
      // Trail info objects
      let trailInfo = {
        name: response.trails[i].name,
        latitude: response.trails[i].latitude,
        longitude: response.trails[i].longitude,
        summary: response.trails[i].summary,
        length: response.trails[i].length,
        elevation: response.trails[i].ascent,
        difficulty: response.trails[i].difficulty,
        picture: response.trails[i].imgSqSmall,
        url: response.trails[i].url
      };

      // Display list of 10 trails nearby w/ info

      // var newHike = $("<li>")
      //   .attr("id", "trail-number-" + i)
      //   .text(trailInfo.name);
      // var hikeSummary = $("<p>").text(trailInfo.summary);
      // var hikeLength = $("<p>").text("Length: " + trailInfo.length + " miles");
      // var hikeElevation = $("<p>").text(
      //   "Elevation Gain: " + trailInfo.elevation + " feet"
      // );
      // var hikeDifficulty = $("<p>").text("Difficulty: " + trailInfo.difficulty);
      // let hikePic = $("<img>").attr({
      //   src: trailInfo.picture,
      //   id: "trail-picture"
      // });

      // // Append
      // $("#hikingList").append(newHike);
      // newHike.append(hikeSummary, hikeLength, hikeElevation, hikeDifficulty);

      // if (trailInfo.picture != "") {
      //   newHike.append(hikePic);
      // }

      trails.push(trailInfo);
    }
    hikingTrails(sortHikes(trails, userInputs, weatherInfo));
    // sortHikes(trails, userInputs, weatherInfo);
    // console.log(trails);
    maparea(lat, lon, sortHikes(trails, userInputs, weatherInfo));
  });
}

function maparea(lat, lon, trails) {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia3BlZ2VkZXIiLCJhIjoiY2tlNXk3ZHJzMTdodjJ1dWxlZ2VrNTA5MCJ9.aHGcdq3jxUrUvysKk66J3Q";
  var map = new mapboxgl.Map({
    container: "map",
    center: [lon, lat],
    style: "mapbox://styles/mapbox/outdoors-v11",
    zoom: 8
  });

  // Add markers
  for (let i = 0; i < trails.length; i++) {
    let lng = trails[i].longitude;
    let lat = trails[i].latitude;
    let trailLink =
      '<a href="#trail-number-' + i + '">' + trails[i].name + "<a>";

    let trailPopup = new mapboxgl.Popup().setHTML(trailLink);

    // Create markers with popup
    var marker = new mapboxgl.Marker({ color: "#ad1d40" })
      .setLngLat([lng, lat])
      .setPopup(trailPopup)
      .addTo(map);
  }
}

// Sort output based on user input
function sortHikes(trails, user, weather) {
  // // Making input into a value
  let minDist = parseFloat(user.minDistance);
  let maxDist = parseFloat(user.maxDistance);
  let minElev = parseFloat(user.minElevation);
  let maxElev = parseFloat(user.maxElevation);
  let minTemp = parseFloat(user.minTemp);
  let maxTemp = parseFloat(user.maxTemp);
  let temp = weather.minTemp;

  // Checking if input is a number
  if (isNaN(minDist) === true) {
    minDist = 0;
  }
  if (isNaN(maxDist) === true) {
    maxDist = 200;
  }
  if (isNaN(maxElev) === true) {
    maxElev = 20000;
  }
  if (isNaN(minElev) === true) {
    minElev = 0;
  }
  if (isNaN(minTemp) === true) {
    minTemp = 0;
  }
  if (isNaN(maxTemp) === true) {
    maxTemp = 125;
  }

  // Filter out trails based on user input
  trails = trails.filter(function (thisTrail) {
    if ($("#green").prop("checked") && thisTrail.difficulty == "green") {
      return true;
    } else if (
      $("#greenBlue").prop("checked") &&
      thisTrail.difficulty == "greenBlue"
    ) {
      return true;
    } else if ($("#blue").prop("checked") && thisTrail.difficulty == "blue") {
      return true;
    } else if (
      $("#blueBlack").prop("checked") &&
      thisTrail.difficulty == "blueBlack"
    ) {
      return true;
    } else if ($("#black").prop("checked") && thisTrail.difficulty == "black") {
      return true;
    } else if (
      $("#dblack").prop("checked") &&
      thisTrail.difficulty == "dblack"
    ) {
      return true;
    }
  });

  return trails.filter(function (thisTrail) {
    if (
      thisTrail.length > minDist &&
      thisTrail.length < maxDist &&
      minElev < thisTrail.elevation &&
      thisTrail.elevation < maxElev &&
      minTemp < temp &&
      temp < maxTemp
    ) {
      return true;
    }
  });
}

// scroll button

// Get the button
var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Append hiking info to page
// Will try to make it work after sort function is done
function hikingTrails(trails) {
  // console.log(trails);
  for (let i = 0; i < trails.length; i++) {
    let newHike = $("<li>").attr("id", "trail-number-" + i);
    let hikeName = $("<a>")
      .attr({
        href: trails[i].url,
        target: "_blank"
      })
      .text(trails[i].name);
    let hikeSummary = $("<p>").text(trails[i].summary);
    let hikeLength = $("<p>").text("Length: " + trails[i].length + " miles");
    let hikeElevation = $("<p>").text(
      "Elevation Gain: " + trails[i].elevation + " feet"
    );
    let hikeDifficulty = $("<p>").text("Difficulty: " + trails[i].difficulty);
    let hikePic = $("<img>").attr({
      src: trails[i].picture,
      id: "trail-picture"
    });

    // Append
    newHike.append(hikeName);
    $("#hikingList").append(newHike);
    newHike.append(hikeSummary, hikeLength, hikeElevation, hikeDifficulty);

    if (trails[i].picture != "") {
      newHike.append(hikePic);
    }
  }
}
