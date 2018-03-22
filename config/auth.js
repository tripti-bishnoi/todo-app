module.exports = {
	'facebookAuth' : {
		'clientID' : '165193944291791',
		'clientSecret' : '320f56c5bc6318c3310957f2767e717e',
		'callbackURL' : 'http://localhost:3000/auth/facebook/callback',
		'profileURL' : 'https://graph.facebook.com/v2.12/me?fields=first_name,last_name,email',
		'profileFields' : ['id', 'emails', 'name'] //for requesting permissions from fb api
	}
};