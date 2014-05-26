'use strict';

var express = require('express'),
	v1Router = express.Router();


v1Router.apiName = 'v1';

// In order to specify a special mounting path:
v1Router.root = '/api';

// The API-Blueprint documentation file.
v1Router.doc = __dirname + '/v1Doc.md';

function answerMiddleware (req, res, next) {
	res.answer = function (params) {
		res.json(params);
	};

	return next();
}

v1Router.use(answerMiddleware);

// Routers are "mini applications"
// - They can have their own middleware stack:
require('./user-resource')(v1Router);
require('./users-resource')(v1Router);

module.exports = v1Router;
