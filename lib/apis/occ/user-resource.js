var mongoose = require('mongoose'),
	pick = require('../../util/algebra').pick,
	extend = require('../../util/algebra').extend,
	User = mongoose.model('User');


module.exports = function (api) {
	api.createResource('user', '/users/:userId')

		.representation(function (user) {
			return extend(pick(user, 'username', 'email', 'createdAt', 'updatedAt'), {
				_links: {
					self: {
						href: this.path({ userId: user.id })
					}
				}
			});
		})

		.representation('partial', function (user) {
			return {
				username: user.username,
				_links: {
					self: {
						href: this.path({ userId: user.id })
					}
				}
			};
		})

		.get(function (req, res) {
			User.findOne({ _id: req.params.userId }, function (err, user) {
				user && res.answer(api.resource('user')(user));
			});
		})
		.attachTo(api);
};
