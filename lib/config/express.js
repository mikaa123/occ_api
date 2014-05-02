'use strict';

var methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')({ session: session }),
	routes = require('../routes');

module.exports = function (app, express, passport) {

	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', 'X-Requested-With');
		next();
	};

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

	app
		.use(cookieParser('red cup of coffee'))
		.use(session({
			secret: 'green cup of coffee',
			store: new MongoStore({
				url: app.config.database.url,
				collection : 'sessions',
				auto_reconnect: true
			})
		}));

	app
		.use(passport.initialize())
		.use(passport.session({
			maxAge: new Date(Date.now() + 3600000)
		}));

	// Adds all the routers
	for (var route in routes) {
		if (routes.hasOwnProperty(route)) {
			app.use(routes[route]);
		}
	}
};
