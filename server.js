'use strict';

var express = require('express'),
	passport = require('passport'),
	http = require('http'),
	mongoose = require('mongoose'),
	config = require('./lib/config/config'),
	app = express();

app.config = config;

require('./lib/config/database')(app, mongoose);
require('./lib/models');
require('./lib/config/passport')(app, passport);
require('./lib/config/express')(app, express, passport);

var server = http.createServer(app)
  .listen(app.get('port'), config.server.hostname, function (err) {

    if (err) {
      return console.trace(err);
    }

    console.log('✔ Express server listening on port %d in %s mode', app.get('port'), app.get('env'));

  });

server.on('error', function (err) {
  console.error('✗ '+ app.get('port') + err);
  // TODO: do something with the error
});

module.exports = app;
