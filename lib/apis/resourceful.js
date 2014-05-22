var variadic = require('../util/algebra').variadic;

/**
 * Factory function to create Resource objects
 * @param  {String} relPath The relative path of the resource.
 * @return {Resource}
 */
function makeResource(relPath) {
	var newResource = {
		path: relPath,
		actions: {}
	};

	['get', 'post', 'put', 'delete'].forEach(function (action) {
		newResource[action] = variadic(function (middleware) {
			this.actions[action] = middleware;
			return this;
		});
	});

	newResource.attachTo = function (router) {
		for (var verb in this.actions) {
			router[verb].apply(router, [relPath].concat(this.actions[verb]));
		}
		return this;
	};
	return newResource;
}

module.exports = makeResource;
