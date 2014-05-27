var assert = require('assert'),
	should = require('should'),
	makeResource = require('./resourceful');

describe('Resource', function () {
	describe('Creation', function () {
		it('should create a resource when a correct name and path are given', function () {
			var testResource;

			assert.doesNotThrow(function () {
				testResource = makeResource('test', '/test');
			});

			testResource._name.should.eql('test');
			testResource.path.should.eql('/test');
		});

		it('should throw an exception if the name is undefined', function () {
			var testResource;

			assert.throws(function () {
				testResource = makeResource(undefined, '/test');
			});
		});

		it('should throw an exception if the path is undefined', function () {
			var testResource;

			assert.throws(function () {
				testResource = makeResource('test');
			});
		});
	});

	describe('Registering actions', function () {
		var testResource;

		beforeEach(function () {
			testResource = makeResource('test', '/test');
		});

		['get', 'post', 'put', 'patch', 'delete'].forEach(function (action) {
			it('should allow ' + action, function () {
				testResource[action](function (req, res) {
					return 'foo';
				});

				testResource.actions[action][0]()
				.should.eql('foo');
			});
		});

		it('should allow multiple middlewares per actions', function () {
			testResource.get(function () {}, function () {});
			testResource.actions.get.length.should.eql(2);
		});
	});

	describe('Registering models', function() {

		it('should allow default model');

		it('should allow adding named models');

		it('should throw errors if not registered correctly');

	});

	describe('Attaching to routers', function () {

	});
});
