var passport = require('passport')
	users = require('express').Router();

users
	.get('/auth/twitter', passport.authenticate('twitter'))
	.get('/auth/twitter/callback', passport.authenticate('twitter'), function(req, res) {
		console.log('in twitter authenticate callback');
	});

module.exports = users;
