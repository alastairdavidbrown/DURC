// app/routes.js

// Refactors
// break the monolith
// put the real content into hire
// get rid of console logging
// check big messages are handled well
// content-confirm consistency of parameters
// remove regexps on the :params shouldn't be required if absolute paths used on the hrefs in the template. 
// get rid of the  from the contents etc.
// manage-content for home and room rent
// cancel on delete content
// confirm on delete content
// upload content
// backup content
// rename edit-content
// findContentByTypeAndRender make work for single row where id not working
// abstract image locations
// are arrays for content necessary (why note pass the mongosse reult set) 
//
// Nasty Hacks 
// determinig which home page content manage image is selected 
// U/X for the content manage where pictures are selected
// make findContentByTypeAndRender generic for show and manage.



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
				if (err) {
				}
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
	
	// Page to CRUD content - regexp to avoid recursion for js loads firing for loading e.g. /manage-content/fragment.js
	app.get('/manage-content/:type(event|community|vision|home|hire)', isLoggedIn, function (request, response) {
		findContentByTypeAndRender(request, response, renderTemplate)
		//findContentByTypeAndRender(request, response, 'manage-content.ejs', renderTemplate)

	});	
	
	
	app.post('/manage-content/:type(event|community|vison|home|hire)', isLoggedIn, function (request, response) {

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
				if (err) {
					console.error(err);
					response.render('generic-error.ejs', {user: request.user});		
				}	
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
		findContentByTypeAndRender(request, response, renderTemplate);
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

		var contacts = [];

		Contact.find({}, function(err, queryContacts) {
			var i = 0;
    		queryContacts.forEach(function(contact) {
				contacts[i] = {date: contact.date, fname: contact.fname, lname: contact.lname, phone: contact.phone, email: contact.email, message: contact.message };
				i++;
			});

			response.render('show-contacts.ejs', {
				user: request.user, 
				contacts: contacts
			});
	    });
	});

	
	
	// The images pages
	app.get('/gallery', function (request, response) {
		
		fs.readdir(__dirname + '/../public/images/OurHistory', function (err, files) {
  			if (err){
				console.error(err);
				response.render('generic-error.ejs', {user: request.user});		
			} 
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
	// find a content object (by id) and acto on it
	Content.findById(id,function (err, content) {
		if (err){
			console.error(err);
			response.render('generic-error.ejs', {msg: err.message, user: request.user});		
		}else{  
			if (!content)
				response.render('generic-error.ejs', {msg: 'No content found for id:' + id, user: request.user});
			else
				callback(null, content, request, response, template);
		}
	});
}

// ------------------------------------------------
// findContentByTypeAndRender: Helper that gets content and calls acallback that's passed in
// if id is null it gets all content of the passed type, otherwise the specific id
function findContentByTypeAndRender(request, response, callback)
{

	// get the content 
	var content = [];
	
	Content.find({'type': request.params.type}, function(err, contents) {

		if (err){
			console.error(err);
			response.render('generic-error.ejs', {user: request.user});		
		}else{  

			var i = 0;
			// iterate through content and create an object that reporesents the content
			contents.forEach(function(queryContents) {
				content[i] = {	id: queryContents._id, 
								date: queryContents.date, 
								type: queryContents.type, 
								heading: queryContents.heading, 
								content: queryContents.content, 
								image: queryContents.image};
				i++;
			});

			// Get the content type
			var contentType;
			// Look up the content type
			ContentType.find({'type': request.params.type}, function(err, queryContentType) {
				if (err){
					console.error(err);
					render('generic-error.ejs');
				}

				var contentType={	type: queryContentType[0].type, 
									description: queryContentType[0].description, 
									layout: queryContentType[0].layout};
				// if the calling URL was .*/manage-content/ override the template
				if(request.originalUrl.match('/manage-content')) contentType.layout='manage-content.ejs';

				// Call the callback, if the oringinal URL is show-content then the template is 
				callback(null, content, request, response, contentType);	

			});

		}
				 
	});
}



// -----------------------------------------------------------------------------------------------
// Callback to render a template
var renderTemplate = function(err, content, request, response, contentType){	
	// Only get and send files if need be
	fs.readdir(__dirname + '/../public/images/HomePageSmall', function (err, files) {
		
  		if (err){
			console.error(err);
			response.render('generic-error.ejs', {user: request.user});		
		}

		response.render(contentType.layout, {
			query: request.query,
			user: request.user,
			type: request.params.type,
			content: content,
			files: files,
			contentType: contentType
		});
	});
}

// Callback to delete the object passed (cruD)
var deleteData = function(err, content, request, response, template){
	
	// No need to check err, we're here becuase it's null,
	// content guaranteed to be valid however check incase of race condition
	content.remove();
	
	response.render(template, {
		user: request.user,
		content: content,
		type: content.type
	});
};

// callback to show the content passed
var showData = function(err, content, request, response, template){
	console.log("in showData:" + content.heading + "user:" + request.user  + "template:" + template);
	response.render(template, {
			user: request.user,
			content: content
	});
	
}

// callback to save the data passed into the object passed (cRUd)
var saveData = function(err, content, request, response, template){
	content.heading = request.body.heading;
	content.content = request.body.content;
	content.save(function (err) {
		if (err) return (err);
		response.render(template, {
				user: request.user,
				content: content,
				type: content.type
		});
	});
}	

