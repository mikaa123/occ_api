var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	jwt = require('jwt-simple'),
	makeResource = require('../resourceful'),
	extend = require('../../util/algebra').extend;

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

/**
 * Creates an error to send down the middleware stack.
 *
 * Usage:
 * next(422, 'Validation failed', [{ field: 'username', message: 'Username too short'}]));
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

/**
 * Serializes the given entity into hal+json. This factory takes an array of
 * links and returns a strategy to use in the `serializationStrategy` of a Resource.
 * @param  {Resource[]} links
 * @return {SerializationStrategy}
 */
var halSerialization = function (links) {
	return maybe(function(entity) {
		var _links = {};

		links && links.forEach(function (l) {
			if (l._name && l.path) {
				_links[l._name] = { href: l.path };
			}
		});
		return extend(entity, {
			'_links': extend(_links, {
				self: { href: this.path }
			})
		});
	});
};

var usersResource = makeResource('users', '/users');

usersResource

	.serializationStrategy(halSerialization([usersResource]))

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

	})

	.get(function(req, res, next) {
		console.log("testing");
	});

	// Returns a serialized version of the resource, according to the model.
	// The strategy defines the media type serialization logic.
	// .serialize(function (model, strategy) {
	// });

	console.log(usersResource({a: 'b'}));
module.exports = function (router) {
	usersResource.attachTo(router);
};
