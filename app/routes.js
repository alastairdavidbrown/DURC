// app/routes.js

// break the monolith
// put the real content into hire
// refactor the get data and render somthging bits to make data passed and responsibiility of getting data clear
// get rid of console logging
// check big messages are handled well
// content-confirm consistency of parameters
// remove regexps on the :params shouldn't be required if absolute paths used on the hrefs in the template. 
// get rid of the _ from the _contents etc.
// check exception handling on all queries
// sort out DB Config for local and remote
// manage-content for home and room rent
// cancel on delete content
// confirm on delete content
// backup content
// rename edit-content
// abstract image locations
// nasty radioimage hack


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
	app.get('/edit-content/:id([0-9abcde]*)', isLoggedIn, function (request, response) {
		
		findOneContentAndAct(request.params.id, request, response, 'edit-content.ejs', showData);
			
	});
	
	app.post('/edit-content/:id', isLoggedIn, function (request, response) {
		
		findOneContentAndAct(request.params.id, request, response, 'content-confirm.ejs', saveData);


	});
	
	app.post('/manage-content/:type(event|community|vison|home)', isLoggedIn, function (request, response) {

		// Persist the content		
		var newContent = new Content();
		
		newContent.date = new Date();
		newContent.heading = request.body.heading;
		newContent.content = request.body.content;
		if (request.body.type = 'home'){
			// iterate throught the request body looking for a radio button called imageradio[0-9]
			for (var reqbody in request.body ){
				if (reqbody.substring(0,10) == "imageradio"){
					radioid=reqbody.substring(10);
					console.log("Found an imageradio, id is " + radioid + ":" + request.body.file[radioid])
					
				}
			}
			newContent.image=request.body.file[radioid];
		}
		
		newContent.type = request.body.type; 
		console.log("In Create-content type is " + request.body.type);
		
		// Check the size, if it's massive, redirect to the contact form with a message
		console.log("Request Body is:" + JSON.stringify(request.body).length);
		if (JSON.stringify(request.body).length > 2048) {
			response.render('manage-content', {
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
	
	app.get('/', function (request, response) {		
		response.redirect('/show-content/home');
	});
	
	
	app.get('/show-content/:type(event|community|vision|home|hire)', function (request, response) {
	
		// Look up the content type 
		var _contentType;
		ContentType.find({'type': request.params.type}, function(err, queryContentType, _contentType) {
			if (err){
				console.log(err);
				return(err);
			}
			_contentType={type: queryContentType[0].type, 
						 description: queryContentType[0].description, 
						 layout: queryContentType[0].layout};

			findAllContentAndAct(request, response, "show-" + _contentType.layout, renderTemplate, _contentType);
		});
	});
	
	app.get('/community', function (request, response) {		
		response.render('community.ejs', {user: request.user});
	});
	
	app.get('/vision', function (request, response) {		
		response.render('vision.ejs', {});
	});
	
	// the login form
	app.get('/login', function (request, response) {		
		response.render('login.ejs', {
			message: request.flash('loginMessage'),
			user: request.user
		});
	});

	// the contact page
	app.get('/contact', function (request, response) {
		
		response.render('contact.ejs', {
			user: request.user,
			message: request.flash('contactMessage')
		});
	});
	
	// Logout
	app.get('/logout', isLoggedIn, function (request, response) {
		request.logout();
		request.session.destroy();
		response.redirect('/show-content/home');

	});

	
	// Page to show contacts received
	app.get('/contacts', isLoggedIn, function (request, response) {

		var _contacts = [];

		Contact.find({}, function(err, queryContacts) {
			var i = 0;
    		queryContacts.forEach(function(contact) {
				_contacts[i] = {date: contact.date, fname: contact.fname, lname: contact.lname, phone: contact.phone, email: contact.email, message: contact.message };
				i++;
			});

			response.render('show-contacts.ejs', {
				user: request.user, 
				contacts: _contacts
			});
	    });
	});

	
	// Page to CRUD content - regexp to avoid recursion for js loads firing for loading e.g. /manage-content/fragment.js
	app.get('/manage-content/:type(event|community|vision|home)', isLoggedIn, function (request, response) {
		
		findAllContentAndAct(request, response, 'manage-content.ejs', renderTemplate)

	});	
	
	// The images pages
	app.get('/gallery', function (request, response) {
		
		fs.readdir(__dirname + '/../public/images/OurHistory', function (err, files) {
  			if (err) throw err;
			response.render('gallery.ejs', {
				user: request.user,
				files: files
			});
		});
		

	});
	
	// authentication route, used by the login form
	app.post('/authenticate', passport.authenticate('local-login', {
		//successRedirect: '/contacts', // redirect to the secure profile section
		successRedirect: '/manage-content/event', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));


	
	// Helpers
	function isLoggedIn(request, response, next) {

		//if (request.isAuthenticated())
		if (request.user)
			return next();

		// if they aren't redirect them to the home page
		response.redirect('/login');
	}
};

// ------------------------------------------------
// findOneContentAndAct: Helper that gets content and calls acallback that's passed in
function findOneContentAndAct(id,request, response, template, callback)
{
	// Deal with document not found error.
	Content.findById(id,function (err, _content) {
		if (err){
			console.error(err);
			response.render('save-error.ejs', {user: request.user});		
		}else{  
			callback(null, _content, request, response, template);
		}
	});
}

// ------------------------------------------------
// findAllContentAndAct: Helper that gets content and calls acallback that's passed in
function findAllContentAndAct(request, response, template, callback, _contentType)
{

	var _content = [];
	Content.find({'type': request.params.type}, function(err, Content) {
		var i = 0;
		Content.forEach(function(content) {
			_content[i] = {	id: content._id, 
							date: content.date, 
							type: content.type, 
							heading: content.heading, 
							content: content.content, 
							image: content.image};
				i++;
		});
		callback(null, _content, request, response, template, _contentType);
	});			 

}

// Callback to render a template
var renderTemplate = function(err, _content, request, response, template, _contentType){	
	// Only get and send files if need be
	fs.readdir(__dirname + '/../public/images/HomePageSmall', function (err, files) {
  			if (err) throw err;
		response.render(template, {
			query: request.query,
			user: request.user,
			type: request.params.type,
			content: _content,
			files: files,
			contentType: _contentType
		});
	});
}

// Callback to delete the object passed (cruD)
var deleteData = function(err, _content, request, response, template){
	
	// No need to check err, we're here becuase it's null,
	// _content guaranteed to be valid however theck incase race condition
	_content.remove();
	
	response.render(template, {
		user: request.user,
		content: _content,
		type: _content.type
	});
};

// callback to show the content passed
var showData = function(err, _content, request, response, template){
	console.log("in showData:" + _content.heading + "user:" + request.user  + "template:" + template);
	response.render(template, {
			user: request.user,
			content: _content
	});
	
}

// callback to save the data passed into the object passed (cRUd)
var saveData = function(err, _content, request, response, template){
	_content.heading = request.body.heading;
	_content.content = request.body.content;
	_content.save(function (err) {
		if (err) return (err);
		response.render(template, {
				user: request.user,
				content: _content,
				type: _content.type
		});
	});
}	

