var variadic = require('../util/algebra').variadic;
var fluent = require('../util/algebra').fluent;
var maybe = require('../util/algebra').maybe;

/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 */
function makeResource(relPath) {
	var serializationStrategy;
	var newResource = fluent(maybe(function (entity) {
		return serializationStrategy(entity);
	}));
	newResource.path = relPath;
	newResource.actions = {};

	['get', 'post', 'put', 'delete'].forEach(function (action) {
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

	newResource.serializationStrategy = fluent(maybe(function (strategy) {
		serializationStrategy = strategy;
	}));

	return newResource;
}

module.exports = makeResource;
