var mongoose = require('mongoose'),
	pick = require('../../util/algebra').pick,
	Issue = mongoose.model('Issue'),
	extend = require('../../util/algebra').extend;


module.exports = function (api) {
	api.makeResource('talk', '/issues/:issueId/talks/:talkId')

		.representation(function (talk) {
			var issueId = talk.parent().id;
			return extend(pick(talk, 'speaker', 'summary'), {
				_links: {
					self: {
						href: this.path({ issueId: issueId, talkId: talk.id })
					},
					issue: {
						href: api('issue').path({ issueId: issueId })
					}
				}
			});
		})

		.get(function (req, res, next) {
			Issue.findOne({ 'talks._id': req.params.talkId }, { 'talks.$': 1}, function (err, issue) {
				if (!issue) {
					return next();
				}
				if (!issue.talks) {
					return next();
				}

				issue.talks[0].issueId = issue.id;
				res.answer(api('talk')(issue.talks[0]));
			});
		})

		.attachTo(api.router);
};
