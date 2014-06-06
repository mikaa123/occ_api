var mongoose = require('mongoose'),
	pick = require('../../util/algebra').pick,
	extend = require('../../util/algebra').extend,
	Issue = mongoose.model('Issue');


module.exports = function (api) {
	api.createResource('issue', '/issues/:issueId')

		.representation(function (issue) {
			return extend(pick(issue, 'title'), {
				_embedded: issue.talks.map(function (t) {
					t.issueId = issue._id;
					return api.resource('talk')(t);
				}),
				_links: {
					talks: api.resource('talks').path.replace(':issueId', issue.id)
				}
			});
		})

		.get(function (req, res) {
			Issue.findOne({ _id: req.params.issueId }, function (err, issue) {
				issue && res.answer(api.resource('issue')(issue));
			});
		})

		.attachTo(api);
};