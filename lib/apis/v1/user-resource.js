var mongoose = require('mongoose'),
	makeResource = require('catnap').makeResource,
	pick = require('../../util/algebra').pick,
	extend = require('../../util/algebra').extend,
	User = mongoose.model('User');

var userResource = module.exports = makeResource('user', '/user/:userId')

	.representation(function (user) {
		return extend(pick(user, 'username', 'createdAt', 'updatedAt'), {
			_links: {
				self: {
					href: this.path.replace(':userId', user.id)
				}
			}
		});
	})

	.representation('partial', function (user) {
		return {
			username: user.username,
			_links: {
				self: {
					href: this.path.replace(':userId', user.id)
				}
			}
		};
	})

	.get(function (req, res) {
		console.log(req.params);
		User.findOne({ _id: req.params.userId }, function (err, user) {
			user && res.answer(userResource(user));
		});
	});
