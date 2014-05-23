# Sane express server for API

An API express server with token authentication. Built to scale in complexity.

# Configuration steps

## Environment variables

Create a .env and set
TOKEN_SECRET=yourSecret

## Run tests

`npm test`

## Start development server

The server relies on environment variable for some configuration.
In order to use local env variables, we rely on `foreman`. It loads a `.env`
file (that isn't added to version control.) To use it in development mode, run:

`foreman start -e Procfile_dev`

In production,

`foreman start`

# Inspired by

https://github.com/aredo/express4-bootstrap-starter

===============

var userResource = makeResource('/user');
var usersResource = makeResource('/users');

usersResource
	.post(function (req, res) {
		// Create a user
		res.send(201, userResource(user, 'hal'));
	})
