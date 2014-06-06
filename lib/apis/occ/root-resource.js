module.exports = function (api) {
	api.createResource('root', '/')

	.representation(function () {
		return {
			"_links": {
				"self": { "href": "/" },
				"users": { "href": "/users" },
				"tokens": { "href": "/tokens" }
			}
		};
	})

	.get(function (req, res) {
		res.send(200, rootResource());
	})

	.attachTo(api);
};
