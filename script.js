// Testing AirVisual API & Hiking API
// AirVisual API: https://api-docs.airvisual.com/?version=latest
// Hiking Project API: https://www.hikingproject.com/data

// Global Variables
var lon;
var lat;


var cityInput = "Portland";
var state = "Oregon";

weatherAPI(); // call functions

function weatherAPI() {
    var apiKey = "0146d325-a946-4208-8c5f-c9c2cb554ac6";
    var queryURL = "http://api.airvisual.com/v2/city?city=" + cityInput + "&state=" + state + "&country=USA&key=" + apiKey;
    
    
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
    

        // AJAX call for the hiking API
        hikingAPI();
    });


}

function hikingAPI() {
    const authKey = "200881533-cbba50330892ef7f2dd269f567c7d3dd"
    let queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + lat + "&lon=" + lon + "&key=" + authKey;
    
    $.ajax( {
      url: queryURL,
      method: "GET"
    }).then( function(response) {
      console.log(response);

    var trailNames = [];
    // Data from API
    for (var i=0; i < response.trails.length; i++) {
        var name = response.trails[i].name;
        trailNames.push(name);
    } 
    console.log(trailNames);

    });
}



