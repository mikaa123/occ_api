var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	makeResource = require('../resourceful'),
	userResource = require('./user-resource'),
	extend = require('../../util/algebra').extend;

/**
 * Creates an error to send down the middleware stack.
 *
 * Usage:
 * next(error(422, 'Validation failed', [{ field: 'username', message: 'Username too short'}])));
 *
 * @param  {Number} status  HTTP status code of the error
 * @param  {String} msg     A textual description of the error
 * @param  {Array} reasons  An array of Objects that describe the different reasons for the error
 * @return {Error}          an Error object
 */
function error(status, msg, reasons) {
	var err = new Error(msg);
	err.status = status;
	err.reasons = reasons;
	return err;
}

var usersResource = module.exports = makeResource('users', '/users')

	.representation(function (users) {
		var _users = users.map(function (user) {
			return userResource(user, 'partial');
		});

		return {
			count: users.length,
			_embedded: {
				users: _users
			}
		};
	})

	.get(function (req, res) {
		User.find({}, function (err, users) {
			res.answer(usersResource(users));
		});
	})

	.post(function (req, res, next) {
		var reqBody = req.body,
			user;

		// No parameters passed in the body
		if (JSON.stringify(reqBody) === '{}') {
			return next(error(400, "Body should be a JSON hash"));
		}

		user = new User(reqBody);

		user.save(function (err, newUser) {

			// TODO: Extract this function. It will probably be reused
			// across resources.
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
				return next(error(422, 'Validation failed', constructError()));
			}

			res.answer(usersResource(newUser));
		});

	});
