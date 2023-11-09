// #########################################################################

//     Authour : Naveen Upadhyay, Manish Nayak, Ravipati Venkatat Sai Mohan Kumar Bhanu

// #########################################################################

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("https");
const path = require("path");
const favicon = require("serve-favicon");

const error_page = `    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Location Error</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }
        h1 {
            font-size: 36px;
            color: red;
        }
        p {
            font-size: 18px;
            color: #333;
        }
    </style>
</head>
<body>
    <h1>Invalid Location Entered</h1>
    <p>Please enter a valid location to get the air quality information.</p>
</body>
</html>`;

app.use(express.static(path.join(__dirname)));
app.use(
  favicon(
    path.join(
      __dirname,
      "public",
      "assets",
      "img",
      "logo",
      "favicon",
      "leaf.ico"
    )
  )
);
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

              // res.status(200).json({
              //   name: name,
              //   aqi: aqi,
              //   airQualityDescription: airQualityDescription,
              //   co: co,
              //   no: no,
              //   no2: no2,
              //   o3: o3,
              //   so2: so2,
              //   pm2_5: pm2_5,
              //   pm10: pm10,
              //   nh3: nh3,
              // });

              const result = {
                name: name,
                aqi: aqi,
                airQualityDescription: airQualityDescription,
                co: airdata.list[0].components.co,
                no: airdata.list[0].components.no,
                no2: airdata.list[0].components.no2,
                o3: airdata.list[0].components.o3,
                so2: airdata.list[0].components.so2,
                pm2_5: airdata.list[0].components.pm2_5,
                pm10: airdata.list[0].components.pm10,
                nh3: airdata.list[0].components.nh3,
              };
              res.write("<!DOCTYPE html>\n");
              res.write('<html lang="en">\n');
              res.write("<head>\n");
              res.write('    <meta charset="UTF-8">\n');
              res.write("    <title>Air Quality Information</title>\n");
              res.write("    <style>\n");
              res.write("        body {\n");
              res.write("            font-family: Arial, sans-serif;\n");
              res.write("            margin: 0;\n");
              res.write("            padding: 0;\n");
              res.write(
                "            background-image: url('https://vectormine.b-cdn.net/wp-content/uploads/greenhouse_gases_outline_concept-1.jpg');\n"
              );
              res.write("        }\n");
              res.write("        .container {\n");
              res.write("            width: 30%;\n");
              res.write("            margin: 10rem auto;\n");
              res.write("            background-color: black;\n");
              res.write("            padding: 20px;\n");
              res.write("            border-radius: 5px;\n");
              res.write(
                "            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n"
              );
              res.write("        }\n");
              res.write("        h1, h3 {\n");
              res.write("            text-align: center;\n");
              res.write("            color: #333;\n");
              res.write("        }\n");
              res.write("        .data {\n");
              res.write("            margin-top: 20px;\n");
              res.write("            text-align: center;\n");
              res.write("        }\n");
              res.write("        p {\n");
              res.write("            color: white;\n");
              res.write("            margin: 5px 0;\n");
              res.write("            font-size: 22px;\n");
              // res.write("            color: #555;\n");
              res.write("        }\n");
              res.write("    </style>\n");
              res.write("</head>\n");
              res.write("<body>\n");
              res.write('    <div class="container">\n');
              res.write(
                "        <h1 style='color:#16FF00'>Air Quality Information</h1>\n"
              );
              res.write('        <div class="data">\n');
              res.write(
                `            <h3 style='color:#00A9FF'>Air Quality Information for <u>${result.name}</u></h3>\n`
              );
              res.write(
                `            <p>Carbon Monoxide (CO): ${result.co}</p>\n`
              );
              res.write(`            <p>Nitric Oxide (NO): ${result.no}</p>\n`);
              res.write(
                `            <p>Nitrogen Dioxide (NO2): ${result.no2}</p>\n`
              );
              res.write(`            <p>Ozone (O3): ${result.o3}</p>\n`);
              res.write(
                `            <p>Sulfur Dioxide (SO2): ${result.so2}</p>\n`
              );
              res.write(`            <p>PM2.5: ${result.pm2_5}</p>\n`);
              res.write(`            <p>PM10: ${result.pm10}</p>\n`);
              res.write(`            <p>Ammonia (NH3): ${result.nh3}</p>\n`);
              res.write(
                `<h2 style='color:red'><i>The overall air quality here is ${result.airQualityDescription}</i><h2>`
              );
              res.write("        </div>\n");
              res.write("    </div>\n");
              res.write("</body>\n");
              res.write("</html>\n");
              res.end();
              res.send();
              // res.status(200).json(result);
            });
          });
        } else {
          res.write(error_page);
          req.end;
          res.send();
          console.error("No information available for the provided location.");
          // res.status(404).send("No matching location found.");
        }
      });
    } else {
      console.log(cityName);
      console.error("Geocoding request failed. Invalid location entered.");
      res.write(error_page);
      req.end;
      res.send();
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
