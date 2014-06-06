'use strict';

var express = require('express'),
	makeResource = require('catnap').makeResource,
	extend = require('../../util/algebra').extend,
	fs = require('fs');


var api = (function apiFactory(config) {
	var _resources = {},
		api =  express.Router();

	api.createResource = function (name, path) {
		return (_resources[name] = makeResource(name, path));
	};

	api.resource = function (name) {
		if (typeof _resources[name] === "undefined") {
			throw (new Error("Resource not defined"));
		}

		return _resources[name];
	};

	api.handleError = function (err) {
		return error(422, 'Validation failed', Object.keys(err.errors).map(function (k) {
			return {
				field: k.match('password') ? 'password' : k,
				message: err.errors[k].message
			};
		}));
	};

	return extend(api, config);
})({
	apiName: 'occ',

	// In order to specify a special mounting path:
	root: '/api',

	// The API-Blueprint documentation file.
	doc: __dirname + '/occDoc.md'
});

function answerMiddleware (req, res, next) {
	res.answer = function (params) {
		res.json(params);
	};

	return next();
}

// Routers are "mini applications"
// - They can have their own middleware stack:
api.use(answerMiddleware);

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

api.emptyBodyMiddleware = function (req, res, next) {

	if (JSON.stringify(req.body) === '{}') {
		return next(error(400, "Body should be a JSON hash"));
	}

	next();
};

// Any file in this directory will be selected by the following filter if
// it ends with '-resources.js'. Keep our code DRY.
var resourceFilter = function (resourcesCb) {
	return function(err, fileNames) {
		resourcesCb(fileNames.filter(function (n) {
			return n.match('-resource.js$');
		}));
	};
};

fs.readdir(__dirname, resourceFilter(function(resources) {
	resources.forEach(function (r) {
		require('./' + r)(api);
	});
}));


module.exports = api;
