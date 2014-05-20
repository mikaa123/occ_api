var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	jwt = require('jwt-simple');


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

function variadic (fn) {
	var fnLength = fn.length;

	if (fnLength < 1) {
		return fn;
	} else if (fnLength === 1)  {
		return function () {
			return fn.call(
				this, __slice.call(arguments, 0));
		};
	} else {
		return function () {
			var numberOfArgs = arguments.length,
			namedArgs = __slice.call(arguments, 0, fnLength - 1),
			numberOfMissingNamedArgs = Math.max(fnLength - numberOfArgs - 1, 0),
			argPadding = new Array(numberOfMissingNamedArgs),
			variadicArgs = __slice.call(arguments, fn.length - 1);
			return fn.apply(
				this, namedArgs
						.concat(argPadding)
						.concat([variadicArgs]));
		};
	}
}


/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 */
function makeResource(relPath) {
	var newResource;
	var actions = [];

	['get', 'post', 'put', 'delete'].forEach(function (action) {
		newResource[action] = function (middleware) {
			actionMap[action] = middleware;
		};
	});

	newResource.actions = actions;
	return newResource;
}

var usersResource = makeResource('/users');

// Uses fluent interface
usersResource
	.post(function (req, res, next) {

	})

	// Returns a serialized version of the resource, according to the model.
	// The strategy defines the media type serialization logic.
	.serialize(function (model, strategy) {

	});

module.exports = function (router) {

	router

		// User creation route.
		.post('/users', function (req, res, next) {
			var reqBody = req.body,
				user;

			console.log('creating new user');

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

				res.answer(newUser);
			});
		});
};
