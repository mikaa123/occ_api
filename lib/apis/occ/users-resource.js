var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	extend = require('../../util/algebra').extend;


module.exports = function (api) {
	api.makeResource('users', '/users')

		.representation(function (users) {
			var _users = users.map(function (user) {
				return api('user')(user, 'partial');
			});

			return {
				count: users.length,
				_embedded: {
					users: _users
				}
			};
		})

		.get(function (req, res) {
			User.find({}, function (err, users) {
				res.answer(api('users')(users));
			});
		})

		.post(api.emptyBodyMiddleware, function (req, res, next) {
			var reqBody = req.body,
				user;

			user = new User(reqBody);

			user.save(function (err, newUser) {
				if (err) 	return next(api.handleError(err));
				res.answer(api('user')(newUser), 201);
			});

		})
		.attachTo(api.router);
};
