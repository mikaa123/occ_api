var mongoose = require('mongoose'),
	makeResource = require('catnap').makeResource,
	issueResource = require('./issue-resource'),
	Issue = mongoose.model('Issue');


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


var issuesResource = module.exports = makeResource('issues', '/issues')

	.representation(function (issue) {

	})

	.post(function (req, res, next) {
		var reqBody = req.body,
			issue;

		console.log(reqBody);
		// No parameters passed in the body
		// FIXME: Middleware?
		if (JSON.stringify(reqBody) === '{}') {
			return next(error(400, "Body should be a JSON hash"));
		}

		issue = new Issue(reqBody);

		issue.save(function (err, newIssue) {
			// TODO: Extract this function. It will probably be reused
			// across resources. Higher-oder function at the API level?
			var constructError = function () {
				console.log(Object.keys(err.errors));
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

			res.answer(issueResource(newIssue));
		});
	})

	;
