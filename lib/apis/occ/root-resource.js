var makeResource = require('catnap').makeResource;

module.exports = rootResource = makeResource('root', '/')

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
	});
