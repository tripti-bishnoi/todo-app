var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var apiKey = 'dae42d024732762e897bfd926444a4a8';

app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
	res.render('index', {title: 'Home', weather: null, error: null}); //use res.render when working with templating language, instead of res.send
});

app.post('/',(req, res)=>{
	var city = req.body.city;
	var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
	request(url, (err, response, body)=>{
		if(err){
			res.render('index', {title: 'Home', weather: null, error: 'Error, please try again.'});
		} else{
			var weather = JSON.parse(body);
			if(weather.main == undefined){
				res.render('index', {title: 'Home', weather: null, error: 'Error, please try again.'});
			} else{
				var weatherText = `It's ${weather.main.temp} degrees in ${weather.name}`;
				res.render('index', {title: 'Home', weather: weatherText, error: null});
			}
		}
	});
});

app.listen(3000, ()=>{
	console.log('App is listening on 3000...');
});