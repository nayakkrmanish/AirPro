//  =========================================================

//  Author: Naveen Upadhaya, Manish Kumar Nayak

// ==========================================================

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");

// Serving static files from the "public" directory
app.use(express.static(path.join(__dirname)));

// body parsing middlewares to extract data
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res) {
  let cityName = req.body.cityName;
  const apiKey = "jIaxxVICKWoXB4giCeDR0w==nHZg9TYTpT7EfLwH"; // Replace with your API key

  const options = {
    hostname: "api.api-ninjas.com",
    path: `/v1/airquality?city=${cityName}`,
    headers: {
      "X-Api-Key": apiKey,
    },
  };

  const apiRequest = https.get(options, (apiResponse) => {
    let data = "";

    apiResponse.on("data", (chunk) => {
      data += chunk;
    });

    apiResponse.on("end", () => {
      try {
        if (apiResponse.statusCode === 200) {
          const aqiData = JSON.parse(data);

          const concentrations = {
            CO: aqiData.CO.concentration,
            NO2: aqiData.NO2.concentration,
            O3: aqiData.O3.concentration,
            SO2: aqiData.SO2.concentration,
            "PM2.5": aqiData["PM2.5"].concentration,
            PM10: aqiData["PM10"].concentration,
          };

          res.json(concentrations); // Send the concentrations data

          console.log(concentrations);
        } else {
          console.error(
            "Request failed with status code:",
            apiResponse.statusCode
          );
          console.log("Received data:", data);
          res.status(500).json({ error: "Failed to fetch AQI data" });
        }
      } catch (error) {
        console.error("Parsing Error:", error);
        console.log("Raw data:", data);
        res.status(500).json({ error: "Failed to parse AQI" });
      }
    });
  });

  apiRequest.on("error", (error) => {
    console.error("Request failed:", error);
    res.status(500).json({ error: "Failed to fetch AQI data" });
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
