/**
 * This module exposes a Resource factory function, allowing you to create **resources**.
 *
 * A REST Resource is identified by a name and a path. The path is relative to the
 * **router** where the resource is going to be `attachedTo`.
 *
 * The router is an Express-compatible router. It has to have get, post, patch, put
 * and delete methods. Any router that exposes this interface should be able use the
 * resource.
 *
 * Resources expose verbs methods (get, post, patch, put and delete) that take middleware
 * functions. The middlewares should comply to the router they will be attached to.
 *
 * Example with Express:
 *
 *    var usersResource = makeResource('users', /users');
 *
 *    usersResource
 *        .post(function (req, res) {
 *            // do something meaningful here.
 *        })
 *        .attachTo(anExpressRouter);
 *
 * ## Representations
 *
 * A Resource can have different representations, depending on the media types it
 * responds to. In order to register a serialization strategy, call the `use`
 * method on the resource.
 *
 * The `use` method takes a name and a function. During serialization, the function
 * will be passed the entity to serialize.
 *
 *    usersResource
 *        .use('hal+json', function (entity) {
 *            return extend(entity, { '_links': { 'self': { 'href:' '/' } } } );
 *        })
 *
 * The `use` method can also be called without the name parameter, making the
 * function the default serialization strategy.
 *
 * ## Models
 *
 * A resource's model can differ from the underlying entity (the one stored in
 * your database.) It is thus possible to specify the model of your representation
 * by using the `model` method.
 *
 *     userResource
 *         .model(function (entity) {
 *             return {
 *                 name: entity.name,
 *                 age: entity.age
 *             };
 *         });
 *
 * It allows hiding internal information. During serialization, the model is passed
 * to the serialization strategy.
 *
 * Models can also be names:
 *
 *     userResource
 *         .model('hal+json', function (entity) {
 *             return extend(entity, {
 *                 _links: {
 *                     'self': userResource.path,
 *                     'post': postResource.path
 *                 }
 *             });
 *         })
 *
 * This makes it possible to create strategy-specific models. In the above example,
 * The model will only be provided to the 'hal+json' serialization strategy.
 */

var algebra = require('../util/algebra');
	variadic = algebra.variadic;
	fluent = algebra.fluent;
	maybe = algebra.maybe;
	extend = algebra.extend;
	compose = algebra.compose;

// var setter = compose(fluent, maybe);

function isFunction(f) {
	return typeof f === 'function';
}

/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 *
 * @todo Handles multiple serialization strategy
 */
function makeResource(_name, relPath) {
	var	_representations = {};

	if (!_name || !relPath) {
		throw 'A Resource requires a name and a path.';
	}

	var newResource = function (entity, model) {
		var resource = _representations[model || 'default'];
		return resource && resource(entity) || entity;
	};

	['get', 'post', 'put', 'patch', 'delete'].forEach(function (action) {
		newResource[action] = fluent(variadic(function (middleware) {
			this.actions[action] = middleware;
		}));
	});

	newResource.attachTo = fluent(function (router) {
		for (var verb in this.actions) {
			router[verb].apply(router, [relPath].concat(this.actions[verb]));
		}
		return this;
	});

	newResource.representation = fluent(function (representations) {
		if (isFunction(representations)) {
			_representations['default'] = representations;
			return;
		}

		Object.keys(representations).forEach(function (name) {
			if (!isFunction(representations[name])) return;
			_representations[name] = representations[name];
		});
	});

	return extend(newResource, {
		path: relPath,
		actions: {},
		_name: _name
	});
}

module.exports = makeResource;
