var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//
//// load up the user model
var User = require('../../app/models/user');
var Contact = require('../../app/models/contact');


var configDB = require('../../config/database');
mongoose.connect(configDB.url); // connect to our database


if (!process.argv[2] || !process.argv[3]){
	console.log("Usage node insert-user.js <user name> <password>");
	process.exit();
}

var uname = process.argv[2];
var password = process.argv[3];

function createUser(){
	var newUser = new User();
	
	// set the user's local credentials
	newUser.uname = uname;
	newUser.password = newUser.generateHash(password);
	console.log("Uname" + newUser.uname + ":" + newUser.password + newUser.validPassword(password));
	newUser.save(function (err) {
		if (err) return console.error(err); // we should handle this
		process.exit();
	});		
}

createUser();




