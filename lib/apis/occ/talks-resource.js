console.log('CALLING TALKS RESSOURCE');

var mongoose = require('mongoose'),
	makeResource = require('catnap').makeResource,
	Issue = mongoose.model('Issue')
	;

/**
 * Creates an error to send down the middleware stack.
 *
 * Usage:
 * next(error(422, 'Validation failed', [{ field: 'username', message: 'Username too short'}])));
 *
 * @param  {Number} status  HTTP status code of the error
 * @param  {String} msg     A textual description of the error
 * @param  {Array} reasons  An array of Objects that describe the different reasons for the error
 * @return {Error}          an Error object
 */
function error(status, msg, reasons) {
	var err = new Error(msg);
	err.status = status;
	err.reasons = reasons;
	return err;
}

var talksResource = module.exports = makeResource('talks', '/issues/:issueId/talks')

	.post(function (req, res, next) {
		var reqBody = req.body,
			talk;


		if (JSON.stringify(reqBody) === '{}') {
			return next(error(400, "Body should be a JSON hash"));
		}

		talk = reqBody;
		Issue.findOne({ _id: req.params.issueId }, function (err, issue) {
			if (err) res.send(500);
			if (!issue) next();

			issue.talks.push(talk);
			issue.save(function (err, issue) {
				var constructError = function () {
					return Object.keys(err.errors).map(function (k) {
						return {
							field: k.match('password') ? 'password' : k,
							message: err.errors[k].message
						};
					});
				};

				if (err) {
					return next(error(422, 'Validation failed', constructError()));
				}

				res.answer(require('./issue-resource')(issue));
			});
		});
	})
	;
