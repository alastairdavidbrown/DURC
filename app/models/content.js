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

// get all content
function getAllContent() {

	var _content = [];
		
	Content.find({}, function(err, queryContent) {
		var i = 0;
    	queryContent.forEach(function(content) {
			_content[i] = {	id: mongoose.Types.ObjectID(content._id), 
						   	date: content.date, 
						   	type: content.type, 
						   	heading: content.heading, 
						   	content: content.content};
			i++;
		});
		console.log("Retrieved " + _content.length + " content lines")
	});
	return _content;
};

exports.getAllContent = getAllContent;