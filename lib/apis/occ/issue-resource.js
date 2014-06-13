var mongoose = require('mongoose'),
	pick = require('../../util/algebra').pick,
	extend = require('../../util/algebra').extend,
	Issue = mongoose.model('Issue');


module.exports = function (api) {
	api.makeResource('issue', '/issues/:issueId')

		.representation(function (issue) {
			return extend(pick(issue, 'title'), {
				_embedded: {
					talks: issue.talks.map(function (t) {
						t.issueId = issue._id;
						return api('talk')(t);
					})
				},
				_links: {
					self: {
						href: this.path({ issueId: issue.id })
					},
					talks: {
						href: api('talks').path({ issueId: issue.id })
					}
				}
			});
		})

		.get(function (req, res) {
			console.log('heree %s', req.params.issueId);
			Issue.findOne({ _id: req.params.issueId }, function (err, issue) {
				issue && res.answer(api('issue')(issue));
			});
		})

		.attachTo(api.router);
};
