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
  mph =  math.format(ws * 2.237, { precision: 4 }); // convert m/s to mph
  var arr1 = [tempF, mph];

  return arr1;
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



    // Display weather data
    $("#weatherData").empty();
    $("#weatherData").append($("<h2>").text(response.data.city + ", " + state));
    // $("#weatherData").append(
    //   $("<img>").attr("src", "icon url goes here...")
    // );
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
    // sortHikes(trails, userInputs, weatherInfo);
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
  // Making input into a value
  let minDist = parseFloat(user.minDistance);
  let maxDist = parseFloat(user.maxDistance);
  let minElev = parseFloat(user.minElevation);
  let maxElev = parseFloat(user.maxElevation);

  // Checking if input is a number
  if (isNaN(minDist) === true) {
    minDist = 0;

    // console.log(trails.length);
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
  // console.log(minElev, " + ", maxElev);

  // for (let i = 0; i < trails.length; i++) {
  //   let minDist = parseFloat(user.minDistance);
  //   let maxDist = parseFloat(user.maxDistance);
  //   let trailDist = trails[i].length;
  //   let minElev = parseFloat(user.minElevation);
  //   let maxElev = parseFloat(user.maxElevation);
  //   let trailElevation = trails[i].elevation;
  //   let trailDiff = trails[i].difficulty;
  //   let userDiff = parseInt(user.difficulty);
  //   let minTemp = parseFloat(user.minTemp);
  //   let maxTemp = parseFloat(user.maxTemp);
  //   let temp = weather.minTemp;

  //   console.log(minTemp, maxTemp, temp);

  //   // console.log(minElev, maxElev, trailElevation);
  //   // Sort by hiking distance
  //   if (minDist < trailDist && trailDist < maxDist) {
  //     console.log(trails[i].name + " show hike");
  //   }

  //   // Sort by elevation change
  //   if (minElev < trailDist && trailDist < maxElev) {
  //     console.log(trails[i].name + "lets hike");
  //   }
  //   console.log(i);

  //   if (userDiff == null) {
  //     console.log(trailDiff);
  //     console.log("all trails");
  //   } else if (userDiff <= 6 && trailDiff == "dblack") {
  //     console.log(trailDiff);
  //     console.log("show up to double black");
  //   } else if (userDiff <= 5 && trailDiff == "black") {
  //     console.log(trailDiff);
  //     console.log("show up to black");
  //   } else if (userDiff == 4) {
  //     console.log(trailDiff);
  //     console.log("show up to blue black");
  //   } else if (userDiff <= 3) {
  //     console.log(trailDiff);
  //     console.log("show only blue");
  //   } else if (userDiff == 2) {
  //     console.log(trailDiff);
  //     console.log("show up to green blue");
  //   } else {
  //     console.log(trailDiff);
  //     console.log("show green");
  //   }
  // }
  // return trails;
  // Filter out trails based on user input
  return trails.filter(function (thisTrail) {
    if (
      thisTrail.length > minDist &&
      thisTrail.length < maxDist &&
      minElev < thisTrail.elevation &&
      thisTrail.elevation < maxElev
    ) {
      return true;
    }
  });
  // console.log(trails);
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
// function hikingTrails(trails) {
//   console.log(trails);
//   var newHike = $("<li>")
//     .attr("id", "trail-number-" + i)
//     .text(trailInfo.name);
//   newHike.css("border", "1px solid black");
//   var hikeSummary = $("<p>").text(trailInfo.summary);
//   var hikeLength = $("<p>").text("Length: " + trailInfo.length + " miles");
//   var hikeElevation = $("<p>").text(
//     "Elevation Gain: " + trailInfo.elevation + " feet"
//   );
//   var hikeDifficulty = $("<p>").text("Difficulty: " + trailInfo.difficulty);
//   let hikePic = $("<img>").attr({
//     src: trailInfo.picture,
//     id: "trail-picture"
//   });

//   // Append
//   $("#hikingList").append(newHike);
//   newHike.append(hikeSummary, hikeLength, hikeElevation, hikeDifficulty);

//   if (trailInfo.picture != "") {
//     newHike.append(hikePic);
//   }
// }
