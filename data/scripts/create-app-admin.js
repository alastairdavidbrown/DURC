var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//
//// load up the user model
var User = require('../../app/models/user');
var Contact = require('../../app/models/contact');


//var configDB = require('../../config/database');
mongoose.connect(process.env.DB_URL_APP); // connect to the database
console.log(process.env.DB_URL_APP)

console.log(process.argv[2] + ":" + process.argv[3] )
if (!process.argv[2] || !process.argv[3]){
	console.log("Usage node create-app-admin.js <user name> <password>");
	process.exit();
}

var uname = process.argv[2];
var password = process.argv[3];
console.log(uname + ":" + password)
function createUser(){
	var newUser = new User();
	
	// set the user's local credentials
	newUser.uname = uname;
	newUser.password = newUser.generateHash(password);
	
	newUser.save(function (err) {
		if (err) return console.error(err); // we should handle this
		process.exit();
	});		
}

createUser();
