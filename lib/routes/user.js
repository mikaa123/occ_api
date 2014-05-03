'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('express').Router(),
	User = mongoose.model('User');

users

	// Local authentication and registration
	.post('/users', function (req, res, next) {
		console.log('--- receiving user information ---');
		console.log(req.body);

		var user = new User(req.body);

		user.save(function (err, newUser) {
			if (err) {
				// Handle error by sending a message in the correct mediaType.
				console.log('an error happened');
				return;
			}

			console.log('user created', newUser);
		});
	})

	// Twitter authentication
	.get('/auth/twitter', passport.authenticate('twitter'))
	.get('/auth/twitter/callback', passport.authenticate('twitter'), function (req, res) {
		console.log('in twitter authenticate callback');
	});

module.exports = users;
