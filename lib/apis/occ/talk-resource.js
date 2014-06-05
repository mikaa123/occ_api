var mongoose = require('mongoose'),
	makeResource = require('catnap').makeResource,
	pick = require('../../util/algebra').pick,
	extend = require('../../util/algebra').extend
	;

var talkResource = module.exports = makeResource('talk', '/issues/:issueId/talks/:talkId')

	.representation(function (talk) {
		return extend(pick(talk, 'speaker', 'summary'), {
			// _links: {
			// 	self: {
			// 		href: this.path.replace(':issueId', user.id)
			// 	}
			// }
		});
	})

	.post(function (req, res, next) {

	})
	;
