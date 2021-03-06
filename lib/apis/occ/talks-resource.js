var mongoose = require('mongoose'),
	Issue = mongoose.model('Issue'),
	Talk = mongoose.model('Talk');


module.exports = function (api) {
	api.makeResource('talks', '/issues/:issueId/talks')

		.post(api.emptyBodyMiddleware, function (req, res, next) {
			var reqBody = req.body,
				talk;

			talk = new Talk(reqBody);
			Issue.findOne({ _id: req.params.issueId }, function (err, issue) {
				if (err) res.send(500);
				if (!issue) next();

				issue.talks.push(talk);
				issue.save(function (err, issue) {
					if (err) return next(api.handleError(err));
					talk.parent = function () { return issue; };
					res.answer(api('talk')(talk), 201);
				});
			});
		})
		.attachTo(api.router);
};
