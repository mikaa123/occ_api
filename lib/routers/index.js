'use strict';

var express = require('express'),
	indexRouter = express.Router(),
	routes = {};

indexRouter.route('/')
  .all(function (req, res) {
    res.json({
			welcome: "welcome"
		});
  });

routes.index = indexRouter;
routes.user = require('./user');

module.exports = routes;
