const express = require('express');
const bodyParser = require('body-parser');

const fetch = require('node-fetch');
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/", (req,res)=>{
    const sendData = {location: "Location", temp: "Temp", disc: "Description", feel: "Feel-like", humidity: "Humidity", speed: "Speed", imageUrl: ""};
    res.render("index", {sendData : sendData});
});

app.post("/", async (req,res)=>{
    let location = await req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.APIKEY}&units=metric`;
    const response = await fetch(url);
    const weatherData = await response.json();
    //console.log(weatherData);
    const temp = weatherData.main.temp;
   //console.log(temp);
   const disc = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    const sendData={};

    sendData.location = location;
    sendData.temp=temp;
    sendData.disc=disc;
    sendData.feel=weatherData.main.feels_like
    sendData.humidity=weatherData.main.humidity;
    sendData.speed=weatherData.wind.speed;
    sendData.imageUrl=imageUrl;
    res.render("index",{sendData:sendData});
});

app.listen(3000, (req,res)=>{
    console.log('server is running');
});