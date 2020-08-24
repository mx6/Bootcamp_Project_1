// Testing AirVisual API & Hiking API
// AirVisual API: https://api-docs.airvisual.com/?version=latest
// Hiking Project API: https://www.hikingproject.com/data
// MapBox API

// Global Variables
var lon;
var lat;
let trails = [];
let city;
var state = "Oregon";

$(document).ready(function () {
  // Retrieve the city input by the user
  $("#startLocation").keypress(function (event) {
    // console.log(event.keyCode);
    // Get the city the user input
    city = $("#startLocation").val().trim();
    if (event.keyCode === 13) {
      weatherAPI(city); // call weather function w/ city input
      $("#startLocation").val("");
    }
  });
});

function weatherAPI(city) {
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
    console.log(response); // JSON return for Oregon, USA

    // Weather Data we want:
    // Lat/lon coordinates
    lon = response.data.location.coordinates[0];
    lat = response.data.location.coordinates[1];
    console.log("Lat: " + lat + " Lon: " + lon);

    let weatherInfo = {
      minTemp: response.data.current.weather.tp, // C
      humidity: response.data.current.weather.hu, // %
      windSpeed: response.data.current.weather.ws, // m/s
      pollution: response.data.current.pollution.mainus,
      weatherIcon: response.data.current.weather.ic,
    };
    

    // Display weather data
    $("#weatherData").empty();
    $("#weatherData").append($("<h2>").text(response.data.city + ", " + state));
    // $("#weatherData").append(
    //   $("<img>").attr("src", "icon url goes here...") 
    // );
    $("#weatherData").append(
      $("<p>")
        .text("Temperature: " + weatherInfo.minTemp + " C")
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
      $("<p>").text("Pollution Level: " + weatherInfo.pollution) 
    );


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
    console.log(response);

    // var trailNames = [];
    $(".hikingList").empty(); // clear screen for new info
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
        difficulty: response.trails[i].difficulty
      };

      // var name = response.trails[i].name;
      // trailNames.push(name);

      // Display list of 10 trails nearby w/ info
      var newHike = $("<li>").text(trailInfo.name);
        newHike.css("border",  "1px solid black");
      var hikeSummary = $("<p>").text(trailInfo.summary);
      var hikeLength = $("<p>").text("Length: " + trailInfo.length + " miles");
      var hikeElevation = $("<p>").text("Elevation Gain: " + trailInfo.elevation + " feet ???");
      var hikeDifficulty = $("<p>").text("Difficulty: " + trailInfo.difficulty);


      // Append
      $("#hikingList").append(newHike);
      newHike.append(hikeSummary);
      newHike.append(hikeLength);
      newHike.append(hikeElevation);
      newHike.append(hikeDifficulty);

      trails.push(trailInfo);
    }
    // console.log(trailNames);
    maparea(lat, lon, trails);
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
  for (let i = 0; i < trails.length; i++) {
    let lng = trails[i].longitude;
    let lat = trails[i].latitude;

    // Create markers with popup
    var marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(trails[i].name))
      .addTo(map);
  }
}
