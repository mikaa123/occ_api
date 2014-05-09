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
		var reqBody = req.body,
			user;

		// No parameters passed in the body
		if (JSON.stringify(reqBody) === '{}') {
			res.send(400, {
				errors: {
					message: "Body should be a JSON hash"
				}
			});
		}

		user = new User(reqBody);

		user.save(function (err, newUser) {
			var constructError = function () {
				console.log(Object.keys(err.errors));
				return Object.keys(err.errors).map(function (k) {
					return {
						field: k.match('password') ? 'password' : k,
						message: err.errors[k].message
					};
				});
			};

			if (err) {
				res.send(422, {
					errors: {
						message: 'Validation failed',
						reasons: constructError()
					}
				});
				return;
			}

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
