var mongoose = require('mongoose'),
	Issue = mongoose.model('Issue');


module.exports = function (api) {
	api.createResource('issues', '/issues')
		.representation(function (issue) {

		})

		.post(api.emptyBodyMiddleware, function (req, res, next) {
			var reqBody = req.body,
				issue;

			issue = new Issue(reqBody);
			issue.save(function (err, newIssue) {
				if (err)  return next(api.handleError(err));
				res.answer(api.resource('issue')(newIssue));
			});
		})

		.attachTo(api);
};
