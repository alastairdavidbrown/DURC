// app/routes.js

// stop delete or edits crashing if id not found.
// res/respose consistent
// break the monolith
// abstract get content and get rid of confimration page
// get rid of console logging
// check big messages are handled well
// content-confirm consistency of parameters
// abstract the findByID and find's
// remove regexps on the :params shouldn't be required if absolute paths used on the hrefs in the template. 
// get rid of the _ from the _contents etc.
// check exception handling on all queries


// Models -------------------------------
// User Model
var User = require('../app/models/user');
// Contact Model
var Contact = require('../app/models/contact');
// Content Model
var Content = require('../app/models/content');
// ContentType Model
var ContentType = require('../app/models/contenttype');

// Mongoose -----------------------------
var mongoose = require('mongoose');


// file system
var fs = require('fs');

module.exports = function (app, passport,express) {
	
	// START Handler for contact form post
	app.post('/contact', function (request, response) {

		
		// Persist the contact		
		var newContact = new Contact();
		
		newContact.fname = request.body.fname;
		newContact.lname = request.body.lname;
		newContact.email = request.body.email;
		newContact.phone = request.body.phone;
		newContact.message = request.body.message;
		newContact.date = new Date();
		
		// Check the size, if it's massive, redirect to the contact form with a message
		if (JSON.stringify(request.body).length > 2048) {
			response.render('contact', {
					user: request.user,
					message: 'Wow that\'s big, try typing a bit less!' });
		}else{
			newContact.save(function (err) {
				if (err) return console.error(err); 
			});
					
			// confirm to the user that we'll get back
			response.render('contact-confirm', {
				user: request.user
			});
			
					
		}
		
		response.end();
			

	});
	
	app.get('/content-delete/:id([0-9abcde]*)', isLoggedIn, function (request, response) {
		
		console.log("Deleting" + request.params.id);
		findOneContentAndAct(request.params.id, request, response, 'content-confirm.ejs', deleteData);
	});

		
	// Slightly ugly route to avoid matching the script includes the pattern looks like a mongoose object id
	app.get('/content-edit/:id([0-9abcde]*)', isLoggedIn, function (request, response) {
		
		findOneContentAndAct(request.params.id, request, response, 'content-edit.ejs', showData);
			
	});
	
	app.post('/content-edit/:id', isLoggedIn, function (request, response) {
		
		findOneContentAndAct(request.params.id, request, response, 'content-confirm.ejs', saveData);


	});
	
	app.post('/create-content/:type(event|community|vison)', isLoggedIn, function (request, response) {

		// Persist the content		
		var newContent = new Content();
		
		newContent.date = new Date();
		newContent.heading = request.body.heading;
		newContent.content = request.body.content;
		newContent.type = request.body.type; 
		console.log("In Create-content type is " + request.body.type);
		
		// Check the size, if it's massive, redirect to the contact form with a message
		console.log("Request Body is:" + JSON.stringify(request.body).length);
		if (JSON.stringify(request.body).length > 2048) {
			response.render('create-content', {
					message: 'Wow that\'s big, try typing a bit less!' });
		}else{
			newContent.save(function (err) {
				console.log(err);
				if (err) return console.error(err); // we should handle this
			});
					
			// confirm to the user that we'll get back
			response.render('content-confirm.ejs', {
				query: request.query,
				user: request.user,
				type: request.body.type
			});
					
		}
		
		response.end();
			

	});
	
	app.get('/', function (req, res) {		
		res.render('index.ejs', {user: req.user});
	});
	
	
	app.get('/show-content/:type(event|community|vision)', function (req, res) {
		
		// Look up the content type 
		var _contentType;
		console.log("Looking for content type " + req.params.type);
		ContentType.find({'type': req.params.type}, function(err, queryContentType, _contentType) {
			if (err){
				console.log(err);
				return(err);
			}
			_contentType =  {type: queryContentType[0].type, description: queryContentType[0].description};
			console.log("Content type is " + _contentType.type + " description is " + _contentType.description);

			// Now get the content 
			var _content = [];
			Content.find({'type': req.params.type}, function(err, queryContent) {
				var i = 0;
				queryContent.forEach(function(content) {
					_content[i] = {id: content._id, date: content.date, type: content.type, heading: content.heading, content: content.content};
					i++;
				});

				res.render('show-content', {
						contentType: _contentType,
						user: req.user,
						content: _content
				});
			});
		});		
	});
	
	app.get('/community', function (req, res) {		
		res.render('community.ejs', {user: req.user});
	});
	
	app.get('/vision', function (req, res) {		
		res.render('vision.ejs', {});
	});
	
	// the login form
	app.get('/login', function (req, res) {		
		res.render('login.ejs', {
			message: req.flash('loginMessage'),
			user: req.user
		});
	});

	// the contact page
	app.get('/contact', function (req, res) {
		
		res.render('contact.ejs', {
			user: req.user,
			message: req.flash('contactMessage')
		});
	});
	
	// Logout
	app.get('/logout', isLoggedIn, function (req, res) {
		req.logout();
		req.session.destroy();
		res.render('index.ejs', {user: req.user});
	});

	// Page to show contacts received
	app.get('/contacts', isLoggedIn, function (req, res) {

		var _contacts = [];

		Contact.find({}, function(err, queryContacts) {
			var i = 0;
    		queryContacts.forEach(function(contact) {
				_contacts[i] = {date: contact.date, fname: contact.fname, lname: contact.lname, phone: contact.phone, email: contact.email, message: contact.message };
				i++;
			});

			res.render('show-contacts.ejs', {
				user: req.user, 
				contacts: _contacts
			});
	    });
	});

	
	// Page to CRUD content - regexp to avoid recursion for js loads firing for loading e.g. /create-content/fragment.js
	app.get('/create-content/:type(event|community|vision)', isLoggedIn, function (req, res) {

		console.log("In Create Content, type is " + req.params.type);
		var _content = [];
		
		Content.find({'type': req.params.type}, function(err, queryContent) {
			var i = 0;
    		queryContent.forEach(function(content) {
				_content[i] = {id: content._id, date: content.date, type: content.type, heading: content.heading, content: content.content};
				i++;
			});
			console.log("Retrieved " + _content.length + " content lines")
			
			res.render('create-content.ejs', {
					query: req.query,
					user: req.user,
					type: req.params.type,
					content: _content
			});
		});
	});	
	

	
	
	// The images pages
	app.get('/gallery', function (req, res) {
		
		fs.readdir(__dirname + '/../public/images/OurHistory', function (err, files) {
  			if (err) throw err;
			res.render('gallery.ejs', {
				user: req.user,
				files: files
			});
		});
		

	});
	
	// authentication route, used by the login form
	app.post('/authenticate', passport.authenticate('local-login', {
		//successRedirect: '/contacts', // redirect to the secure profile section
		successRedirect: '/create-content/event', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));


	
	// Helpers
	function isLoggedIn(req, res, next) {

		//if (req.isAuthenticated())
		if (req.user)
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/login');
	}


};

// ------------------------------------------------
// findOneContentAndAct: Helper that gets content and calls acallback that's passed in
function findOneContentAndAct(id,req, res, template, callback)
{
	console.log("In findOneContentAndAct");
	Content.findById(id,function (err, _content) {
				if (err){
					callback(err,null, req, res, template);
				}else{  // 
					callback(null, _content, req, res, template);
				}
		
	});

}

var deleteData = function(err, _content, req, res, template){
	console.log("In delete data");
	_content.remove();
	res.render(template, {
			user: req.user,
			content: _content,
			type: _content.type
	});
}

var showData = function(err, _content, req, res, template){
	console.log("in showData:" + _content.heading + "user:" + req.user  + "template:" + template);
	res.render(template, {
			user: req.user,
			content: _content
	});
	
}

var saveData = function(err, _content, req, res, template){
	console.log("in saveData:" + _content.heading + "user:" + req.user  + "template:" + template);
	_content.heading = req.body.heading;
	_content.content = req.body.content;
	_content.save(function (err) {
		if (err) return (err);
		console.log("Saved");				
		res.render(template, {
				user: req.user,
				content: _content,
				type: _content.type
		});
	});
}	

