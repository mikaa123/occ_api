'use strict';

var express = require('express'),
	router = express.Router(),
	fs = require('fs');

router.apiName = 'v1';

// In order to specify a special mounting path:
router.root = '/api';

// The API-Blueprint documentation file.
router.doc = __dirname + '/v1Doc.md';

function answerMiddleware (req, res, next) {
	res.answer = function (params) {
		res.json(params);
	};

	return next();
}

// Routers are "mini applications"
// - They can have their own middleware stack:
router.use(answerMiddleware);

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
		require('./' + r).attachTo(router);
	});
}));


module.exports = router;
