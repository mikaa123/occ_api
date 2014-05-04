'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('express').Router(),
	jwt = require('jwt-simple'),
	User = mongoose.model('User');

function createToken(user) {
	return jwt.encode({
		userId: user.id
	}, process.env.TOKEN_SECRET);
}

users

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
			res.answer({
				token: createToken(newUser)
			});
		});
	})

	.post('/tokens', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			var token;

			if (err) {
				return;
			}

			if (!user) {
				return;
			}

			res.answer({
				token: createToken(user)
			});
		})(req, res, next);
	})

	.get('/protectedCall', passport.authenticate('bearer', { session: false }),
		function (req, res, next) {
			// Set up verifyToken middleware.
			res.answer({
				welcome: "protected call done"
			});
		}
	);

module.exports = users;
