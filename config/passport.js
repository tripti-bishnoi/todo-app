var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user'); //loading user model

var configAuth = require('./auth'); //load auth variables

module.exports = function(passport){
	//passport session setup ==============================
	//used to serialize the user for the session
	passport.serializeUser((user, done)=>{
		done(null, user.id);
	});

	//used to deserialize the user out of the session
	passport.deserializeUser((id, done)=>{
		User.findById(id, (err, user)=>{
			done(err, user);
		});
	});

	//*********************************************************************
	// LOCAL STRATEGY
	//*********************************************************************

	//using named strategy, cz we have one for login and and one for signup

	//LOCAL SIGNUP ==============================
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email', //overriding username with email
		passwordField : 'password',
		passReqToCallback : true //to pass back entire req to callback
	},
	(req, email, password, done)=>{
		process.nextTick(()=>{
			//checking if user trying to signup already exists
			User.findOne({ 'local.email' : email}, (err, user)=>{
				if(err) return done(err);
				if(user){ //if already exists, flash signupMessage
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else{ //if doesn't exist, create the user
					var newUser = User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					//save the user
					newUser.save((err)=>{
						if(err) throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	//LOCAL LOGIN ==============================
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	(req, email, password, done)=>{
		User.findOne({'local.email' : email}, (err, user)=>{
			if(err) return done(err);
			if(!user){ //if user doesn't exist
				return done(null, false, req.flash('loginMessage', 'No User Found.'));
			}
			if(!user.validPassword(password)){ //if password is incorrect
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password.'));
			}

			return done(null, user);
		});
	}));

	//*********************************************************************
	// FACEBOOK STRATEGY
	//*********************************************************************

	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL
	},
	(token, refreshToken, profile, done)=>{ //fb sends back token and profile
		console.log(JSON.stringify(profile));
		process.nextTick(()=>{
			User.findOne({ 'facebook.id' : profile.id }, (err, user)=>{
				if(err) return done(err);
				if(user) return done(null, user); //if user is found, then log them in
				else{ //if no user is found with fb id, create them
					var newUser = User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.email = 'profile.emails[0].value';

					newUser.save((err)=>{
						if(err) throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

};