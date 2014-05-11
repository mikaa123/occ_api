'use strict';

var express = require('express'),
	v1Router = express.Router();


// In order to specify a special mounting path:
v1Router.root = '/api';

// Routers are "mini applications"
// - They can have their own middleware stack:

// v1Router.use(function (req, res, next) {
// 	console.log('middleware function');
// 	next();
// });

require('./user')(v1Router);

module.exports = v1Router;
