var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	extend = require('../../util/algebra').extend;


module.exports = function (api) {
	api.createResource('users', '/users')

		.representation(function (users) {
			var _users = users.map(function (user) {
				return userResource(user, 'partial');
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
				res.answer(usersResource(users));
			});
		})

		.post(api.emptyBodyMiddleware, function (req, res, next) {
			var reqBody = req.body,
				user;

			user = new User(reqBody);

			user.save(function (err, newUser) {
				if (err) 	return next(api.handleError(err));
				res.answer(api.resource('user')(newUser));
			});

		})
		.attachTo(api);
};
