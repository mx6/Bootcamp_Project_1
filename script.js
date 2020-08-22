// Testing AirVisual API & Hiking API
// AirVisual API: https://api-docs.airvisual.com/?version=latest
// Hiking Project API: https://www.hikingproject.com/data

// Global Variables
var lon;
var lat;

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
    var queryURL = "http://api.airvisual.com/v2/city?city=" + city + "&state=" + state + "&country=USA&key=" + apiKey;
    
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response); // JSON return for Oregon, USA
    
        // Weather Data we want:
        // Lat/lon coordinates
        lon = response.data.location.coordinates[0];
        lat = response.data.location.coordinates[1];
        console.log("Lat: " + lat + " Lon: " + lon);
    
        // Max/min temp in Celsius
        var minTemp = response.data.current.weather.tp;
        // var maxTemp = 
        console.log("Min Temp: " + minTemp);
        // console.log("Max Temp: " + maxTemp);
    
        // Humidity
        var humidity = response.data.current.weather.hu;
        console.log(humidity + "%");
    
        // Conditions (sunny/cloudy/rainy/snowy)
    

        // Display weather data
        $("#weatherData").empty();
        $("#weatherData").append( $("<h2>").text(response.data.city + ", " + state) );
        $("#weatherData").append( $("<div>").text("Temperature: " + minTemp).addClass("temp"));
        $("#weatherData").append( $("<div>").text("Humidity: " + humidity).addClass("humidity"));

        // AJAX call for the hiking API
        hikingAPI(lat,lon);
        maparea(lat, lon);
    });
}


function hikingAPI(lat,lon) {
    const authKey = "200881533-cbba50330892ef7f2dd269f567c7d3dd";
    let queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&key=" + authKey;
    
    $.ajax( {
      url: queryURL,
      method: "GET"
    }).then( function(response) {
        console.log(response);

        var trailNames = [];
        $(".hikingList").empty(); // clear screen for new info
        // Data from API
        for (var i=0; i < response.trails.length; i++) {
            var name = response.trails[i].name;
            trailNames.push(name);

            // Display list of 10 trails nearby
            var newHike = $("<li>").text(trailNames[i]);
            

            // Append 
            $(".hikingList").append(newHike);

        } 
      console.log(trailNames);
     });
}

function maparea(lat, lon) {
  console.log(lat, lon);
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia3BlZ2VkZXIiLCJhIjoiY2tlNXk3ZHJzMTdodjJ1dWxlZ2VrNTA5MCJ9.aHGcdq3jxUrUvysKk66J3Q";
  var map = new mapboxgl.Map({
    container: "map",
    center: [lon, lat],
    style: "mapbox://styles/mapbox/outdoors-v11",
    zoom: 9
  });
}
