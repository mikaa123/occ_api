'use strict';

var express = require('express'),
	v1Router = express.Router();

require('./user')(v1Router);

module.exports = v1Router;
