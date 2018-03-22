var express = require('express');
var app = express();

// var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configdb = require('./config/db');

//configuration ======================================
mongoose.connect(configdb.url); //connect to our db

require('./config/passport')(passport);

//set up express app ======================================
app.use(morgan('dev')); //log every request to console
app.use(cookieParser()); //read cookies - required for auth

app.use(bodyParser.json()); //get info from html forms
app.use(bodyParser.urlencoded({ extended : true })); //get info from html forms

app.set('view engine', 'ejs'); //set up ejs for templating
app.use(express.static('public'));

//required for passport ======================================
app.use(session({ secret : "ilovebilla" })); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

//routes ======================================
require('./routes')(app, passport);

//launch ======================================
var port = process.env.PORT || 3000;
app.listen(port, ()=>{
 	console.log(`The magic happens on ${port}...`);
});

// MongoClient.connect(configdb.url, (err,database)=>{
// 	if(err) return console.log(`Error occured while connecting with database: ${err}`);
// 	else{

// 		require('./routes')(app, passport, database.db('tripti_app_db')); //adding db name, not the collection name

// 		app.listen(3000, ()=>{
// 			console.log('live on 3000...');
// 		});
// 	}
// });