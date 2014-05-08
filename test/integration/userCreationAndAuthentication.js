var request = require('supertest'),
	app = require('../../server.js');

describe('POST /users', function () {
	it('should return 400 Bad Request', function (done) {
		request(app)
			.post('/users')
			.expect(400, done);
	});
});