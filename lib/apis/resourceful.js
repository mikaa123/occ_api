var algebra = require('../util/algebra');
	variadic = algebra.variadic;
	fluent = algebra.fluent;
	maybe = algebra.maybe;
	extend = algebra.extend;
	compose = algebra.compose;

var setter = compose(fluent, maybe);

/**
 * A REST Resource that is identified by a path. The path is relative to the
 * **router** the resource is going to be `attachedTo`.
 *
 * How to use:
 *
 *     var usersResource = makeResource('/users');
 *
 * 		usersResource
 * 		    .post(function (req, res) {
 * 			    // Do something meaningful here.
 * 			})
 *
 *          .get(function(req, res) {
 *              // Fetches the users from the database, put it into `users`
 *              res.send(200, usersResource(users))
 *          })
 *
 *          .serializationStrategy(function (entity) {
 *              // An underlying database entity is passed.
 *              // You can process it and transform it to hal+json for example.
 *              return entity;
 *          })
 *
 *          // To make the resource available, attach it to a router.
 *          .attachTo(router);
 *
 * @typedef {Object} Resource
 * @property {string} path The path of the resource relative to the router
 * @property {Object.<string, function>} actions Actions and their middlewares
 * @property {function} attachTo Attach the resource to a Router
 * @property {function} get Sets the GET action on the resource
 * @property {function} post Sets the POST action on the resource
 * @property {function} put Sets the PUT action on the resource
 * @property {function} patch Sets the PATCH action on the resource
 * @property {function} delete Sets the DELETE action on the resource
 */

/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 */
function makeResource(relPath) {
	var serializationStrategy;
	var newResource = setter(function (entity) {
		return serializationStrategy(entity);
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
		actions: {}
	});
}

module.exports = makeResource;
