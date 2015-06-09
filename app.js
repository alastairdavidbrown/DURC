// app.js - load dependencies and listen!
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var util = require('util')
var session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

// set the view engine to ejs, cookie parser
app.set('view engine', 'ejs');		// View engine
app.use(express.static('public'));	// Static folder
app.use(cookieParser());			
app.use(bodyParser.json());			// rbody parser
app.use(bodyParser.urlencoded({
	extended: true
})); 								// for parsing application/x-www-form-urlencoded
app.use(multer()); 					// for parsing multipart/form-data
//routes

//secret: 'span0dd2',
app.use(session({
	secret: 'durc150607',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());		// passport authentication
app.use(passport.session());
app.use(flash());					// flash for messaging
app.use(morgan('combined'));		// logger

var configDB = require('./config/database.js');		// config the database
console.log("Connecting to " + configDB.url);

mongoose.connect(configDB.url); 					// connect to our database
require('./config/passport')(passport); 			// pass passport for configuration
require('./app/routes.js')(app, passport); 			// load our routes and pass in our app and fully configured passport

console.log("Starting on port:" + process.env.PORT)
app.listen(process.env.PORT || 3000);									