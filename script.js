// Testing AirVisual API & Hiking API
// AirVisual API: https://api-docs.airvisual.com/?version=latest
// Hiking Project API: https://www.hikingproject.com/data
// MapBox API

// Global Variables
var lon;
var lat;
let trails = [];
let userInputs;
let weatherInfo;
// let state = "Oregon";

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
      difficulty: $("#diffifulty").val(),
      minTemp: $("#tempMin").val().trim(),
      maxTemp: $("#tempMax").val().trim()
      // weatherConditions: $().val(),
    };

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

function unitsConverter(t, ws){
  // Use math.js to convert metric units to imperial
  t = math.unit(t, 'degC').value; // converts Celsius to Kelvin
  tempF = math.format( (t * (9/5) - 459.67), {precision: 14} ); // converts Kelvin to Fahrenheit

  // ws = math.unit(ws, 'm/s'); // convert m/s to mph
  // console.log( math.evaluate('90 km/h to km/h').value ); 

  return tempF;
  // return windSpeed;
}

function weatherAPI(city, state) {
  var apiKey = "0146d325-a946-4208-8c5f-c9c2cb554ac6";
  var queryURL =
    "http://api.airvisual.com/v2/city?city=" +
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

    weatherInfo = {
      minTemp: response.data.current.weather.tp, // C
      humidity: response.data.current.weather.hu, // %
      windSpeed: response.data.current.weather.ws, // m/s
      pollution: response.data.current.pollution.aqius,
      weatherIcon: response.data.current.weather.ic
    };

    // Call function to convert units from Metric to Imperial
    const t = weatherInfo.minTemp;
    const ws = weatherInfo.windSpeed;
    // console.log(unitsConverter(t, ws));

    // Display weather data
    $("#weatherData").empty();
    $("#weatherData").append($("<h2>").text(response.data.city + ", " + state));
    // $("#weatherData").append(
    //   $("<img>").attr("src", "icon url goes here...")
    // );
    $("#weatherData").append(
      $("<p>")
        .text("Temperature: " + unitsConverter(t, ws) + " °F")
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
      $("<p>").text("Air Quality Index: ")
      .append( $("<span>")
        .text(weatherInfo.pollution)
        .addClass("aqi")  
      )
    );

    // $text("Air Quality Index: " + pollutionSpan)
    // AQI level
    if (weatherInfo.pollution <= 50) {
      // Good (0-50)
      $(".aqi").css("background-color", "green");

    }
    else if (weatherInfo.pollution >= 51 || weatherInfo.pollution <= 100) {
      // Moderate (51-100)
      $(".aqi").css("background-color", "yellow");
    }
    else if(weatherInfo.pollution >= 101 || weatherInfo.pollution <= 150) {
      // Unhealthy for Sensitive Groups (101-150)
      $(".aqi").css("background-color", "orange");

    }
    else if(weatherInfo.pollution >= 151 || weatherInfo.pollution <= 200) {
      // Unhealthy (151-200)
      $(".aqi").css("background-color", "red");

    }
    else if(weatherInfo.pollution >= 201 || weatherInfo.pollution <= 300) {
      // Very Unhealthy (201-300)
      $(".aqi").css("background-color", "purple");

    }
    else {
      // Hazardous (301-500)
      $(".aqi").css("background-color", "maroon");
    }
    

    // weather conditions based on icon:
    if (weatherInfo.weatherIcon === "01d") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Clear Skies (day)")
      );
    } else if (weatherInfo.weatherIcon === "01n") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Clear Skies (night)")
      );
    } else if (weatherInfo.weatherIcon === "02d") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Few Clouds (day)")
      );
    } else if (weatherInfo.weatherIcon === "02n") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Few Clouds (night)")
      );
    } else if (weatherInfo.weatherIcon === "03d") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Scattered Clouds")
      );
    } else if (weatherInfo.weatherIcon === "04d") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Broken Clouds")
      );
    } else if (weatherInfo.weatherIcon === "09d") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Rain Showers")
      );
    } else if (weatherInfo.weatherIcon === "10d") {
      $("#weatherData").append($("<p>").text("Weather Conditions: Rain (day)"));
    } else if (weatherInfo.weatherIcon === "10n") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Rain (night)")
      );
    } else if (weatherInfo.weatherIcon === "11d") {
      $("#weatherData").append(
        $("<p>").text("Weather Conditions: Thunderstorms")
      );
    } else if (weatherInfo.weatherIcon === "13d") {
      $("#weatherData").append($("<p>").text("Weather Conditions: Snow"));
    } else if (weatherInfo.weatherIcon === "50d") {
      $("#weatherData").append($("<p>").text("Weather Conditions: Mist"));
    } else {
    }

    // AJAX call for the hiking API
    hikingAPI(lat, lon);
  });
}

function hikingAPI(
  lat,
  lon,
  maxDistance = 30,
  maxResults = 10,
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
        picture: response.trails[i].imgSqSmall
      };

      // Display list of 10 trails nearby w/ info
      var newHike = $("<li>")
        .attr("id", "trail-number-" + i)
        .text(trailInfo.name);
      newHike.css("border", "1px solid black");
      var hikeSummary = $("<p>").text(trailInfo.summary);
      var hikeLength = $("<p>").text("Length: " + trailInfo.length + " miles");
      var hikeElevation = $("<p>").text(
        "Elevation Gain: " + trailInfo.elevation + " feet"
      );
      var hikeDifficulty = $("<p>").text("Difficulty: " + trailInfo.difficulty);
      let hikePic = $("<img>").attr({
        src: trailInfo.picture,
        id: "trail-picture"
      });

      // Append
      $("#hikingList").append(newHike);
      newHike.append(hikeSummary, hikeLength, hikeElevation, hikeDifficulty);

      if (trailInfo.picture != "") {
        newHike.append(hikePic);
      }

      trails.push(trailInfo);
    }
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
    var marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(trailPopup)
      .addTo(map);
  }
}

// Sort output based on user input
function sortHikes(trails, user, weather) {

  // console.log(trails.length);
  for (let i = 0; i < trails.length; i++) {
    let minDist = parseFloat(user.minDistance);
    let maxDist = parseFloat(user.maxDistance);
    let trailDist = trails[i].length;
    let minElev = parseFloat(user.minElevation);
    let maxElev = parseFloat(user.maxElevation);
    let trailElevation = trails[i].elevation;

    // console.log(minElev, maxElev, trailElevation);
    // Sort by hiking distance
    if (minDist < trailDist && trailDist < maxDist) {
      console.log(trails[i].name + " show hike");
    }

    // Sort by elevation change
    if (minElev < trailDist && trailDist < maxElev) {
      console.log(trails[i].name + "lets hike");
    }
  }

  return trails.filter(function (thisTrail) {
    if (
      thisTrail.length > parseFloat(user.minDistance) &&
      thisTrail.length < parseFloat(user.maxDistance) &&
      parseFloat(user.minElevation) < thisTrail.elevation &&
      thisTrail.elevation < parseFloat(user.maxElevation)
    ) {
      return true;
    }
  });
  // console.log(trails);
}




// scroll button 

//Get the button
var mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

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
