// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {

	function validateUserDB(username, password, request, fn) {
		
		// find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'uname' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return fn(err);

            // if no user is found, return the message
            if (!user)
                return fn(null, false, request.flash('loginMessage', 'Authentication Failed')); 
						
            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                return fn(null, false, request.flash('loginMessage', 'Authentication Failed')); 
			}else{
            	// all is well, return successful user
				return fn(user);
			}
        });
		
	}

	var LocalStrategy = require('passport-local').Strategy;

	passport.use('local-login', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},
		function (req, email, password, done) { // callback with email and password from our form

			validateUserDB(email, password, req, function (user) {	

				// if no validation fails return the message
				if (!user)
					return done(null, false, req.flash('loginMessage', 'Authentication Failed.'));

				// all is well, return successful user
				return done(null, user);
			});

		}));

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});


}