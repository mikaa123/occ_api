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
 * A Resource has to define its representation's serialization.
 */

var algebra = require('../util/algebra');
	variadic = algebra.variadic;
	fluent = algebra.fluent;
	maybe = algebra.maybe;
	extend = algebra.extend;
	compose = algebra.compose;

var setter = compose(fluent, maybe);

/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 *
 * @todo Handles multiple serialization strategy
 */
function makeResource(_name, relPath) {
	var serializationStrategy;
	var newResource = maybe(function (entity) {
		return serializationStrategy.call(newResource, entity);
	});

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

	newResource.serializationStrategy = setter(function (strategy) {
		serializationStrategy = strategy;
	});

	return extend(newResource, {
		path: relPath,
		actions: {},
		_name: _name
	});
}

module.exports = makeResource;
