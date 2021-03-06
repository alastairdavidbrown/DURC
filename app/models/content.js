// app/models/content.js

var mongoose = require('mongoose');

// define the schema for our user model
var contentSchema = mongoose.Schema({
		id:		String,
		date:	Date,
		type:	String,
		heading: String,
		content: String,
		image: String
},{ collection : 'content' });



// create the model for users and expose it to our app
module.exports = mongoose.model('Content', contentSchema);
