'use strict';

var methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	apis = require('../apis'),
	aglio = require('aglio'),
	path = require('path'),
	fs = require('fs');

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

	// Adds apis
	apis.forEach(function (api) {
		var doc = api.doc,
			blueprint;

		if (api.root) app.use(api.root, api);
		else app.use(api);

		// If the API referenced a documentation file, we try to load it
		// and to compile it. Then we expose it at /doc/:api_name.
		if (doc) {
			fs.readFile(api.doc, { encoding: 'utf-8' }, function (err, html) {
				aglio.render(html, 'flatly-multi', function (err, html, warnings) {
					if (err) return console.log(err);
					blueprint = html;
				});
			});

			app.get('/doc/' + api.apiName, function (req, res) {
				if (!blueprint) return res.send(404);
				return res.send(200, blueprint);
			});
		}
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
