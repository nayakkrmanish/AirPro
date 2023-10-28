const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("https");
const path = require("path");

app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res) {
  let cityName = req.body.cityName;
  const authId = "f3be00ef633bbd214d4d531b1ba422e6";

  // DIRECT GEOCODING CALL
  let url =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=5&appid=" +
    authId;

  http.get(url, function (response) {
    console.log("GEOCODING STATUS CODE: ", response.statusCode);
    if (response.statusCode === 200) {
      response.on("data", function (data) {
        let geocodeData = JSON.parse(data);

        if (geocodeData.length !== 0) {
          let name = geocodeData[0].name;
          let lat = geocodeData[0].lat;
          let lon = geocodeData[0].lon;
          // console.log(geocodeData);
          console.log(name);
          console.log(lat);
          console.log(lon);

          // DATA GATHERED FOR AQI CALL

          aqiuql =
            "https://api.openweathermap.org/data/2.5/air_pollution?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=" +
            authId;

          http.get(aqiuql, function (response) {
            response.on("data", function (data) {
              // Parse the JSON response into airdata variable
              let airdata = JSON.parse(data);

              // Retrieve the Air Quality Index (AQI)
              let aqi = airdata.list[0].main.aqi;
              console.log("AQI:", aqi);

              let airQualityDescription = "";

              switch (aqi) {
                case 1:
                  airQualityDescription = "Good";
                  break;

                case 2:
                  airQualityDescription = "Fair";
                  break;

                case 3:
                  airQualityDescription = "Moderate";
                  break;

                case 4:
                  airQualityDescription = "Poor";
                  break;

                case 5:
                  airQualityDescription = "Very Poor";
                  break;

                default:
                  airQualityDescription = "Unknown";
              }

              console.log("The air quality is:", airQualityDescription);

              // Retrieve Carbon Monoxide (CO) value
              let co = airdata.list[0].components.co;
              console.log("CO:", co);

              // Retrieve Nitric Oxide (NO) value
              let no = airdata.list[0].components.no;
              console.log("NO:", no);

              // Retrieve Nitrogen Dioxide (NO2) value
              let no2 = airdata.list[0].components.no2;
              console.log("NO2:", no2);

              // Retrieve Ozone (O3) value
              let o3 = airdata.list[0].components.o3;
              console.log("O3:", o3);

              // Retrieve Sulfur Dioxide (SO2) value
              let so2 = airdata.list[0].components.so2;
              console.log("SO2:", so2);

              // Retrieve PM2.5 (Fine Particulate Matter) value
              let pm2_5 = airdata.list[0].components.pm2_5;
              console.log("PM2.5:", pm2_5);

              // Retrieve PM10 (Coarse Particulate Matter) value
              let pm10 = airdata.list[0].components.pm10;
              console.log("PM10:", pm10);

              // Retrieve Ammonia (NH3) value
              let nh3 = airdata.list[0].components.nh3;
              console.log("NH3:", nh3);

              // console.log(aqiuql);
              // console.log(airdata);
            });
          });
        } else {
          console.error("No matching location found.");
          // res.status(404).send("No matching location found.");
        }
      });
    } else {
      console.error("Geocoding request failed. Invalid location entered.");
      // res.status(500).send("Invalid location details");
      return; // STOPS EXECUTION
    }
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(8080, function () {
  console.log("Server started on port 8080");
});
