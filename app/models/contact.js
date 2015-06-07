// app/models/contacts.js

var mongoose = require('mongoose');

// define the schema for our user model
var contactSchema = mongoose.Schema({
		date:	Date,
		lname: String,
		fname: String,
		email: String,
		phone: String,
		message: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Contact', contactSchema);