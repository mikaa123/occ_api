var makeResource = require('catnap').makeResource,
	jwt = require('jwt-simple'),
	passport = require('passport');

// This is the place where the token gets generated.
function createToken(user) {
	var expireIn = function (seconds) {
		return new Date(Date.now() + ( seconds * 1000)).getTime();
	};
	return jwt.encode({
		userId: user.id,
		exp: expireIn(3600)
	}, process.env.TOKEN_SECRET);
}

module.exports = authorizationResource = makeResource('authorization', '/authorization')

	.representation(function (user) {
		return {
			token: createToken(user)
		};
	})

	.get(passport.authenticate('basic', { session: false }), function (req, res) {
		var user = req.user;

		if (!user) {
			return;
		}

		res.answer(authorizationResource(user));
	});
