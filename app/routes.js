// app/routes.js

// todo Secure services
// res/respose consistent
// break the momolith
// abstract get content and get rid of confimration page
// get rid of console logging
// add footer fragment.

// load up the contact model
var Contact = require('../app/models/contact');
// load up the user model
var User = require('../app/models/user');
// load the content model
var Content = require('../app/models/content');
// Mongoose
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
		console.log("Request Body is:" + JSON.stringify(request.body).length);
		if (JSON.stringify(request.body).length > 2048) {
			response.render('contact', {
					message: 'Wow that\'s big, try typing a bit less!' });
		}else{
			newContact.save(function (err) {
				console.log(err);
				if (err) return console.error(err); // we should handle this
			});
					
			// confirm to the user that we'll get back
			response.render('contact-confirm');
					
		}
		
		response.end();
			

	});
	
	app.get('/content-delete/:id([0-9abcde]*)', function (request, response) {
		
		console.log("Deleting" + request.params.id);
		Content.findById((request.params.id),function (err, _content) {
				if (err){
					return(err);
				}else{  // we should handle this but it's a mongo bug so swallow it
					if(_content){
						_content.remove();
						console.log("deleted" + _content._id + ":" + _content.heading);
						response.render('content-confirm', {
							content: _content
						});
					}else{
						response.render('save-error');
					}
				}
			});
	});

		
		// Slightly ugly route to avoid matching the script includes the pattern looks like a mongoose object id
	app.get('/content-edit/:id([0-9abcde]*)', function (request, response) {
		
		Content.findById((request.params.id),function (err, _content) {
				if (err){
					return(err);
				}else{  // we should handle this but it's a mongo bug so swallow it
					response.render('content-edit.ejs', {
						content: _content
					});
				}
				
		});
	});
	
	app.post('/content-edit/:id', function (request, response) {

		Content.findById((request.params.id),function (err, _content) {
				if (err){
					return(err);
				}else{  // we should handle this but
					console.log("Loaded: " + request.params.id);
					console.log("Content" + _content._id + ":" + _content.heading + ":" + _content.content);
					console.log("Request" + request.body.heading + ":" + request.body.content);
					_content.heading = request.body.heading;
					_content.content = request.body.content;
					console.log("Content" + _content._id + ":" + _content.heading + ":" + _content.content);

					_content.save(function (err) {
    					if (err) return handleError(err);
						console.log("Saved");
    					response.render('content-confirm.ejs');
  					});
				}
				
		});

	});
	
	app.post('/create-content/:type(event|community)', function (request, response) {

		// Persist the contact		
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
		res.render('index.ejs', {});
	});
	
	
	app.get('/events', function (req, res) {
		
		var _content = [];
		
		Content.find({}, function(err, queryContent) {
			var i = 0;
    		queryContent.forEach(function(content) {
				_content[i] = {id: content._id, date: content.date, type: content.type, heading: content.heading, content: content.content};
				i++;
			});
				
			res.render('events.ejs', {
					content: _content
			});
		});
	});
	
	app.get('/community', function (req, res) {		
		res.render('community.ejs', {});
	});
	
	app.get('/vision', function (req, res) {		
		res.render('vision.ejs', {});
	});
	
	// the login form
	app.get('/login', function (req, res) {		
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	// the contact page
	app.get('/contact', function (req, res) {
		
		res.render('contact.ejs', {
			message: req.flash('contactMessage')
		});
	});
	
	// Logout
	app.get('/logout', function (req, res) {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
		req.logout();
		req.session.destroy();
	});

	// Page to show contacts received
	app.get('/contacts', isLoggedIn, function (req, res) {

		var _contacts = [];

		Contact.find({}, function(err, queryContacts) {
			var i = 0;
    		queryContacts.forEach(function(contact) {
				contacts[i] = {date: contact.date, fname: contact.fname, lname: contact.lname, phone: contact.phone, email: contact.email, message: contact.message };
				i++;
			});

			res.render('show-contacts.ejs', {
				user: req.user, 
				contacts: _contacts
			});
	    });
	});

	
	// Page to CRUD content - regexp to avoid recursion for js loads firing for loading e.g. /create-content/fragment.js
	app.get('/create-content/:type(event|community)', isLoggedIn, function (req, res) {

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