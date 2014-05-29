var mongoose = require('mongoose'),
	makeResource = require('../resourceful'),
	User = mongoose.model('User');

var userResource = module.exports = makeResource('user', '/user/:userId')

	.representation(function (user) {
		return {
			username: user.username,
			_links: {
				self: {
					href: this.path + '/' + user.id
				}
			}
		};
	})

	.representation('partial', function (user) {
		return {
			user: user.username,
			_links: {
				self: {
					href: this.path + '/' + user.id
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
