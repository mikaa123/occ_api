var mongoose = require('mongoose'),
	Issue = mongoose.model('Issue');


module.exports = function (api) {
	api.createResource('talks', '/issues/:issueId/talks')

		.post(api.emptyBodyMiddleware, function (req, res, next) {
			var reqBody = req.body,
				talk;

			talk = reqBody;
			Issue.findOne({ _id: req.params.issueId }, function (err, issue) {
				if (err) res.send(500);
				if (!issue) next();

				issue.talks.push(talk);
				issue.save(function (err, issue) {
					if (err) return next(api.handleError(err));
					talk.parent = function () { return issue; };
					res.answer(api.resource('talk')(talk), 201);
				});
			});
		})
		.attachTo(api);
};
