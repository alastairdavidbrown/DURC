// app/routes.js

// load up the contact model
var Contact = require('../app/models/contact');
// load up the contact model
var User = require('../app/models/user');



module.exports = function (app, passport) {
	
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
			var newUser = new User();
		newUser.uname = "MeM";
			newUser.save(function (err) {
				console.log(err);
				if (err) return console.error(err); // we should handle this
			});		
			// confirm to the user that we'll get back
			response.render('contact-confirm');
					
		}
		
		response.end();
			

	});

	// dump a stack
	app.get('/dump', function (req, res) {
		
		console.log(new Error().stack);
		console.log("Trace");
		console.trace();
		
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
	
	app.get('/logout', function (req, res) {
		
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
		req.logout();
		req.session.destroy();
	});

	app.get('/contacts', isLoggedIn, function (req, res) {

		var contacts = [];

		Contact.find({}, function(err, queryContacts) {
			var i = 0;
    		queryContacts.forEach(function(contact) {
				contacts[i] = {date: contact.date, fname: contact.fname, lname: contact.lname, phone: contact.phone, email: contact.email, message: contact.message };
				i++;
			});

			res.render('show-contacts.ejs', {
				user: req.user, 
				contacts: contacts
			});
		
		
	    });
		
		
	});

	app.get('/signup', isLoggedIn, function (req, res) {
			res.render('signup.ejs');
	});

	
	// authentication route, used by the login form
	app.post('/authenticate', passport.authenticate('local-login', {
		successRedirect: '/contacts', // redirect to the secure profile section
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