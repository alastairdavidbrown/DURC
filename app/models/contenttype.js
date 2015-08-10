// app/models/contenttype.js

var mongoose = require('mongoose');

// define the schema for our user model
var contenttypeSchema = mongoose.Schema({
		type:	String,
		description: String,
		layout: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('ContentType', contenttypeSchema);