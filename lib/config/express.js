'use strict';

var methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	apis = require('../apis'),
	path = require('path');

module.exports = function (app, express, passport) {

	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	};

	app
		.set('views', path.join(__dirname, '../views'))
		.set('view engine', 'hbs');


	app
		.set('env', process.env.NODE_ENV || 'development')
		.set('port', app.config.server.port || '3000');

	app
		.enable('trust proxy');

	app
		.disable('x-powered-by');

	app
		.use(bodyParser())
		.use(methodOverride())
		.use(allowCrossDomain);

	// Authentication
	app
		.use(passport.initialize());

	// Custom middlewares
	app
		.use(require('../middlewares/answer'));

	// Adds apis
	apis.forEach(function (api) {
		if (api.root) app.use(api.root, api);
		else app.use(api);
	});

	// Error catching middleware.
	// If there's an error, it will be catched there and sent.
	// It won't be called otherwise.
	app.use(function (err, req, res, next) {
		var errors = {};

		if (!err.status) {
			res.send(500);
		}

		if (!err.message) {
			res.send(err.status);
		}

		err.message && (errors.message = err.message);
		err.reasons && (errors.reasons = err.reasons);

		res.send(err.status, { errors: errors });
	});

	// Handle 404s
	app.use(function(req, res, next) {
      var err = new Error('Not Found');
      res.status(404).render('404', {
        url: req.protocol + '://' + req.headers.host + req.originalUrl,
        error: 'Sorry, the page doesn\'t exist.'
      });
  });
};
