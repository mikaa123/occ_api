var mongoose = require('mongoose'),
	makeResource = require('catnap').makeResource,
	pick = require('../../util/algebra').pick,
	extend = require('../../util/algebra').extend,
	Issue = mongoose.model('Issue');


module.exports = makeResource('issue', '/issues/:issueId')

	.representation(function (issue) {
		return extend(pick(issue, 'title'), {
			_embedded: {
				talks: issue.talks
			},
			_links: {
				talks: require('./talks-resource').path.replace(':issueId', issue.id)
			}
		});
	})

	.get(function (req, res) {
		Issue.findOne({ _id: req.params.issueId }, function (err, issue) {
			issue && res.answer(issueResource(issue));
		});
	})

	;
