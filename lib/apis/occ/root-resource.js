module.exports = function (api) {
	api.makeResource('root', '/')

	.representation(function () {
		return {
			"_links": {
				"self": { "href": "/" },
				"users": { "href": "/users" },
				"authorization": { "href": "/authorization" },
				"issues": { "href": "/issues" }
			}
		};
	})

	.get(function (req, res) {
		res.answer(api('root')());
	})

	.attachTo(api.router);
};
