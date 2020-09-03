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
let index;
let hikeDestination;

$(document).ready(function () {
  // Retrieve the city input by the user
  $("#hikeButton").on("click", function (event) {
    // Store all input data in an object:
    userInputs = {
      city: "Bend",
      state: "Oregon",
      // city: $("#city").val().trim(),
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
    // console.log(weatherInfo.weatherIcon);
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
      $("<p>").text("Wind Speed: " + weatherInfo.windSpeed + " mph")
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

    // Call function for weather forecast
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

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    // Reset elements
    $(".forecast").empty();
    $("#1").css("background-color", "rgba(255, 255, 255, 0.719)");
    $("#2").css("background-color", "rgba(255, 255, 255, 0.719)");
    $("#3").css("background-color", "rgba(255, 255, 255, 0.719)");
    $("#4").css("background-color", "rgba(255, 255, 255, 0.719)");
    $("#5").css("background-color", "rgba(255, 255, 255, 0.719)");

    // See which weather conditons were selected by the user
    let selectedConditions = [];
    $(".weatherCondition input:checked").each(function () {
      selectedConditions.push($(this).data().type);
    });
    // console.log(selectedConditions); //display array of checked boxes for the weather
    let dailyIcon = []; // array of weather icon for each forecasted day

    // Get data for 5-day forecast
    for (var i = 1; i < 6; i++) {
      let day = response.daily[i].dt; // ( date of forecast )
      let dailyTemp = response.daily[i].temp.day;
      let dailyHumidity = response.daily[i].humidity;
      let sunrise = response.daily[i].sunrise;
      let sunset = response.daily[i].sunset;
      let icon = response.daily[i].weather[0].icon;
      let iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      // Switch statement to display the 5-day forecast
      switch (i) {
        case 1:
          $("#1").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#1").append($("<img>").attr("src", iconURL));
          $("#1").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#1").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#1").append(
            $("<div>").text("Sunrise: " + unixTimeSun(sunrise) + " (PT)")
          );
          $("#1").append(
            $("<div>").text("Sunset: " + unixTimeSun(sunset) + " (PT)")
          );
          break;

        case 2:
          $("#2").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#2").append($("<img>").attr("src", iconURL));
          $("#2").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#2").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#2").append(
            $("<div>").text("Sunrise: " + unixTimeSun(sunrise) + " (PT)")
          );
          $("#2").append(
            $("<div>").text("Sunset: " + unixTimeSun(sunset) + " (PT)")
          );
          break;

        case 3:
          $("#3").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#3").append($("<img>").attr("src", iconURL));
          $("#3").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#3").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#3").append(
            $("<div>").text("Sunrise: " + unixTimeSun(sunrise) + " (PT)")
          );
          $("#3").append(
            $("<div>").text("Sunset: " + unixTimeSun(sunset) + " (PT)")
          );
          break;

        case 4:
          $("#4").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#4").append($("<img>").attr("src", iconURL));
          $("#4").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#4").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#4").append(
            $("<div>").text("Sunrise: " + unixTimeSun(sunrise) + " (PT)")
          );
          $("#4").append(
            $("<div>").text("Sunset: " + unixTimeSun(sunset) + " (PT)")
          );
          break;

        case 5:
          $("#5").append(
            $("<div>").addClass("forecastDate").text(unixTimestamp(day))
          );
          $("#5").append($("<img>").attr("src", iconURL));
          $("#5").append($("<div>").text("Temp: " + dailyTemp + " °F"));
          $("#5").append($("<div>").text("Humidity: " + dailyHumidity + "%"));
          $("#5").append(
            $("<div>").text("Sunrise: " + unixTimeSun(sunrise) + " (PT)")
          );
          $("#5").append(
            $("<div>").text("Sunset: " + unixTimeSun(sunset) + " (PT)")
          );
          break;
      }

      // Assign icon #'s to sunny/cloudy/rainy/snowy
      if (icon === "01d" || icon === "01n") {
        dailyIcon.push("sunny");
      } else if (
        icon === "02d" ||
        icon === "02n" ||
        icon === "03d" ||
        icon === "03n" ||
        icon === "04d" ||
        icon === "04n"
      ) {
        dailyIcon.push("cloudy");
      } else if (
        icon === "09d" ||
        icon === "09n" ||
        icon === "10d" ||
        icon === "10n" ||
        icon === "11d" ||
        icon === "11n" ||
        icon === "50d" ||
        icon === "50n"
      ) {
        dailyIcon.push("rainy");
      } else if (icon === "13d" || icon === "13n") {
        dailyIcon.push("snowy");
      }
    }

    // console.log(dailyIcon);
    // Compare forecast conditions to user input condidtions
    // If the day's conditions match one of the user's "selected" matches, higihlight the box!
    for (var i = 0; i < dailyIcon.length; i++) {
      if (
        dailyIcon[i] === selectedConditions[0] ||
        dailyIcon[i] === selectedConditions[1] ||
        dailyIcon[i] === selectedConditions[2] ||
        dailyIcon[i] === selectedConditions[3]
      ) {
        // highlight corresponding forecast day
        // if ( $(".forecast").id() === i) {
        //   $(this).css("background-color", "yellow");
        // }
        // console.log("highlight this day: " + i);

        switch (i) {
          case 0:
            $("#1").css("background-color", "orange");
            break;
          case 1:
            $("#2").css("background-color", "orange");
            break;
          case 2:
            $("#3").css("background-color", "orange");
            break;
          case 3:
            $("#4").css("background-color", "orange");
            break;
          case 4:
            $("#5").css("background-color", "orange");
            break;
        }
      }
    }
  });
}

// Display Date from Epoch Time
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

// Get Hour and Minute Time from Epoch Time
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

// Hiking API
function hikingAPI(lat, lon, maxDistance = 30, maxResults = 15) {
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
    "&key=" +
    authKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    // console.log(response);

    $("#hikingList").empty(); // clear screen for new info
    trails = []; // clear trail list

    // Making input into a value
    let minDist = parseFloat(userInputs.minDistance);
    let maxDist = parseFloat(userInputs.maxDistance);
    let minElev = parseFloat(userInputs.minElevation);
    let maxElev = parseFloat(userInputs.maxElevation);
    let minTemp = parseFloat(userInputs.minTemp);
    let maxTemp = parseFloat(userInputs.maxTemp);
    let temp = weatherInfo.minTemp;

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

      if (
        trailInfo.length > minDist &&
        trailInfo.length < maxDist &&
        minElev < trailInfo.elevation &&
        trailInfo.elevation < maxElev &&
        minTemp < temp &&
        temp < maxTemp
      ) {
        trails.push(trailInfo);
      }
    }
    hikingTrails(sortHikes(trails));

    maparea(lat, lon, sortHikes(trails));
  });
}

// Map API, create the map and hike markers
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
function sortHikes(trails) {
  // Filter out trails based on user input
  return trails.filter(function (thisTrail) {
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
}

// Append hiking info to page
function hikingTrails(trails) {
  for (let i = 0; i < trails.length; i++) {
    let newHike = $("<li>").attr({ id: "trail-number-" + i, class: "hike" });
    let hikeName = $("<a>")
      .attr({
        href: trails[i].url,
        target: "_blank",
        class: "hikeName",
      })
      .text(trails[i].name)
      .css("margin-top", "100px");

    let hikeFacts = $("<ul>").attr({class: "hikeFacts"});
    let hikeSummary = $("<p>").text(trails[i].summary);
    let hikeLength = $("<li>").text("Length: " + trails[i].length + " miles");
    let hikeElevation = $("<li>").text(
      "Elevation Gain: " + trails[i].elevation + " feet"
    );
    let hikeDifficulty = $("<li>").text("Difficulty: " + trails[i].difficulty);
    let hikePic = $("<img>").attr({
      src: trails[i].picture,
      class: "trail-picture"
    });

    let directionModal = $("<button>")
      .addClass("w3-button w3-black direction")
      .attr({ id: "hikeDirection-" + i, value: i })
      .text("Get Directions to Hike")
      .css({"border-radius":"4px", "float":"right"});

    // Append
    $("#hikingList").append(newHike);
    newHike.append(
      hikeName,
      directionModal,
      hikeSummary,
      hikeFacts
      );
    hikeFacts.append(
      hikeLength,
      hikeElevation,
      hikeDifficulty,
    );

    if (trails[i].picture != "") {
      $("#hikingList").append(hikePic);
    }
  }

  // Direction button directed to a new page
  $(".direction").on("click", function (event) {
    index = {
      name: trails[$(this).val()].name,
      latitude: trails[$(this).val()].latitude,
      longitude: trails[$(this).val()].longitude
    };

    // Store in hike info for directions
    localStorage.setItem("destination", JSON.stringify(index));
    location.href = "directionMap.html";
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
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
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

// Get searched hike
init();
function init() {
  let destination = JSON.parse(localStorage.getItem("destination"));

  if (destination !== null) {
    hikeDestination = destination;
  }
}

// Direction API
function directionAPI() {
  // Clear page
  $("#turn-by-turn").empty();

  if ($("#totalDistance").text() != null) {
    $("#tripInfo").empty();
  }

  const authKEY = "hVo9dYzXvu21iSyKZbnJiYJOdbtvRCDN";
  let startLoc = $("#startLocation").val();
  let endLat = hikeDestination.latitude;
  let endLon = hikeDestination.longitude;
  let mapquestURL =
    "https://www.mapquestapi.com/directions/v2/route?key=" +
    authKEY +
    "&from=" +
    startLoc +
    "&to=" +
    endLat +
    "," +
    endLon;

  // console.log(mapquestURL);
  $.ajax({
    url: mapquestURL,
    method: "GET"
  }).then(function (response) {
    // Variable to get to turns
    let maneuver = response.route.legs[0].maneuvers;

    // Populate page with trip info
    // let tripInfo = $("<div>").attr("id", "tripInfo").text("Trip Information");
    let tripInfo = $("<div>").attr("id", "tripInfo").append(  $("<h2>").text("Trip Information")  );
    let totalDis = $("<p>").text("Total Distance: " + response.route.distance);
    let tripTime = $("<p>").text(
      "Estimate Trip Time: " +
        new Date(response.route.realTime * 1000).toISOString().substr(11, 8)
    );
    let mapDirection = $("<img>").addClass("mapQuestImg").attr({
      src:
        "https://www.mapquestapi.com/staticmap/v5/map?start=" +
        response.route.locations[0].latLng.lat +
        "," +
        response.route.locations[0].latLng.lng +
        "&end=" +
        response.route.locations[1].latLng.lat +
        "," +
        response.route.locations[1].latLng.lng +
        "&size=@2x&key=" +
        authKEY
    });

    // Create turn by turn directions
    for (let i = 0; i < maneuver.length; i++) {
      let turnDirection = $("<li>").text(maneuver[i].narrative).addClass("directionItems");
      let travelDistance = $("<p>").addClass("directionItems");
      if (maneuver[i].distance > 0) {
        travelDistance.text(
          "Travel: " + maneuver[i].distance.toFixed(1) + " miles"
        );
      } else {
        travelDistance.text("You Have Arrived!!!");
      }

      turnDirection.append(travelDistance);
      $("#turn-by-turn").append(turnDirection);
      // console.log(turnDirection);
    }
    tripInfo.append(totalDis, tripTime, mapDirection);
    $(".w3-container").prepend(tripInfo);
  });
}

// Direction for hike button
$(document).ready(function () {
  $("#hikeDirection").on("click", directionAPI);
});

// let turnType = {
//       0: "straight",
//       1: "slight right",
//       2: "right",
//       3: "sharp right",
//       4: "reverse",
//       5: "sharp left",
//       6: "left",
//       7: "slight left",
//       8: "right u-turn",
//       9: "left u-turn",
//       10: "right merge",
//       11: "left merge",
//       12: "right on ramp",
//       13: "left on ramp",
//       14: "right off ramp",
//       15: "left off ramp",
//       16: "right fork",
//       17: "left fork",
//       18: "straight fork"
//     };
