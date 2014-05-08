'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('express').Router(),
	jwt = require('jwt-simple'),
	User = mongoose.model('User');

// This is the place where the token gets generated.
function createToken(user) {
	var expireIn = function (seconds) {
		return new Date(Date.now() + ( seconds * 1000)).getTime();
	};
	return jwt.encode({
		userId: user.id,
		exp: expireIn(3600)
	}, process.env.TOKEN_SECRET);
}

users

	// User creation route
	.post('/users', function (req, res, next) {
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

	// Token creation route
	.post('/tokens', passport.authenticate('local', { session: false }),
		function (req, res, next) {
			var user = req.user,
				token;

			if (!user) {
				return;
			}

			res.answer({
				token: createToken(user)
			});
		}
	)

	// Protected call example
	.get('/protectedCall', passport.authenticate('bearer', { session: false }),
		function (req, res, next) {
			res.answer({
				welcome: "protected call done"
			});
		}
	);

module.exports = users;
