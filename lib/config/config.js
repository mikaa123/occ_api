'use strict';

var config = {
	development: {
		server: {
			port: 3000,
			hostname: 'localhost'
		},

		database: {
			url: 'mongodb://localhost/occ'
		}
	},
	production: {
		server: {
			port: process.env.PORT
		},

		database: {
			url: process.env.MONGOHQ_URL
		}
	}
};

module.exports = config[process.env.NODE_ENV || 'development'];
