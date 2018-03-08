var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var apiKey = 'dae42d024732762e897bfd926444a4a8';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(require('./tasks'));

app.listen(3000, ()=>{
	console.log('App is listening on 3000...');
});