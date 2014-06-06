var mongoose = require('mongoose'),
	pick = require('../../util/algebra').pick,
	Issue = mongoose.model('Issue'),
	extend = require('../../util/algebra').extend;


module.exports = function (api) {
	api.createResource('talk', '/issues/:issueId/talks/:talkId')

		.representation(function (talk) {
			return extend(pick(talk, 'speaker', 'summary'), {
				_links: {
					self: {
						href: this.path.replace(':issueId', talk.issueId).replace(':talkId', talk.id)
					},
					issue: {
						href: api.resource('issue').path.replace(':issueId', talk.issueId)
					}
				}
			});
		})

		.get(function (req, res, next) {
			Issue.findOne({ 'talks._id': req.params.talkId }, { 'talks.$': 1}, function (err, issue) {
				if (!issue.talks) {
					next();
				}

				issue.talks[0].issueId = issue.id;
				res.answer(api.resource('talk')(issue.talks[0]));
			});
		})

		.attachTo(api);
};
