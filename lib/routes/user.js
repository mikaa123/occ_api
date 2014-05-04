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
				res.answer({
					error: 'something wrong happened',
					err: err
				});
				return;
			}

			console.log('user created', newUser);
		});
	})
	.post('/user/session', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			console.log('in authenticate', info);
			if (err) {
				console.log('error!', err);
				return;
			}

			if (!user) {
				console.log('No user!');
				return;
			}

			req.login(user, function (err) {
				if (err) {
					console.log('error loging in', err);
					return next(err);
				}
				console.log('successfully signed in.');
			});

			res.answer({
				status: "welcome"
			});
		})(req, res, next);
	})
	.get('/user/me', function (req, res, next) {
		if (req.isAuthenticated()) {
			console.log('authenticated')
		} else {
			console.log('not authenticated');
		}
	})

	// Twitter authentication
	.get('/auth/twitter', passport.authenticate('twitter'))
	.get('/auth/twitter/callback', passport.authenticate('twitter'), function (req, res) {
		console.log('in twitter authenticate callback');
	});

module.exports = users;
