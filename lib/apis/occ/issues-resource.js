var mongoose = require('mongoose'),
	Issue = mongoose.model('Issue');


module.exports = function (api) {
	api.makeResource('issues', '/issues')
		.representation(function (issues) {
			var _issues = issues.map(function (issue) {
				return api('issue')(issue);
			});

			return {
				count: issues.length,
				_embedded: {
					issues: _issues
				}
			};
		})

		.post(api.emptyBodyMiddleware, function (req, res, next) {
			var reqBody = req.body,
				issue;

			issue = new Issue(reqBody);
			issue.save(function (err, newIssue) {
				if (err)  return next(api.handleError(err));
				res.answer(api('issue')(newIssue), 201);
			});
		})

		.get(function (req, res, next) {
			Issue.find({}, function (err, issues) {
				res.answer(api('issues')(issues));
			});
		})

		.attachTo(api.router);
};
