import express from 'express'
import https from 'node:https'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(express.urlencoded());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 3000



app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", function(req, res){

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){

            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;

            const weatherDescription = weatherData.weather[0].description;

            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p>The weather is currently " + weatherDescription + "</p>")
            res.write("<h1>temperature in " + query + " is " + temp + " degrees celcius.</h1>")
            res.write("<img src=" + imageURL + ">")
            res.send()
        })
    });
});

app.listen(port, function () {
        console.log(`server started ${port}`)
    });