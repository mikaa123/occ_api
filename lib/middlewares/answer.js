// Defines the function used to talk back to the client.
module.exports = function (req, res, next) {
	res.answer = function (params) {
		res.json(params);
	};

	return next();
};